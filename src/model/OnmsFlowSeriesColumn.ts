/**
 * Time series column.
 * @category Model
 */
export class OnmsFlowSeriesColumn {
    /** label */
    public label: string;

    /** direction */
    public ingress: boolean;

    constructor(label: string, ingress: boolean) {
        this.label = label;
        this.ingress = ingress;
    }
}
