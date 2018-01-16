/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */

const form = require('./lib/form.js');
const json = require('./lib/json.js');
const multipart = require('./lib/multipart.js');
const text = require('./lib/text.js');
const xml = require('./lib/xml.js');

/**
 * 
 * 
 * @param {any} ctx 
 * @param {any} options 
 * @returns 
 */
module.exports = function (ctx, options) {
    const methods = ['POST', 'PUT', 'DELETE', 'PATCH', 'LINK', 'UNLINK'];

    if (methods.every(method => ctx.method !== method)) {
        return Promise.resolve({});
    }

    if (ctx.request.is(options.extTypes.json)) {
        return json(ctx, options);
    }
    if (ctx.request.is(options.extTypes.form)) {
        return form(ctx, options);
    }
    if (ctx.request.is(options.extTypes.text)) {
        return text(ctx, options);
    }
    if (ctx.request.is(options.extTypes.multipart)) {
        return multipart(ctx, options);
    }
    if (ctx.request.is(options.extTypes.xml)) {
        return xml(ctx, options);
    }

    return Promise.resolve({});
};