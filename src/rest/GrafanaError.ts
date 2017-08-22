import {OnmsError} from '../api/OnmsError';

export class GrafanaError extends OnmsError {

    private config: any;

    constructor(message: string, code?: number, options?: any, data?: any) {
        super(message, code, options, data);
        this.config = options;
    }

}
