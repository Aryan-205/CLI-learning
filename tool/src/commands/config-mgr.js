const chalk = require('chalk').default;
const { cosmiconfigSync } = require('cosmiconfig');
const schema = require('../config/schema.json');
const Ajv = require('ajv').default;
const ajv = new Ajv();
const configLoader = cosmiconfigSync('tool');

module.exports = function getConfig() {
  const result = configLoader.search(process.cwd());
  if (!result) {
    console.log(chalk.yellow('Could not find configuration, using default'));
    return { port: 1234 };
  } else {
    const isValid = ajv.validate(schema, result.config);
    if (!isValid) {
      console.log(chalk.yellow('Invalid configuration was supplied'));
      console.log(ajv.errors);
      process.exit(1);
    }
    console.log('Found configuration', result.config);
    return result.config;
  }
}