import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsFlowSeries} from '../model/OnmsFlowSeries';
import {OnmsFlowSeriesColumn} from '../model/OnmsFlowSeriesColumn';
import {OnmsFlowExporterSummary} from '../model/OnmsFlowExporterSummary';
import {OnmsFlowSnmpInterface} from '../model/OnmsFlowSnmpInterface';
import {OnmsFlowExporter} from '../model/OnmsFlowExporter';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
// tslint:disable-next-line
import {Moment} from 'moment';
import {OnmsFlowTable} from "../model/OnmsFlowTable";

export class FlowDAO {
    /**
     * Create an [[OnmsHTTPOptions]] object for DAO calls given an optional filter.
     */
    protected static async getOptions(): Promise<OnmsHTTPOptions> {
        return Promise.resolve(new OnmsHTTPOptions())
            .then((options) => {
                options.headers.accept = 'application/json';
                return options;
            });
    }

    /**
     * The [[IOnmsHTTP]] implementation to use internally when making DAO requests.
     * @hidden
     */
    private httpImpl: IOnmsHTTP;

    constructor(impl: IHasHTTP | IOnmsHTTP) {
        if ((impl as IHasHTTP).http) {
            impl = (impl as IHasHTTP).http;
        }
        this.httpImpl = impl as IOnmsHTTP;
    }

    /**
     * The HTTP implementation to use internally when making DAO requests.
     */
    public get http() {
        return this.httpImpl;
    }

    public async getExporters(limit: number, start?: number, end?: number): Promise<OnmsFlowExporterSummary[]> {
        return FlowDAO.getOptions().then((opts) => {
            opts.withParameter('limit', limit)
                .withParameter('start', start)
                .withParameter('end', end);
            return this.http.get(this.pathToFlowsEndpoint() + '/exporters', opts).then((result) => {
                return result.data.map((exporter) => {
                    return this.toFlowExporterSummary(exporter);
                });
            });
        });
    }

    public async getExporter(criteria: string, limit: number, start?: number, end?: number): Promise<OnmsFlowExporter> {
        return FlowDAO.getOptions().then((opts) => {
            opts.withParameter('limit', limit)
                .withParameter('start', start)
                .withParameter('end', end);
            return this.http.get(this.pathToFlowsEndpoint() + '/exporters/' + criteria, opts).then((result) => {
                return this.toFlowExporter(result.data);
            });
        });
    }

    public async getSummaryForTopNApplications(N?: number, start?: number, end?: number,
                                               includeOther?: boolean,
                                              exporterNodeCriteria?: string,
                                              ifIndex?: number): Promise<OnmsFlowTable> {
        return FlowDAO.getOptions().then((opts) => {
            opts.withParameter('N', N)
                .withParameter('start', start)
                .withParameter('end', end)
                .withParameter('exporterNode', exporterNodeCriteria)
                .withParameter('ifIndex', ifIndex)
                .withParameter('includeOther', includeOther);
            return this.http.get(this.pathToFlowsEndpoint() + '/applications', opts).then((result) => {
                return this.tableFromData(result.data);
            });
        });
    }

    public async getSummaryForTopNConversations(N?: number, start?: number, end?: number,
                                               exporterNodeCriteria?: string,
                                               ifIndex?: number): Promise<OnmsFlowTable> {
        return FlowDAO.getOptions().then((opts) => {
            opts.withParameter('N', N)
                .withParameter('start', start)
                .withParameter('end', end)
                .withParameter('exporterNode', exporterNodeCriteria)
                .withParameter('ifIndex', ifIndex);
            return this.http.get(this.pathToFlowsEndpoint() + '/conversations', opts).then((result) => {
                return this.tableFromData(result.data);
            });
        });
    }

    public async getSeriesForTopNApplications(N?: number, start?: number, end?: number,
                                              step?: number, includeOther?: boolean,
                                              exporterNodeCriteria?: string,
                                              ifIndex?: number): Promise<OnmsFlowSeries> {
        return FlowDAO.getOptions().then((opts) => {
            opts.withParameter('N', N)
                .withParameter('start', start)
                .withParameter('end', end)
                .withParameter('step', step)
                .withParameter('exporterNode', exporterNodeCriteria)
                .withParameter('ifIndex', ifIndex)
                .withParameter('includeOther', includeOther);
            return this.http.get(this.pathToFlowsEndpoint() + '/applications/series', opts).then((result) => {
                return this.seriesFromData(result.data);
            });
        });
    }

    public async getSeriesForTopNConversations(N?: number, start?: number, end?: number,
                                              step?: number, exporterNodeCriteria?: string,
                                              ifIndex?: number): Promise<OnmsFlowSeries> {
        return FlowDAO.getOptions().then((opts) => {
            opts.withParameter('N', N)
                .withParameter('start', start)
                .withParameter('end', end)
                .withParameter('step', step)
                .withParameter('exporterNode', exporterNodeCriteria)
                .withParameter('ifIndex', ifIndex);
            return this.http.get(this.pathToFlowsEndpoint() + '/conversations/series', opts).then((result) => {
                return this.seriesFromData(result.data);
            });
        });
    }

    public toFlowExporterSummary(data: any) {
        const summary = new OnmsFlowExporterSummary();
        summary.id = data.id;
        summary.foreignId = data.foreignId;
        summary.foreignSource = data.foreignSource;
        summary.label = data.label;
        return summary;
    }

    public toFlowExporter(data: any) {
        const exporter = new OnmsFlowExporter();
        exporter.id = data.id;
        exporter.foreignId = data.foreignId;
        exporter.foreignSource = data.foreignSource;
        exporter.label = data.label;
        exporter.interfaces = data.interface.map((iff) => {
           return this.toInterface(iff);
        });
        return exporter;
    }

    public toInterface(data: any) {
        const iff = new OnmsFlowSnmpInterface();
        iff.index = data.index;
        iff.name = data.name;
        iff.description = data.descr;
        iff.resourceId = data['resource-id'];
        return iff;
    }

    /**
     * Create an series object from a JSON object.
     * @hidden
     */
    public tableFromData(data: any) {
        const table = new OnmsFlowTable();

        table.start = this.toDate(data.start);
        table.end = this.toDate(data.end);
        table.headers = data.headers;
        table.rows = data.rows;

        return table;
    }

    /**
     * Create an series object from a JSON object.
     * @hidden
     */
    public seriesFromData(data: any) {
        const series = new OnmsFlowSeries();

        series.start = this.toDate(data.start);
        series.end = this.toDate(data.end);
        series.columns = data.labels;
        series.timestamps = data.timestamps;
        series.values = data.values;

        let columns = data.columns;
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        series.columns = [];

        for (let column of columns) {
            column = new OnmsFlowSeriesColumn(
                column.label,
                column.ingress,
            );
            series.columns.push(column);
        }

        return series;
    }

    /**
     * Convert the given value to a date, or undefined if it cannot be converted.
     */
    protected toDate(from: any): Moment|undefined {
        if (from === undefined || from === null || from === '') {
            return undefined;
        }
        return moment(from);
    }

    /**
     * Get the path to the flows endpoint for the appropriate API version.
     * @hidden
     */
    private pathToFlowsEndpoint() {
        return 'rest/flows';
    }
}
