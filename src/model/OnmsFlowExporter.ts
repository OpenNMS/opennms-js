import {OnmsFlowSnmpInterface} from './OnmsFlowSnmpInterface';
import {OnmsFlowExporterSummary} from './OnmsFlowExporterSummary';

/**
 * Represents OpenNMS flow information about a node and its interfaces.
 * @category Model
 */
export class OnmsFlowExporter extends OnmsFlowExporterSummary {
    /** a collection of interface information */
    public interfaces?: OnmsFlowSnmpInterface[];

}
