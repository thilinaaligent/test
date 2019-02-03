const chalk = require('chalk');

module.exports = (message, type) => {
  let log;

  switch (type) {
    case 'log':
      log = chalk.blue(message);
      break;
    case 'warn':
      log = chalk.keyword('orange')(message);
      break;
    case 'error':
      log = chalk.red.bold(message);
      break;
    case 'success':
    default:
      log = chalk.green(message);
      break;
  }

  console.log(log);
};