/**
 *
 * 
 */
const text = require('./text.js');
const lib = require('think_lib');
const parseString = require('xml2js').parseString;
const parser = lib.promisify(parseString, parseString);

module.exports = (ctx, opts) => text(ctx, opts).then(parser).then(data => ({ post: data }));