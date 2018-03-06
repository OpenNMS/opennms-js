/**
 * Represents basic OpenNMS flow information about node.
 * @module OnmsFlowExporterSummary
 */
export class OnmsFlowExporterSummary {
    /** node unique identifier */
    public id: number;

    /** node foreign source */
    public foreignSource: string;

    /** node foreign ID */
    public foreignId: string;

    /** node label */
    public label: string;

    /** the categories the node is in */
    public categories: string[];
}
