import {OnmsError} from '../api/OnmsError';
import {OnmsFlowSeries} from '../model/OnmsFlowSeries';
import {OnmsFlowSeriesColumn} from '../model/OnmsFlowSeriesColumn';
import {OnmsFlowExporterSummary} from '../model/OnmsFlowExporterSummary';
import {OnmsFlowSnmpInterface} from '../model/OnmsFlowSnmpInterface';
import {OnmsFlowExporter} from '../model/OnmsFlowExporter';
import {OnmsFlowTable} from '../model/OnmsFlowTable';
import {OnmsHTTPOptions, OnmsHTTPOptionsBuilder} from '../api/OnmsHTTPOptions';

import {BaseDAO} from './BaseDAO';

/** @hidden */
// eslint-disable-next-line
const moment = require('moment');

/**
 * DAO for accessing flow (Netflow/IPFIX/sFlow) data.
 * @category DAO
 */
export class FlowDAO extends BaseDAO {
    /**
     * Get a summary of the nodes that have exported flows.
     * @param limit - maximum number of exporters to return (those with the most flows will be returned
     *                if the results are truncated)
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     */
    public async getExporters(limit: number, start?: number, end?: number): Promise<OnmsFlowExporterSummary[]> {
        const url = this.pathToFlowsEndpoint() + '/exporters';

        const builder = this.getOptions()
            .addParameter('limit', limit)
            .addParameter('start', start)
            .addParameter('end', end);

        const result = await this.http.get(url, builder.build());
        if (result && result.data) {
            if (!Array.isArray(result.data)) {
                throw new OnmsError('Expected an array of flow exporter summaries but got "' +
                    (typeof result) + '" instead.');
            }
            return result.data.map((exporter) => {
                return this.toFlowExporterSummary(exporter);
            });
        }
        throw new OnmsError('Unexpected response from GET ' + url + ': no result data found.');
    }

    /**
     * Get detailed information about a specific node.
     * @param criteria - the node ID or foreignSource:foreignId tuple
     * @param limit - maximum number of interfaces to return (those with the most flows will be returned
     *                if the results are truncated)
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     */
    public async getExporter(criteria: string, limit: number, start?: number, end?: number): Promise<OnmsFlowExporter> {
        const builder = this.getOptions()
            .addParameter('limit', limit)
            .addParameter('start', start)
            .addParameter('end', end);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/exporters/' + criteria, builder.build());
        return this.toFlowExporter(result.data);
    }

    /**
     * Get used Dscp values for a specific interface
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - the SNMP interface
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     */
    public async getDscpValues(exporterNodeCriteria?: string, ifIndex?: number, start?: number, end?: number): Promise<number[]> {
        this.checkForToSSupport();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/dscp/enumerate', builder.build());
        return result.data;
    }

