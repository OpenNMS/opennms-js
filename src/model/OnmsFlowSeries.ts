import {Moment} from 'moment';
import {OnmsFlowSeriesColumn} from './OnmsFlowSeriesColumn';

/**
 * Time series metrics derived from flow data.
 * @category Model
 */
export class OnmsFlowSeries {
    /** start time */
    public start?: Moment;

    /** end time */
    public end?: Moment;

    /** columns */
    public columns?: OnmsFlowSeriesColumn[];

    /** row timestamps */
    public timestamps?: number[];

    /** cell values */
    public values?: number[][];
}
