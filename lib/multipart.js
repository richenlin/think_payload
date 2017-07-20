/**
 *
 * 
 */
const fs = require('fs');
const lib = require('think_lib');
const formidable = require('formidable');
const fsUnlink = lib.promisify(fs.unlink, fs);
const fsAccess = lib.promisify(fs.access, fs);

module.exports = (ctx, opts = {}) => {
    const req = ctx.req;
    const form = new formidable.IncomingForm(opts);

    ctx.res.once('finish', () => {
        const files = ctx.request.body.file;
        const unlinks = Object.keys(files).map(key => {
            return fsAccess(files[key].path).then(() => fsUnlink(files[key].path)).catch(() => { });
        });
        Promise.all(unlinks);
    });

    return new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
            if (err) {
                return reject(err);
            }
            return resolve({
                post: fields,
                file: files
            });
        });
    });
};