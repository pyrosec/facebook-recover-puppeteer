"use strict";

import { BasePuppeteer } from "base-puppeteer";
import url from "url";
import qs from "querystring";

const puppeteer = require("puppeteer-extra");
const lodash = require('lodash');

const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: process.env.TWOCAPTCHA_TOKEN,
    },
    visualFeedback: true,
  })
);

export class FacebookRecoverPuppeteer extends BasePuppeteer {
  formatResult(v) {
    const split = lodash.uniq(v.split('\n').map((v) => v.trim()).filter(Boolean)).filter((v) => !(v.match(/^(?:Send|How|Facebook)/)));
    return split;
  }
  async openPage(url) {
    await this.goto({ url });
  }
  async lookupPhone({ phone }) {
    await this.timeout({ n: 8000 });
    await this.openPage(
      url.format({
        protocol: "https:",
        hostname: "www.facebook.com",
        pathname: "/login/identify",
      })
    );
    await this.timeout({ n: 2000 });
    await this.waitForSelector({ selector: 'input#identify_email' });
    const page = this._page;
    await page.type('input#identify_email', String(phone), { delay: 150 });
    await this.timeout({ n: 2000 });
    await page.$eval('button[type="submit"]', (el) => el.click());
    await this.waitForSelector({ selector: 'tbody div:nth-child(2) div' });
    return await page.evaluate(() => {
      return [].slice.call(document.querySelectorAll('tbody div:nth-child(2) div')).filter((v) => v.classList.length === 0).map((v) => v.innerText);
    });
  }
  async close() {
    try {
      await this._browser.close();
    } catch (e) {
      console.error(e);
    }
  }
}

export const lookupPhone = async ({ phone, noSandbox }) => {
  const fv = await FacebookRecoverPuppeteer.initialize({ noSandbox }) as FacebookRecoverPuppeteer;
  const result = await fv.lookupPhone({ phone });
  fv.close()
  return result;
};
