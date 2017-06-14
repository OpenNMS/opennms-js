import {Comparator, COMPARATORS} from './api/Comparator';
import {Filter} from './api/Filter';
import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsError} from './api/OnmsError';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsResult} from './api/OnmsResult';
import {OnmsServer} from './api/OnmsServer';
import {OnmsVersion} from './api/OnmsVersion';
import {Restriction} from './api/Restriction';
import {ServerMetadata} from './api/ServerMetadata';
import {ServerType, SERVER_TYPES} from './api/ServerType';

import {AlarmDAO} from './dao/AlarmDAO';
import {EventDAO} from './dao/EventDAO';
import {V1FilterProcessor} from './dao/V1FilterProcessor';

import {OnmsAlarm} from './model/OnmsAlarm';
import {OnmsAlarmType} from './model/OnmsAlarmType';
import {OnmsEvent} from './model/OnmsEvent';
import {OnmsParm} from './model/OnmsParm';
import {OnmsServiceType, SERVICE_TYPES} from './model/OnmsServiceType';
import {OnmsSeverity, SEVERITIES} from './model/OnmsSeverity';
import {OnmsTroubleTicketState} from './model/OnmsTroubleTicketState';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {GrafanaHTTP} from './rest/GrafanaHTTP';
import {SuperAgentHTTP} from './rest/SuperAgentHTTP';

import {Client} from './Client';

/* tslint:disable:object-literal-sort-keys */

/** @hidden */
const API = Object.freeze({
  Comparator,
  COMPARATORS,
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
  SERVER_TYPES,
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
  SERVICE_TYPES,
  OnmsSeverity,
  SEVERITIES,
  OnmsTroubleTicketState,
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
