import {Moment} from 'moment';

export class OnmsFlowTable {
    /** start time */
    public start: Moment;

    /** end time */
    public end: Moment;

    /** headers */
    public headers: string[];

    /** rows */
    public rows: any[][];

}
