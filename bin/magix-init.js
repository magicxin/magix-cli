#!/usr/bin/env node
const commander = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
/**
 * Usage.
 */

commander
  .usage('<template-name> [project-name]')
  .command('simple')
  //.option('-c, --clone', 'use git clone')
  //.option('--offline', 'use cached template')
  
  commander.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ magix init simple <projectName>')
  console.log()
  console.log(chalk.gray('    # create a new project straight from a github template'))
  console.log('    $ magix init username/repo <projectName')
  console.log()
})

/**
 * Help.
 */

function help () {
  commander.parse(process.argv)
  if (commander.args.length < 1) return commander.help()
}
help()

let template = commander.args[0]
let target = commander.args[1]
const hasSlash = template.indexOf('/') > -1

// magix init simple projectname commander.arg[0] -- simple  arg[1]  -- projectname
// console.log(commander.args)
// console.log(process.cwd())
// console.log(__dirname)
// console.log(__filename)
// download from local

if(!hasSlash) {
  fs.exists(target, function(exists) {
    if(exists) { // fold exist
      inquirer.prompt([{
        type: 'confirm',
        message: 'Target directory exists. Continue?',
        name: 'ok'
      }]).then(answers => {
        if (answers.ok) {
          traverse(path.join(__dirname,'../' + template),target)
        }
      }).catch()
    }else {
      console.log('not exist')
      fs.mkdirSync(target);
      traverse(path.join(__dirname,'../' + template),target)
  }
  })
}else { // download from github
  console.log('else')
}

function traverse(templatePath, targetPath) {
try {
  const paths = fs.readdirSync(templatePath);
  paths.forEach(_path => {
    const _targetPath = path.resolve(targetPath, _path);
    const _templatePath = path.resolve(templatePath, _path);
    console.log("creating..." + _targetPath);
    if (!fs.statSync(_templatePath).isFile()) {
      fs.mkdirSync(_targetPath);
      traverse(_templatePath, _targetPath);
    } else {
      copyFile(_targetPath, _templatePath);
    }
  });
} catch (error) {
  console.log(error);
  return false;
}
return true;
}

function copyFile(_targetPath, _templatePath) {
  fs.writeFileSync(_targetPath, fs.readFileSync(_templatePath));
}