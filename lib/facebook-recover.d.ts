import { BasePuppeteer } from "base-puppeteer";
export declare class FacebookRecoverPuppeteer extends BasePuppeteer {
    formatResult(v: any): any;
    openPage(url: any): Promise<void>;
    lookupPhone({ phone }: {
        phone: any;
    }): Promise<any>;
    close(): Promise<void>;
}
export declare const lookupPhone: ({ phone, noSandbox }: {
    phone: any;
    noSandbox: any;
}) => Promise<any>;
