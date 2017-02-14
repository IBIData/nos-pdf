'use strict';

const Promise = require('bluebird');
const cp = Promise.promisifyAll(require('child_process'));
const fs = Promise.promisifyAll(require('fs'));
const Xfdf = require('xfdf');

const localDir = `${__dirname}/tmp`;

const extend = (defaults, options) => {
    const extended = {};
    let prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};


module.exports = {

    generateXfdf: data =>
        new Xfdf().fromJSON({
            fields: data,
        }).generate(),

    // FILL PDF FORMS
    fillForm: (userOptions, cb) => {

        const options = extend({
            src: null,
            dest: `${localDir}/${Date.now()}.pdf`,
            data: null,
            flatten: true,
        }, userOptions);

        const tempXfdfFile = `${localDir}/${Date.now()}.xfdf`;
        const flatten = options.flatten ? 'flatten' : '';

        return fs.writeFileAsync(tempXfdfFile, module.exports.generateXfdf(options.data))

            .then(() => cp.execAsync(`pdftk ${options.src} fill_form ${tempXfdfFile} output ${options.dest} ${flatten}`))

            .then(() => fs.unlinkAsync(tempXfdfFile))

            .then(() => {

                let returnFile;

                return fs.readFileAsync(options.dest)
                    .then(file => {
                        returnFile = file;
                        if (userOptions.dest) return null;
                        return fs.unlinkAsync(options.dest);
                    })
                    .then(() => {
                        if (cb) return cb(null, returnFile);
                        return returnFile;
                    })
                    .catch(err => {
                        if (cb) return cb(err);
                        throw err;
                    });
            })

            .catch(err => {
                if (cb) return cb(err);
                throw err;
            });

    },


    // STAMP ONE PDF ONTO ANOTHER
    stamp: (userOptions, cb) => {

        const options = extend({
            src: null,
            stampFile: null,
            dest: `${localDir}/${Date.now()}.pdf`,
            flatten: true,
        }, userOptions);

        const flatten = options.flatten ? 'flatten' : '';

        return cp.execAsync(`pdftk ${options.src} stamp ${options.stampFile} output ${options.dest} ${flatten}`)

            .then(() => {

                let returnFile;

                return fs.readFileAsync(options.dest)
                    .then(file => {
                        returnFile = file;
                        if (userOptions.dest) {
                            return null;
                        }
                        return fs.unlinkAsync(options.dest);
                    })
                    .then(() => {
                        if (cb) return cb(null, returnFile);
                        return returnFile;
                    })
                    .catch(err => {
                        if (cb) return cb(err);
                        throw err;
                    });
            })

            .catch(err => {
                if (cb) {
                    return cb(err);
                }
                throw err;
            });

    },

};
