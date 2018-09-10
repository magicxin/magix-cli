#!/usr/bin/env node

const commander = require('commander')
commander
  .version(require('../package').version , '-v --version')
  .usage('<command> [options]')
  //.option('init', 'create a new project')
  //.parse(process.argv);
  .command('init','create a new project')
  .parse(process.argv)
  
