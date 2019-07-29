import {Moment} from 'moment';

/**
 * A collection of flow time-series data.
 * @module OnmsFlowTable
 */
export class OnmsFlowTable {
    /** start time */
    public start?: Moment;

    /** end time */
    public end?: Moment;

    /** headers */
    public headers?: string[];

    /** rows */
    public rows?: any[][];

}
