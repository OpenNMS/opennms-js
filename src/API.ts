import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as API from './api/index';
export * from './api/index';

import * as DAO from './dao/index';
export * from './dao/index';

import * as Model from './model/index';
export * from './model/index';

import * as Rest from './rest/index';
export * from './rest/index';

import {Client} from './Client';

Object.freeze(API);
Object.freeze(DAO);
Object.freeze(Model);
Object.freeze(Rest);

/**
 * @category Namespace
 */
export {API, DAO, Model, Rest};

export {Client}