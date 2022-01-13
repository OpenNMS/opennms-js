// If running under Node, use `xmldom`'s DOM parser.
if (global && !global.window) {
    (global as any).window = {} as Window;
    if (!(global.window as any).DOMParser) {
        // tslint:disable-next-line
        (global.window as any).DOMParser = require('@xmldom/xmldom').DOMParser;
    }
}

import {OnmsError} from '../api/OnmsError';

/** @hidden */
// tslint:disable-next-line
const X2JS = require('x2js');

/** @hidden */
const xmlParser = new X2JS({
    arrayAccessForm: 'property',
    attributePrefix: '',
    ignoreRoot: true,
});

/**
 * Helper class to transform any xml string to a javascript object.
 * @category Rest API
 */
export class XmlTransformer {
    /**
     * A convenience method for implementers to use to turn XML into a javascript object.
     * Use this to process an XML response before returning it in an [[OnmsResult]] object.
     */
    public transform(data: any) {
        if (typeof data === 'string') {
            try {
                return xmlParser.xml2js(data);
            } catch (err: unknown) {
                throw new OnmsError((err as Error).message, undefined, undefined, data);
            }
        } else {
            // assume it's already parsed
            return data;
        }
    }
}
