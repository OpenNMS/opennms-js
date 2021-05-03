import {Clause} from './api/Clause';
import {Comparator, Comparators} from './api/Comparator';
import {Filter} from './api/Filter';
import {NestedRestriction} from './api/NestedRestriction';
import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsError} from './api/OnmsError';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsResult} from './api/OnmsResult';
import {OnmsServer} from './api/OnmsServer';
import {OnmsVersion} from './api/OnmsVersion';
import {Operator, Operators} from './api/Operator';
import {OrderBy, Orders, Order} from './api/OrderBy';
import {Restriction} from './api/Restriction';
import {SearchProperty} from './api/SearchProperty';
import {SearchPropertyType, SearchPropertyTypes} from './api/SearchPropertyType';
import {ServerMetadata} from './api/ServerMetadata';
import {ServerType, ServerTypes} from './api/ServerType';
import {TicketerConfig} from './api/TicketerConfig';

import {AlarmDAO} from './dao/AlarmDAO';
import {EventDAO} from './dao/EventDAO';
import {FlowDAO} from './dao/FlowDAO';
import {NodeDAO} from './dao/NodeDAO';
import {SituationFeedbackDAO} from './dao/SituationFeedbackDAO';
import {V1FilterProcessor} from './dao/V1FilterProcessor';
import {V2FilterProcessor} from './dao/V2FilterProcessor';

import {OnmsAlarm} from './model/OnmsAlarm';
import {OnmsAlarmSummary} from './model/OnmsAlarmSummary';
import {OnmsAlarmType, AlarmTypes} from './model/OnmsAlarmType';
import {OnmsCategory, Categories} from './model/OnmsCategory';
import {OnmsCollectType, CollectTypes} from './model/OnmsCollectType';
import {OnmsEvent} from './model/OnmsEvent';
import {OnmsFlowSeries} from './model/OnmsFlowSeries';
import {OnmsFlowSeriesColumn} from './model/OnmsFlowSeriesColumn';
import {OnmsFlowExporter} from './model/OnmsFlowExporter';
import {OnmsFlowExporterSummary} from './model/OnmsFlowExporterSummary';
import {OnmsFlowSnmpInterface} from './model/OnmsFlowSnmpInterface';
import {OnmsFlowTable} from './model/OnmsFlowTable';
import {OnmsIpInterface} from './model/OnmsIpInterface';
import {OnmsManagedType, ManagedTypes} from './model/OnmsManagedType';
import {OnmsMemo} from './model/OnmsMemo';
import {OnmsMonitoredService} from './model/OnmsMonitoredService';
import {OnmsNode} from './model/OnmsNode';
import {OnmsNodeLabelSource, NodeLabelSources} from './model/OnmsNodeLabelSource';
import {OnmsNodeType, NodeTypes} from './model/OnmsNodeType';
import {OnmsParm} from './model/OnmsParm';
import {OnmsPrimaryType, PrimaryTypes} from './model/OnmsPrimaryType';
import {OnmsServiceStatusType, ServiceStatusTypes} from './model/OnmsServiceStatusType';
import {OnmsServiceType, ServiceTypes} from './model/OnmsServiceType';
import {OnmsSeverity, Severities} from './model/OnmsSeverity';
import {OnmsSituationFeedback} from './model/OnmsSituationFeedback';
import {OnmsSituationFeedbackType, FeedbackTypes} from './model/OnmsSituationFeedbackType';
import {OnmsSnmpInterface} from './model/OnmsSnmpInterface';
import {OnmsSnmpStatusType, SnmpStatusTypes} from './model/OnmsSnmpStatusType';
import {OnmsTroubleTicketState, TroubleTicketStates} from './model/OnmsTroubleTicketState';
import {PhysAddr} from './model/PhysAddr';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {GrafanaHTTP} from './rest/GrafanaHTTP';

import {Client} from './Client';

/* tslint:disable:object-literal-sort-keys */

/** @hidden */
const API = Object.freeze({
  Clause,
  Comparator,
  Comparators,
  Filter,
  NestedRestriction,
  OnmsAuthConfig,
  OnmsError,
  OnmsHTTPOptions,
  OnmsResult,
  OnmsServer,
  OnmsVersion,
  Operator,
  Operators,
  OrderBy,
  Order,
  Orders,
  Restriction,
  SearchProperty,
  SearchPropertyType,
  SearchPropertyTypes,
  ServerMetadata,
  ServerType,
  ServerTypes,
  TicketerConfig,
});

/** @hidden */
const DAO = Object.freeze({
  AlarmDAO,
  EventDAO,
  FlowDAO,
  NodeDAO,
  SituationFeedbackDAO,
  V1FilterProcessor,
  V2FilterProcessor,
});

/** @hidden */
const Model = Object.freeze({
  AlarmTypes,
  OnmsAlarm,
  OnmsAlarmSummary,
  OnmsAlarmType,
  OnmsCategory,
  Categories,
  OnmsCollectType,
  CollectTypes,
  OnmsEvent,
  OnmsFlowSeries,
  OnmsFlowSeriesColumn,
  OnmsFlowExporter,
  OnmsFlowExporterSummary,
  OnmsFlowSnmpInterface,
  OnmsFlowTable,
  OnmsIpInterface,
  OnmsManagedType,
  ManagedTypes,
  OnmsMemo,
  OnmsMonitoredService,
  OnmsNode,
  OnmsNodeLabelSource,
  NodeLabelSources,
  OnmsNodeType,
  NodeTypes,
  OnmsParm,
  OnmsPrimaryType,
  PrimaryTypes,
  OnmsServiceStatusType,
  ServiceStatusTypes,
  OnmsServiceType,
  ServiceTypes,
  OnmsSeverity,
  Severities,
  OnmsSituationFeedback,
  OnmsSituationFeedbackType,
  FeedbackTypes,
  OnmsSnmpInterface,
  OnmsSnmpStatusType,
  SnmpStatusTypes,
  OnmsTroubleTicketState,
  TroubleTicketStates,
  PhysAddr,
});

/** @hidden */
const Rest = Object.freeze({
  AxiosHTTP,
  GrafanaHTTP,
});

/* tslint:enable:object-literal-sort-keys */

/** @hidden */
export {API, DAO, Model, Rest, Client};
