/// <reference path="../node_modules/axios/index.d.ts" />

interface Window {
  DOMParser: any;
}

declare module NodeJS {
  interface Global {
    window: Window;
    DOMParser: any;
    OPENNMS_JS_VERSION: string;
  }
}

declare module 'html-to-formatted-text'