    /**
     * Summarize the the dscp values based on parameters.
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given applications
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForDscps(start?: number, end?: number,
                                    exporterNodeCriteria?: string,
                                    ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/dscp', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Get time series data for DSCP based on parameters.
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given applications
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForDscps(start?: number, end?: number,
                                   step?: number,
                                   exporterNodeCriteria?: string,
                                   ifIndex?: number, dscp?: string[]): Promise<OnmsFlowSeries> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('step', step)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/dscp/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Enumerate the applications matching the given prefix and filters.
     * @param prefix - the prefix to match
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getApplications(prefix?: string, start?: number, end?: number,
                                 exporterNodeCriteria?: string,
                                 ifIndex?: number, dscp?: string[]): Promise<string[]> {
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('prefix', prefix);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/applications/enumerate', builder.build());
        return result.data;
    }

    /**
     * Summarize the top N applications/protocols based on parameters.
     * @param N - how many applications to return
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the top N
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForTopNApplications(N?: number, start?: number, end?: number,
                                               includeOther?: boolean,
                                               exporterNodeCriteria?: string,
                                               ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        const builder = this.getOptions().addParameter('N', N)
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/applications', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Summarize the given applications/protocols based on parameters.
     * @param applications - the applications to include
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given applications
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForApplications(applications?: string[], start?: number, end?: number,
                                           includeOther?: boolean,
                                           exporterNodeCriteria?: string,
                                           ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        if (applications) {
            applications.forEach((application) => {
                builder.addParameter('application', application);
            });
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/applications', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Get time series data for the top N applications/protocols based on parameters.
     * @param N - how many applications' series to return
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the top N
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForTopNApplications(N?: number, start?: number, end?: number,
                                              step?: number, includeOther?: boolean,
                                              exporterNodeCriteria?: string,
                                              ifIndex?: number, dscp?: string[]): Promise<OnmsFlowSeries> {
        const builder = this.getOptions()
            .addParameter('N', N)
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('step', step)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/applications/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Get time series data for the top N applications/protocols based on parameters.
     * @param applications - the applications to include
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given applications
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForApplications(applications?: string[], start?: number, end?: number,
                                          step?: number, includeOther?: boolean,
                                          exporterNodeCriteria?: string,
                                          ifIndex?: number, dscp?: string[]): Promise<OnmsFlowSeries> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('step', step)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        if (applications) {
            applications.forEach((application) => {
                builder.addParameter('application', application);
            });
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/applications/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Summarize the top N conversations based on parameters.
     * @param NOptions - how many conversations to return or an object that includes all of the parameters to be set on
     * the API call
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForTopNConversations(NOptions?: number | ITopNOptions, start?: number, end?: number,
                                                exporterNodeCriteria?: string,
                                                ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        const builder = this.getOptions();
        if (typeof NOptions === 'number') {
            builder.addParameter('N', NOptions)
                .addParameter('start', start)
                .addParameter('end', end)
                .addParameter('exporterNode', exporterNodeCriteria)
                .addParameter('ifIndex', ifIndex)
                .addParameter('dscp', dscp);
        } else if (NOptions) {
            for (const key of Object.keys(NOptions)) {
                builder.addParameter(key, (NOptions as any)[key]);
            }
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/conversations', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Summarize the given conversations based on parameters.
     * @param conversations - how many conversations to return
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given conversations
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForConversations(conversations?: string[], start?: number, end?: number,
                                            includeOther?: boolean, exporterNodeCriteria?: string,
                                            ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        if (conversations) {
            conversations.forEach((conversation) => {
                builder.addParameter('conversation', conversation);
            });
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/conversations', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Get time series data for the top N conversations based on parameters.
     * @param NOptions - how many conversations to return or an object that includes all of the parameters to be set on
     * the API call
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForTopNConversations(NOptions?: number | ITopNOptions, start?: number, end?: number,
                                               step?: number, exporterNodeCriteria?: string,
                                               ifIndex?: number, dscp?: string[]): Promise<OnmsFlowSeries> {
        const builder = this.getOptions();
        if (typeof NOptions === 'number') {
            builder.addParameter('N', NOptions)
                .addParameter('start', start)
                .addParameter('end', end)
                .addParameter('step', step)
                .addParameter('exporterNode', exporterNodeCriteria)
                .addParameter('ifIndex', ifIndex)
                .addParameter('dscp', dscp);
        } else if (NOptions) {
            for (const key of Object.keys(NOptions)) {
                builder.addParameter(key, (NOptions as any)[key]);
            }
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/conversations/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Get time series data for the given conversations based on parameters.
     * @param conversations - how many conversations' series to return
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given conversations
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForConversations(conversations?: string[], start?: number, end?: number,
                                           step?: number, includeOther?: boolean, exporterNodeCriteria?: string,
                                           ifIndex?: number, dscp?: string[], ecn?: string[]): Promise<OnmsFlowSeries> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('step', step)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        if (conversations) {
            conversations.forEach((conversation) => {
                builder.addParameter('conversation', conversation);
            });
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/conversations/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Enumerate all the hosts matching the given pattern and filters.
     * @param pattern - the regex pattern to match
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getHosts(pattern?: string, start?: number, end?: number,
                          exporterNodeCriteria?: string,
                          ifIndex?: number, dscp?: string[]): Promise<string[]> {
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('pattern', pattern);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/hosts/enumerate', builder.build());
        return result.data;
    }

    /**
     * Summarize the given hosts based on parameters.
     * @param hosts - the hosts to include
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given hosts
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForHosts(hosts?: string[], start?: number, end?: number,
                                    includeOther?: boolean,
                                    exporterNodeCriteria?: string,
                                    ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        if (hosts) {
            hosts.forEach((host) => {
                builder.addParameter('host', host);
            });
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/hosts', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Summarize the top N hosts based on parameters.
     * @param N - how many conversations to return
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the top N
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSummaryForTopNHosts(N?: number, start?: number, end?: number,
                                        includeOther?: boolean, exporterNodeCriteria?: string,
                                        ifIndex?: number, dscp?: string[]): Promise<OnmsFlowTable> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('N', N)
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/hosts', builder.build());
        return this.tableFromData(result.data);
    }

    /**
     * Get time series data for the top N hosts based on parameters.
     * @param N - how many applications' series to return
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the top N
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForTopNHosts(N?: number, start?: number, end?: number,
                                       step?: number, includeOther?: boolean,
                                       exporterNodeCriteria?: string,
                                       ifIndex?: number, dscp?: string[]): Promise<OnmsFlowSeries> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('N', N)
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('step', step)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/hosts/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Get time series data for the given hosts based on parameters.
     * @param hosts - the hosts to include
     * @param start - the start of the timespan to query (defaults to 4 hours ago)
     * @param end - the end of the timespan to query (defaults to now)
     * @param step - the requested time interval between rows
     * @param includeOther - include an additional "other" result that
     *                       represents everything that does not match the given hosts
     * @param exporterNodeCriteria - the node ID or foreignSource:foreignId tuple
     * @param ifIndex - filter for flows that came through this SNMP interface
     * @param dscp - filter for flows with this Dscp value
     */
    public async getSeriesForHosts(hosts?: string[], start?: number, end?: number,
                                   step?: number, includeOther?: boolean,
                                   exporterNodeCriteria?: string,
                                   ifIndex?: number, dscp?: string[]): Promise<OnmsFlowSeries> {
        this.checkForEnhancedFlows();
        const builder = this.getOptions()
            .addParameter('start', start)
            .addParameter('end', end)
            .addParameter('step', step)
            .addParameter('exporterNode', exporterNodeCriteria)
            .addParameter('ifIndex', ifIndex)
            .addParameter('dscp', dscp)
            .addParameter('includeOther', includeOther);
        if (hosts) {
            hosts.forEach((host) => {
                builder.addParameter('host', host);
            });
        }
        const result = await this.http.get(this.pathToFlowsEndpoint() + '/hosts/series', builder.build());
        return this.seriesFromData(result.data);
    }

