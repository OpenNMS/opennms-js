import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsError} from './api/OnmsError';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsResult} from './api/OnmsResult';
import {OnmsServer} from './api/OnmsServer';
import {OnmsVersion} from './api/OnmsVersion';
import {ServerMetadata} from './api/ServerMetadata';
import {ServerType, SERVER_TYPES} from './api/ServerType';

import {OnmsAlarm} from './model/OnmsAlarm';
import {OnmsAlarmType} from './model/OnmsAlarmType';
import {OnmsEvent} from './model/OnmsEvent';
import {OnmsParm} from './model/OnmsParm';
import {OnmsServiceType} from './model/OnmsServiceType';
import {OnmsSeverity} from './model/OnmsSeverity';
import {OnmsTroubleTicketState} from './model/OnmsTroubleTicketState';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {SuperAgentHTTP} from './rest/SuperAgentHTTP';

import {Filter} from './dao/filters/Filter';

import {AlarmDAO} from './dao/AlarmDAO';

import {Client} from './Client';

/* tslint:disable:object-literal-sort-keys */

/** @hidden */
const API = Object.freeze({
  OnmsAuthConfig,
  OnmsError,
  OnmsHTTPOptions,
  OnmsResult,
  OnmsServer,
  OnmsVersion,
  SERVER_TYPES,
  ServerMetadata,
  ServerType,
});

/** @hidden */
const Model = Object.freeze({
  OnmsAlarm,
  OnmsAlarmType,
  OnmsEvent,
  OnmsParm,
  OnmsServiceType,
  OnmsSeverity,
  OnmsTroubleTicketState,
});

/** @hidden */
const Rest = Object.freeze({
  AxiosHTTP,
  SuperAgentHTTP,
});

/** @hidden */
const DAO = Object.freeze({
  Filter,
  AlarmDAO,
});

/* tslint:enable:object-literal-sort-keys */

/** @hidden */
export {API, Model, Rest, DAO, Client};
