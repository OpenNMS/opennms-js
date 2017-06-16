import {Comparator, Comparators} from './api/Comparator';
import {Filter} from './api/Filter';
import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsError} from './api/OnmsError';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsResult} from './api/OnmsResult';
import {OnmsServer} from './api/OnmsServer';
import {OnmsVersion} from './api/OnmsVersion';
import {Restriction} from './api/Restriction';
import {ServerMetadata} from './api/ServerMetadata';
import {ServerType, ServerTypes} from './api/ServerType';

import {AlarmDAO} from './dao/AlarmDAO';
import {EventDAO} from './dao/EventDAO';
import {NodeDAO} from './dao/NodeDAO';
import {V1FilterProcessor} from './dao/V1FilterProcessor';

import {OnmsAlarm} from './model/OnmsAlarm';
import {OnmsAlarmType, AlarmTypes} from './model/OnmsAlarmType';
import {OnmsCategory, Categories} from './model/OnmsCategory';
import {OnmsEvent} from './model/OnmsEvent';
import {OnmsIpInterface} from './model/OnmsIpInterface';
import {OnmsManagedType, ManagedTypes} from './model/OnmsManagedType';
import {OnmsMonitoredService} from './model/OnmsMonitoredService';
import {OnmsNode} from './model/OnmsNode';
import {OnmsNodeLabelSource, NodeLabelSources} from './model/OnmsNodeLabelSource';
import {OnmsNodeType, NodeTypes} from './model/OnmsNodeType';
import {OnmsParm} from './model/OnmsParm';
import {OnmsPrimaryType, PrimaryTypes} from './model/OnmsPrimaryType';
import {OnmsServiceStatusType, ServiceStatusTypes} from './model/OnmsServiceStatusType';
import {OnmsServiceType, ServiceTypes} from './model/OnmsServiceType';
import {OnmsSeverity, Severities} from './model/OnmsSeverity';
import {OnmsTroubleTicketState, TroubleTicketStates} from './model/OnmsTroubleTicketState';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {GrafanaHTTP} from './rest/GrafanaHTTP';
import {SuperAgentHTTP} from './rest/SuperAgentHTTP';

import {Client} from './Client';

/* tslint:disable:object-literal-sort-keys */

/** @hidden */
const API = Object.freeze({
  Comparator,
  Comparators,
  Filter,
  OnmsAuthConfig,
  OnmsError,
  OnmsHTTPOptions,
  OnmsResult,
  OnmsServer,
  OnmsVersion,
  Restriction,
  ServerMetadata,
  ServerType,
  ServerTypes,
});

/** @hidden */
const DAO = Object.freeze({
  AlarmDAO,
  EventDAO,
  NodeDAO,
  V1FilterProcessor,
});

/** @hidden */
const Model = Object.freeze({
  OnmsAlarm,
  OnmsAlarmType,
  OnmsCategory,
  Categories,
  OnmsEvent,
  OnmsIpInterface,
  OnmsManagedType,
  ManagedTypes,
  OnmsMonitoredService,
  OnmsNode,
  OnmsNodeLabelSource,
  NodeLabelSources,
  OnmsParm,
  OnmsPrimaryType,
  PrimaryTypes,
  OnmsServiceStatusType,
  ServiceStatusTypes,
  OnmsServiceType,
  ServiceTypes,
  OnmsSeverity,
  Severities,
  OnmsTroubleTicketState,
  TroubleTicketStates,
});

/** @hidden */
const Rest = Object.freeze({
  AxiosHTTP,
  GrafanaHTTP,
  SuperAgentHTTP,
});

/* tslint:enable:object-literal-sort-keys */

/** @hidden */
export {API, DAO, Model, Rest, Client};
