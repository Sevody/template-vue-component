const fs = require('fs')
const path = require('path')

function camelcase(str) {
  return str.replace(/([\-_\s]+[a-z])|(^[a-z])/g, $1 => $1.toUpperCase())
          .replace(/[\-_\s]+/g, '')
}

module.exports = {
  template: 'handlebars',
  prompts: {
    name: {
      message: 'Component name in kebab-case format',
      default: 've-awesome-component',
      store: true
    },
    description: {
      message: 'How would you descripe the new project?',
      default: `A Vue.js component module`
    },
    username: {
      message: 'What is your GitHub username?',
      default: ':gitUser:',
      store: true
    },
    email: {
      message: 'What is your GitHub email?',
      default: ':gitEmail:',
      store: true
    },
    website: {
      message: 'The URL of your website?',
      default({username}) {
        return `github.com/${username}`
      },
      store: true
    }
  },
  data(answers) {
    return {
      author: answers.username,
      camelcaseName: camelcase(answers.name)
    }
  },
  move(answers) {
    return {
      'gitignore': '.gitignore'
    }
  },
  gitInit: true,
  installDependencies: true,
  post(context, stream) {
    const answers = context.answers
    const isNewFolder = context.isNewFolder
    const logger = context.log
    const cmpDir = isNewFolder ? path.resolve(context.folderName, 'src/Component') : 'src/Component'
    const testDir = isNewFolder ? path.resolve(context.folderName, 'test') : 'test'
    fs.renameSync(
      path.resolve(cmpDir, 'Component.vue'),
      path.resolve(cmpDir, answers.name + '.vue')
    );
    fs.renameSync(
      path.resolve(cmpDir, 'Component.md'),
      path.resolve(cmpDir, answers.name + '.md')
    );
    fs.renameSync(
      cmpDir,
      path.resolve(cmpDir, '../', answers.name)
    );
    fs.renameSync(
      path.resolve(testDir, 'specs/Component.spec.js'),
      path.resolve(testDir, 'specs/' + answers.name + '.spec.js')
    );

    logger.info("To get started:");
    if (isNewFolder) logger.info("cd " + answers.folderName);

    const logFiles = {
      component: path.relative(
        answers.folderName,
        path.resolve(answers.folderName, 'src', answers.name, answers.name + '.vue')
      ),
      componentDoc: path.relative(
        answers.folderName,
        path.resolve(answers.folderName, 'src', answers.name, answers.name + '.md')
      ),
      usage: path.relative(
        answers.folderName,
        path.resolve(answers.folderName, 'docs/*.md')
      )
    }
    logger.info("1. Install dependencies: npm install");
    logger.info("2. Write your component in " + logFiles.component);
    logger.info(
      "3. Write the component doc in " +
      logFiles.componentDoc +
      ' or in the component itself using jsdoc'
    );
    logger.info("4. Write the demo and usage instructions in " + logFiles.usage);
    logger.info("5. Access demo and docs with npm run serve");
    logger.info("6. Build with: npm run build");
    logger.info("7. Build docs with: npm run build:doc");
  }
}