    /**
     * Convert flow ReST exporter summary JSON data to an [[OnmsFlowExporterSummary]] object.
     * @hidden
     */
    public toFlowExporterSummary(data: any) {
        const summary = new OnmsFlowExporterSummary();
        summary.id = data.id;
        summary.foreignId = data.foreignId;
        summary.foreignSource = data.foreignSource;
        summary.label = data.label;
        return summary;
    }

    /**
     * Convert flow ReST exporter JSON data to an [[OnmsFlowExporter]] object.
     * @hidden
     */
    public toFlowExporter(data: any) {
        const exporter = new OnmsFlowExporter();
        exporter.id = data.id;
        exporter.foreignId = data.foreignId;
        exporter.foreignSource = data.foreignSource;
        exporter.label = data.label;
        exporter.interfaces = [];
        if (data.interface) {
            exporter.interfaces = data.interface.map((iff: any) => {
               return this.toInterface(iff);
            });
        }
        return exporter;
    }

    /**
     * Convert flow ReST interface JSON data to an [[OnmsFlowSnmpInterface]] object.
     * @hidden
     */
    public toInterface(data: any) {
        const iff = new OnmsFlowSnmpInterface();
        iff.index = data.index;
        iff.name = data.name;
        iff.description = data.descr;
        iff.resourceId = data['resource-id'];
        return iff;
    }

    /**
     * Create a series object from a JSON object.
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
     * Create a series object from a JSON object.
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
     * Create an [[OnmsHTTPOptions]] object for DAO calls.
     */
    protected getOptions(): OnmsHTTPOptionsBuilder {
        return OnmsHTTPOptions.newBuilder().setHeader('Accept', 'application/json');
    }

    /**
     * Get the path to the flows endpoint for the appropriate API version.
     * @hidden
     */
    private pathToFlowsEndpoint() {
        return 'rest/flows';
    }

    /**
     * Check if this version of OpenNMS supports enhanced flow API and if not throw an error.
     */
    private checkForEnhancedFlows() {
        if (!this.server
            || !this.server.metadata
            || !this.server.metadata.capabilities().enhancedFlows) {
            throw new OnmsError('Enhanced flow API is not supported by this version of OpenNMS.');
        }
    }

    /**
     * Check if this version of OpenNMS supports ToS filtering API and if not throw an error.
     */
    private checkForToSSupport() {
        if (!this.server
            || !this.server.metadata
            || !this.server.metadata.capabilities().tos) {
            throw new OnmsError('ToS filtering API is not supported by this version of OpenNMS.');
        }
    }
}

/**
 * Preferred object for providing options to TopN queries.
 * @category DAO
 */
export interface ITopNOptions {
    /** how many series to return */
    N: number;
    /** the start of the timespan to query */
    start?: number;
    /** the end of the timespan to query */
    end?: number;
    /** the requested time interval between rows */
    step?: number;
    /** include an additional "other" result for non-matches */
    includeOther?: boolean;
    /** the node ID or foreignSource:foreignId tuple */
    exporterNodeCriteria?: string;
    /** filter based on SNMP interface */
    ifIndex?: number;
}
