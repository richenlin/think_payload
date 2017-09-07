/**
 *
 * 
 */
const fs = require('fs');
const lib = require('think_lib');
const formidable = require('formidable');
const onFinished = require('on-finished');

module.exports = (ctx, opts = {}) => {
    const req = ctx.req;
    const form = new formidable.IncomingForm(opts);

    let uploadFiles = null;
    onFinished(ctx.res, () => {
        if (!uploadFiles) {
            return;
        }
        const fsUnlink = lib.promisify(fs.unlink, fs);
        const fsAccess = lib.promisify(fs.access, fs);
        Object.keys(uploadFiles).forEach(key => {
            fsAccess(uploadFiles[key].path).then(() => fsUnlink(uploadFiles[key].path)).catch(() => {});
        });
    });

    return new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
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