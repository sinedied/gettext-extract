'use strict';

const path = require('path');
const fs = require('fs-extra');
const minimist = require('minimist');
const chalk = require('chalk');
const findUp = require('find-up');
const {GettextExtractor, JsExtractors, HtmlExtractors} = require('gettext-extractor');

const defaultConfigFile = '.gettext.json';
const configKey = 'gettext';
const defaultOutputFile = 'template.pot';
const help = chalk`
{bold Usage:} gettext-extract [options]

{bold Options:}
  -c, --config  Config file [default: ${defaultConfigFile}]
  -o, --output  Output file [default: ${defaultOutputFile}]
  -h, --help    Show this help
`;

class GettextExtractCli {
  constructor(args) {
    this._options = minimist(args, {
      string: ['config', 'output'],
      boolean: 'help',
      alias: {
        c: 'config',
        o: 'output',
        h: 'help'
      }
    });
  }

  run() {
    if (this._options.help) {
      return this._help();
    }
    const config = this._loadConfig(this._options.config);
    this._extract(config, this._options.outputFile);
  }

  _extract(config, outputFile) {
    outputFile = outputFile || config.output || defaultOutputFile;

    const extractor = new GettextExtractor();
    let noParser = true;

    if (config.js && config.js.parsers) {
      noParser = false;
      extractor
        .createJsParser(config.js.parsers.map(parser => {
          return JsExtractors.callExpression(parser.expression, parser);
        }))
        .parseFilesGlob(config.js.glob.pattern || 'src/**/*.@(ts|js|tsx|jsx)', config.js.glob.options);
    }

    if (config.html && config.html.parsers) {
      noParser = false;
      extractor
        .createHtmlParser(config.html.parsers.map(parser => {
          if (parser.element) {
            return HtmlExtractors.elementContent(parser.element, parser);
          } else if (parser.attribute) {
            return HtmlExtractors.elementAttribute(`[${parser.attribute}]`, parser.attribute, parser);
          }
          return this._exit(chalk`{red Error, unknown HTML parser type}`);
        }))
        .parseFilesGlob(config.html.glob.pattern || 'src/**/*.html)', config.html.glob.options);
    }

    if (noParser) {
      this._exit(chalk`{yellow No parser configuration found}`);
    }

    fs.ensureDirSync(path.dirname(outputFile));
    extractor.savePotFile(outputFile, config.headers);
    extractor.printStats();
  }

  _loadConfig(file) {
    file = file || defaultConfigFile;
    file = findUp.sync(file);
    let config = null;

    if (file) {
      config = require(file);
    } else {
      file = findUp.sync('package.json');
      config = file ? require(file)[configKey] : null;
    }

    if (!config) {
      this._exit(chalk`{yellow No configuration found}`);
    }
    return config;
  }

  _help() {
    this._exit(help);
  }

  _exit(error, code = 1) {
    console.error(error);
    process.exit(code);
  }
}

module.exports = GettextExtractCli;
