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
import {V1FilterProcessor} from './dao/V1FilterProcessor';

import {OnmsAlarm} from './model/OnmsAlarm';
import {OnmsAlarmType, AlarmTypes} from './model/OnmsAlarmType';
import {OnmsEvent} from './model/OnmsEvent';
import {OnmsParm} from './model/OnmsParm';
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
  V1FilterProcessor,
});

/** @hidden */
const Model = Object.freeze({
  OnmsAlarm,
  OnmsAlarmType,
  OnmsEvent,
  OnmsParm,
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
