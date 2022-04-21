import {OnmsError} from '../api/OnmsError';

/**
 * Helper to transform a json string to an json object.
 * @category Rest
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
                try {
                    return JSON.parse(data);
                } catch (err: unknown) {
                    throw new OnmsError((err as Error).message, undefined, undefined, data);
                }
            }
        } else {
            // assume it's already parsed
            return data;
        }
    }
}
