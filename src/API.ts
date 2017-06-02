import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsError} from './api/OnmsError';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsResult} from './api/OnmsResult';
import {OnmsServer} from './api/OnmsServer';
import {OnmsVersion} from './api/OnmsVersion';
import {ServerMetadata} from './api/ServerMetadata';
import {ServerType} from './api/Constants';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {SuperAgentHTTP} from './rest/SuperAgentHTTP';

import {Client} from './Client';

const API = Object.freeze({
  OnmsAuthConfig,
  OnmsError,
  OnmsHTTPOptions,
  OnmsResult,
  OnmsServer,
  OnmsVersion,
  ServerMetadata,
  ServerType,
});

const Rest = Object.freeze({
  AxiosHTTP,
  SuperAgentHTTP,
});

export {API, Rest, Client};
