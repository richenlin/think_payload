/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */

const fs = require('fs');
const lib = require('think_lib');
const raw = require('raw-body');
const qs = require('querystring');
const inflate = require('inflation');
const formidable = require('formidable');
const onFinished = require('on-finished');
const parseString = require('xml2js').parseString;
const parser = lib.promisify(parseString, parseString);

/**
 *
 *
 * @param {*} ctx
 * @param {*} [opts={}]
 * @returns
 */
const parseMultipart = function (ctx, opts = {}) {
    const form = new formidable.IncomingForm(opts);

    let uploadFiles = null;
    onFinished(ctx.res, () => {
        if (!uploadFiles) {
            return;
        }
        const fsUnlink = lib.promisify(fs.unlink, fs);
        const fsAccess = lib.promisify(fs.access, fs);
        Object.keys(uploadFiles).forEach(key => {
            fsAccess(uploadFiles[key].path).then(() => fsUnlink(uploadFiles[key].path)).catch(() => { });
        });
    });

    return new Promise((resolve, reject) => {
        form.parse(ctx.req, function (err, fields, files) {
            if (err) {
                return reject(err);
            }
            uploadFiles = files;
            return resolve({
                post: fields,
                file: files
            });
        });
    });
};

/**
 *
 *
 * @param {*} ctx
 * @param {*} [opts={}]
 * @returns
 */
const parseText = function (ctx, opts = {}) {
    return raw(inflate(ctx.req), opts);
};

/**
 *
 *
 * @param {*} ctx
 * @param {*} [opts={}]
 * @returns
 */
const parseForm = function (ctx, opts = {}) {
    return parseText(ctx, opts).then(str => qs.parse(str)).then(data => ({ post: data }));
};
/**
 *
 *
 * @param {*} ctx
 * @param {*} [opts={}]
 * @returns
 */
const parseJson = function (ctx, opts = {}) {
    return parseText(ctx, opts).then(str => JSON.parse(str)).then(data => ({ post: data }));
};

/**
 *
 *
 * @param {*} ctx
 * @param {*} [opts={}]
 * @returns
 */
const parseXml = function (ctx, opts = {}) {
    return parseText(ctx, opts).then(str => parser(str)).then(data => ({ post: data }));
};

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
    // defaults
    const len = ctx.req.headers['content-length'];
    const encoding = ctx.req.headers['content-encoding'] || 'identity';
    if (len && encoding === 'identity') {
        options.length = ~~len;
    }
    options.encoding = options.encoding || 'utf8';
    options.limit = options.limit || '1mb';

    if (ctx.request.is(options.extTypes.form)) {
        return parseForm(ctx, options);
    }
    if (ctx.request.is(options.extTypes.multipart)) {
        return parseMultipart(ctx, options);
    }
    if (ctx.request.is(options.extTypes.json)) {
        return parseJson(ctx, options);
    }
    if (ctx.request.is(options.extTypes.text)) {
        return parseText(ctx, options);
    }
    if (ctx.request.is(options.extTypes.xml)) {
        return parseXml(ctx, options);
    }

    return Promise.resolve({});
};