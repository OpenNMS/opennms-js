import {Moment} from 'moment';

/**
 * Represents an OpenNMS memo.
 * @category Model
 */
export class OnmsMemo {
    /** the memo ID */
    public id?: number;

    /** the content of the memo */
    public body?: string;

    /** the user who last updated (or created) the memo */
    public author?: string;

    /** when the memo was last updated */
    public updated?: Moment;

    /** when the memo was created */
    public created?: Moment;
}
