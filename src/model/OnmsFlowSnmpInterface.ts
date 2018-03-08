/**
 * OpenNMS flow node SNMP interface metadata.
 * @module OnmsFlowSnmpInterface
 */
export class OnmsFlowSnmpInterface {
    /** the interface's ifIndex */
    public index: number;

    /** the interface name */
    public name: string;

    /** the interface's ifDescription */
    public description: string;

    /** the interface's OpenNMS resource identifier */
    public resourceId: string;
}
