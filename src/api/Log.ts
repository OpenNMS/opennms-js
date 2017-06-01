import {
  Category,
  CategoryLogger,
  CategoryServiceFactory,
  CategoryDefaultConfiguration,
  LogLevel,
} from 'typescript-logging';

// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
CategoryServiceFactory.setDefaultConfiguration(new CategoryDefaultConfiguration(LogLevel.Info));

// Create categories, they will autoregister themselves.
// This creates one root logger, with 1 child sub category.
export const catRoot = new Category('opennms');
export const catAPI = new Category('api', catRoot);
export const catModel = new Category('model', catRoot);
export const catRest = new Category('rest', catRoot);
export const catUtil = new Category('util', catRoot);

// Get a logger, this can be retrieved for root categories only (in the example above, the 'service' category).
export const log: CategoryLogger = CategoryServiceFactory.getLogger(catRoot);

export const setLogLevel = (level: LogLevel, cat?: Category) => {
  if (cat === undefined) {
    cat = catRoot;
  }
  // console.log('setting category ' + cat.name + ' to ' + level.toString());
  CategoryServiceFactory.getRuntimeSettings().getCategorySettings(cat).logLevel = level;
  for (const subCat of cat.children) {
    setLogLevel(level, subCat);
  }
};
