/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */
const lib = require('think_lib');
const parse = require('./parse.js');

/**
 * default options
 */
const defaultOptions = {
    extTypes: {
        json: ['application/json'],
        form: ['application/x-www-form-urlencoded'],
        text: ['text/plain'],
        multipart: ['multipart/form-data'],
        xml: ['text/xml']
    },
    limit: '20mb',
    encoding: 'utf-8',
    multiples: true,
    keepExtensions: true,
    // uploadDir: os.tmpdir(),
    // hash: 'md5'
};

module.exports = function (options, app) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    return async function (ctx, next) {
        lib.define(ctx, '_get', ctx.query, 1);
        // parse payload
        ctx.request.body = await parse(ctx, options).catch(err => {
            return {};
        });
        if (ctx.request.body.post) {
            lib.define(ctx, '_post', ctx.request.body.post, 1);
        } else {
            lib.define(ctx, '_post', ctx.request.body, 1);
        }
        if (ctx.request.body.file) {
            lib.define(ctx, '_file', ctx.request.body.file, 1);
        }

        /**
         * get or set query params
         * 
         * @param {any} name 
         * @param {any} value 
         * @returns 
         */
        lib.define(ctx, 'querys', function (name, value) {
            if (value === undefined) {
                if (name === undefined) {
                    return ctx._get;
                }
                return ctx._get[name];
            }
            ctx._get[name] = value;
            return null;
        });

        /**
         * get or set body params
         * 
         * @param {any} name 
         * @param {any} value 
         * @returns 
         */
        lib.define(ctx, 'post', function (name, value) {
            if (value === undefined) {
                if (name === undefined) {
                    return ctx._post;
                }
                return ctx._post[name];
            }
            ctx._post[name] = value;
            return null;
        });

        /**
         * 
         * 
         * @param {any} name 
         * @returns 
         */
        lib.define(ctx, 'param', function (name) {
            if (name === undefined) {
                return lib.extend(ctx._get, ctx._post);
            } else {
                if (ctx._post[name] === undefined) {
                    return ctx._get[name];
                } else {
                    return ctx._post[name];
                }
            }
        });

        /**
         * get or set files
         * 
         * @param {any} name 
         * @param {any} value 
         * @returns 
         */
        lib.define(ctx, 'file', function (name, value) {
            if (value === undefined) {
                if (name === undefined) {
                    return ctx._file;
                }
                return ctx._file[name];
            }
            ctx._file[name] = value;
            return null;
        });

        return next();
    };
};