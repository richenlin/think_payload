/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */
const lib = require('think_lib');
const logger = require('think_logger');
const parse = require('./lib/parse.js');

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
        // cached
        lib.define(ctx, '_cache', {
            body: null,
            query: null
        }, true);
        /**
         * request body parser
         *
         * @param {any} name
         * @param {any} value
         * @returns
         */
        lib.define(ctx, 'bodyParser', function () {
            if (!lib.isTrueEmpty(ctx._cache.body)) {
                return ctx._cache.body;
            }
            return parse(ctx, options).then(res => {
                ctx._cache.body = res || {};
                return ctx._cache.body;
            }).catch(err => {
                logger.error(err);
                return {};
            });
        });
        /**
         * queryString parser
         *
         * @param {any} name
         * @param {any} value
         * @returns
         */
        lib.define(ctx, 'queryParser', function () {
            if (lib.isTrueEmpty(ctx._cache.query)) {
                ctx._cache.query = Object.assign(ctx.query, ctx.params || {});
            }
            return ctx._cache.query;
        });

        return next();
    };
};