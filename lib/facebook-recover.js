"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupPhone = exports.FacebookRecoverPuppeteer = void 0;
const base_puppeteer_1 = require("base-puppeteer");
const url_1 = __importDefault(require("url"));
const puppeteer = require("puppeteer-extra");
const lodash = require('lodash');
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
puppeteer.use(RecaptchaPlugin({
    provider: {
        id: "2captcha",
        token: process.env.TWOCAPTCHA_TOKEN,
    },
    visualFeedback: true,
}));
class FacebookRecoverPuppeteer extends base_puppeteer_1.BasePuppeteer {
    formatResult(v) {
        const split = lodash.uniq(v.split('\n').map((v) => v.trim()).filter(Boolean)).filter((v) => !(v.match(/^(?:Send|How|Facebook)/)));
        return split;
    }
    async openPage(url) {
        await this.goto({ url });
    }
    async lookupPhone({ phone }) {
        await this.openPage(url_1.default.format({
            protocol: "https:",
            hostname: "www.facebook.com",
            pathname: "/login/identify",
        }));
        await this.timeout({ n: 8000 });
        await this.waitForSelector({ selector: 'input#identify_email' });
        await this.type({ selector: 'input#identify_email', value: phone });
        const page = this._page;
        await page.$eval('button[type="submit"]', (el) => el.click());
        await this.waitForSelector({ selector: 'tbody tbody' });
        return this.formatResult(await page.$$eval('tbody', (els) => els.map((v) => v.innerText).join('')));
    }
    async close() {
        try {
            await this._browser.close();
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.FacebookRecoverPuppeteer = FacebookRecoverPuppeteer;
const lookupPhone = async ({ phone, noSandbox }) => {
    const fv = await FacebookRecoverPuppeteer.initialize({ noSandbox });
    const result = await fv.lookupPhone({ phone });
    fv.close();
    return result;
};
exports.lookupPhone = lookupPhone;
//# sourceMappingURL=facebook-recover.js.map