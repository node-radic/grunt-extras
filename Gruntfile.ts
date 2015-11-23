///<reference path='lib/types.d.ts'/>
import * as fs from 'fs-extra';
import * as path from 'path'
import * as _ from 'lodash';
import * as util from 'util';
import * as _s from 'underscore.string'
import {injectGruntExtras, dump} from './index';

require('ts-node').register();



export = function (grunt:IGrunt) {

    injectGruntExtras(grunt);
    var watchTS = grunt.option('watcher') == 'ts';

    var targets = {
        dist: {name: 'dist', dest: 'dist', scripts: 'dist/js', styles: 'dist/css' },
        dev : {name: 'dev', dest: 'dev', scripts: 'dev/assets/scripts', styles: 'dev/assets/styles' },
    };

    function setTarget(name:string) {
        grunt.config.set('target', targets[name]);
    }

    function ifTarget(name:string, then:any, els:any = false):any {
        return () => grunt.config.get("target")['name'] === name ? then : els;
    }



    var config = {
        pkg: fs.readJSONSync('package.json'),

        target : targets[<string> grunt.option('target') || 'dev'],
        targets: targets,

        clean: {
            generated          : {src: 'lib/**/*.{js,js.map}'},
        },

        ts: {
            options : {
                compiler              : 'node_modules/typescript/bin/tsc',
                target                : 'ES5',
                module                : 'commonjs',
                sourceMap             : false,
                inlineSources         : ifTarget('dev', true),
                inlineSourceMap       : ifTarget('dev', true),
                experimentalDecorators: true,
                emitDecoratorMetadata : true,
                removeComments        : ifTarget('dev', true),
                noImplicitAny         : false,
                failOnTypeErrors      : false,
                htmlModuleTemplate    : '<%= filename %>',
                htmlVarTemplate       : '<%= filename %>',
                htmlOutputTemplate    : "namespace packadic { templates['<%= modulename %>'] = '<%= content %>'; }"
            },
            all: {
                options: {declaration: false},
                tsconfig: true,
                //out    : '<%= target.scripts %>/packadic.js',
                //html   : [tspp('views/**/*.html')],
                //watch  : watchTS ? tspp() : undefined,
                src    : ['index.ts', 'lib/**/*.{d.ts,ts}']
            }
        },

        watch: {
            options     : {livereload: true},
            ts  : {files: ['index.ts', 'lib/**/*.{d.ts,ts}'], tasks: ['ts:all']}
        }
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig(config);

    [
        ['default', 'Default task', ['build']],
        ['build', 'build', ['clean:generated', 'ts:all']],
        ['config', 'Show config', (target?:string) => dump(grunt.config.get(target))],
        ['target', 'Set target trough task', (targ) => setTarget(targ)],
    ].forEach(function (simpleTask) {
        grunt.registerTask(simpleTask[0], simpleTask[1], simpleTask[2]);
    }.bind(this));

}
