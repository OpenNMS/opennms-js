
if (global && !global.window) {
    global.window = {} as Window;
    if (!global.window.DOMParser) {
        // tslint:disable-next-line
        global.window.DOMParser = require('xmldom').DOMParser;
    }
}

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
 */
export class XmlTransformer {
    /**
     * A convenience method for implementers to use to turn XML into a javascript object.
     * Use this to process an XML response before returning it in an [[OnmsResult]] object.
     */
    public transform(data: any) {
        if (typeof data === 'string') {
            return xmlParser.xml2js(data);
        } else {
            // assume it's already parsed
            return data;
        }
    }
}
