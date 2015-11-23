/// <reference path="typings/tsd/tsd.d.ts" />
/// <reference path="typings/ts-node.d.ts" />
/// <reference path="typings/underscore.string.d.ts" />
/// <reference path="typings/globule.d.ts" />
interface GruntConfigModule extends grunt.config.ConfigModule {
    data: any;
}
interface GruntUtilModule extends grunt.util.UtilModule {

    /**
     * Recurse through nested objects and arrays, executing callbackFunction for each non-object value.
     * If continueFunction returns false, a given object or value will be skipped.
     */
    recurse(object: any, callbackFunction: (value: any) => void, continueFunction?: (objOrValue: any) => boolean): void

}
interface IGrunt {
    config: GruntConfigModule
    util: GruntUtilModule
}
