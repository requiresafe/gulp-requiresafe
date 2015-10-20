'use strict';

var GulpUtil = require('gulp-util');
var Chalk = require('chalk');
var Table = require('cli-table');
var Fs = require('fs');
var RequireSafe = require('requiresafe');

var rsGulp = function (params, callback) {

  var payload = {};

  if (params.package) {

    if (typeof params.package === 'string') {
      // try and load it
      try {
        payload.package = JSON.parse(Fs.readFileSync(params.package));
      } catch (err) {
        return callback(Chalk.yellow('(+) ') + err);
      }
    } else {
      payload.package = params.package;
    }
  }

  if (params.shrinkwrap) {
    if (typeof params.shrinkwrap === 'string') {
      // try and load it
      try {
        payload.shrinkwrap = JSON.parse(Fs.readFileSync(params.shrinkwrap));
      } catch (err) {
        return callback(Chalk.yellow('(+) ') + err);
      }
    } else {
      payload.shrinkwrap = params.shrinkwrap;
    }
  }

  RequireSafe.check(payload, function (err, data) {

    if (err) {
      return callback(Chalk.yellow('(+) ') + err);
    }

    var width = 80;
    if (process.stdout.isTTY) {
      width = process.stdout.getWindowSize()[0] - 10;
    }

    var stack = '\n';

    if (data.length === 0) {

      stack = stack + Chalk.green('(+)') + ' No known vulnerabilities found';
    } else {

      data.map(function (finding) {

        var table = new Table({
          head: ['', finding.title],
          colWidths: [15, width - 15]
        });

        table.push(['Name', finding.module]);
        table.push(['Version', finding.version]);
        table.push(['Path', finding.path]);
        table.push(['More Info', finding.advisory]);

        stack = stack + table.toString() + '\n';

      });

      stack = stack + Chalk.red('(+) ') + data.length + ' vulnerabilities found\n';
    }

    if (params.stopOnError === false || data.length === 0) {
      GulpUtil.log(stack);
      return callback();
    }

    return callback({
      stack: stack,
      message: Chalk.red('(+) ') + data.length + ' vulnerabilities found\n'
    });


  });

};

module.exports = rsGulp;
