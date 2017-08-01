/**
 * Helper to transform a json string to an json object.
 */
export class JsonTransformer {
    /**
     * A convenience method for implementers to use to turn JSON into a javascript object.
     * Use this to process a JSON response before returning it in an [[OnmsResult]] object.
     */
    public transform(data: any) {
        if (typeof data === 'string') {
            if (data.length < 1) {
                return {};
            } else {
                return JSON.parse(data);
            }
        } else {
            // assume it's already parsed
            return data;
        }
    }
}
