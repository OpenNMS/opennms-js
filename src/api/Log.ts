import {
  Category,
  CategoryLogger,
  CategoryServiceFactory,
  CategoryConfiguration,
  LogLevel,
} from 'typescript-logging';

// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));

// Create categories, they will autoregister themselves.
// This creates one root logger, with 1 child sub category.

/** @hidden */
export const catRoot = new Category('opennms');

/** @hidden */
export const catAPI = new Category('api', catRoot);

/** @hidden */
export const catDao = new Category('dao', catRoot);

/** @hidden */
export const catModel = new Category('model', catRoot);

/** @hidden */
export const catRest = new Category('rest', catRoot);

/** @hidden */
export const catUtil = new Category('util', catRoot);

/**
 * Get a logger, this can be retrieved for root categories only (in the example above, the 'service' category).
 * @hidden
 */
export const log: CategoryLogger = CategoryServiceFactory.getLogger(catRoot);

/** @hidden */
export const setLogLevel = (level: LogLevel, cat?: Category) => {
  if (cat === undefined) {
    cat = catRoot;
  }
  // console.log('setting category ' + cat.name + ' to ' + level.toString());
  CategoryServiceFactory.setConfigurationCategory(new CategoryConfiguration(level), cat, true);
};
