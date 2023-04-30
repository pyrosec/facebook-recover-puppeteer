#!/usr/bin/env node
'use strict';

const path = require('path');

const { createLogger, PuppeteerCLI } = require('base-puppeteer');

const logger = createLogger(require('../package').name);

const cli = new PuppeteerCLI({
  programName: 'facebook-recover',
  puppeteerClassPath: path.join(__dirname, '..', 'lib', 'facebook-recover'),
  logger
});

(async () => {
  await cli.runCLI();
})().catch((err) => logger.error(err));
