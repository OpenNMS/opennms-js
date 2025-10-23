/**
 * Fake 'replace' that converts this object to a string, then does a String.replace.
 * This is to handle a bug in Grafana and json-source-map. See OPG-502.
 * 
 * Any objects defined in this library that have defined a toJSON() function which returns an 
 * object (example: OnmsEnum), should also define a 'replace(pattern: RegExp | string, replaceWith: string)'
 * method which just calls this (with self: this).
 * Then in `toJSON`, make sure to add 'obj.replace = this.replace'.
 * See OnmsEnum for implementation.
 */
export const toJsonAwareReplace = (self: any, pattern: RegExp | string, replaceWith: string) => {
    const obj = self.hasOwnProperty('toJSON') && typeof self.toJSON === 'function' ? self.toJSON() : self;
    const str = JSON.stringify(obj);
    return str.replace(pattern, replaceWith);
}
