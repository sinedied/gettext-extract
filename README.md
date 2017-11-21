# :speech_balloon: gettext-extract

[![NPM version](https://img.shields.io/npm/v/gettext-extract.svg)](https://www.npmjs.com/package/gettext-extract)
[![Build status](https://img.shields.io/travis/sinedied/gettext-extract/master.svg)](https://travis-ci.org/sinedied/gettext-extract)
![Node version](https://img.shields.io/node/v/gettext-extract.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License](https://img.shields.io/npm/l/gettext-extract.svg)](LICENSE)

> CLI for extracting Gettext messages from JavaScript, TypeScript, JSX and HTML

This CLI is essentially a convenience wrapper around
[gettext-extractor](https://github.com/lukasgeiter/gettext-extractor), all the processing is done by this library.

## Installation

```sh
npm install gettext-extract
```

## Usage
```
Usage: gettext-extract [options]

Options:
  -c, --config  Config file [default: .gettext.json]
  -o, --output  Output file [default: template.pot]
  -h, --help    Show this help
```

## Configuration

Configuration for message extraction can be provided using a `.gettext.json` file, a custon JSON file using the
`--config` CLI option or by adding a `gettext` object in your `package.json`.

Here is an example configuration:
```json
{
  "js": {
    "parsers": [
      {
        "expression": "gettext",
        "arguments": {
          "text": 0
        }
      },
      {
        "expression": "ngettext",
        "arguments": {
          "text": 0,
          "textPlural": 1
        }
      },
      {
        "expression": "pgettext",
        "arguments": {
          "context": 0,
          "text": 1
        }
      }
    ],
    "glob": {
      // [node-glob pattern(https://github.com/isaacs/node-glob#glob-primer) to match your JS files
      "pattern": "src/**/*.ts",
      // Add any [node-glob options](https://github.com/isaacs/node-glob#options) here
      "options": {
        "ignore": "src/**/*.spec.ts"
      }
    }
  },
  "html": {
    "parsers": [
      {
        // Extract message from content of the HTML element with the specified CSS selector
        "element": "[translate]",
        "attributes": {
          "textPlural": "translate-plural",
          "context": "translate-context"
        }
      },
      {
        // Extract message from attribute of the HTML element
        "attribute": "translate-text",
        "attributes": {
          "textPlural": "translate-plural",
          "context": "translate-context"
        }
      }
    ],
    "glob": {
      "pattern": "src/**/*.html"
    }
  },
  //
  "headers": {
    "Language": ""
  },
  "output": "translations/template.pot"
}
```

At least one valid parser (JS or HTML) with glob pattern must be present, everything else is optional.

You can fin additional information concerning the
[JavaScript / TypeScript / JSX](https://github.com/lukasgeiter/gettext-extractor/wiki/JavaScript%2C-TypeScript%2C-JSX)
or [HTML](https://github.com/lukasgeiter/gettext-extractor/wiki/HTML) parsers on the `gettext-extractor` wiki.
