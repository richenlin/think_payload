/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */

const lib = require('think_lib');
const form = require('./lib/form.js');
const json = require('./lib/json.js');
const multipart = require('./lib/multipart.js');
const text = require('./lib/text.js');
const xml = require('./lib/xml.js');

// default json types
const jsonTypes = ['application/json'];
// default form types
const formTypes = ['application/x-www-form-urlencoded'];
// default text types
const textTypes = ['text/plain'];
// default multipart-form types
const multipartTypes = ['multipart/form-data'];
// default xml types
const xmlTypes = ['text/xml'];

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
    let extTypes = {
        json: jsonTypes,
        form: formTypes,
        text: textTypes,
        multipart: multipartTypes,
        xml: xmlTypes
    };
    options.extTypes && (extTypes = lib.extend(extTypes, options.extTypes));

    if (ctx.request.is(extTypes.json)) {
        return json(ctx, options);
    }
    if (ctx.request.is(extTypes.form)) {
        return form(ctx, options);
    }
    if (ctx.request.is(extTypes.text)) {
        return text(ctx, options);
    }
    if (ctx.request.is(extTypes.multipart)) {
        return multipart(ctx, options);
    }
    if (ctx.request.is(extTypes.xml)) {
        return xml(ctx, options);
    }

    return Promise.resolve({});
};