'use strict';

const Promise = require('bluebird');
const cp = Promise.promisifyAll(require('child_process'));
const fs = Promise.promisifyAll(require('fs'));
const Xfdf = require('xfdf');

let extend = (defaults, options) => {
    let extended = {};
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

    generateXfdf: (data) => {
        return new Xfdf().fromJSON({
            fields: data
        }).generate();
    },

    // FILL PDF FORMS
    fillForm: (userOptions, cb) => {

        let options = extend({
            src: null,
            dest: `./modules/tmp/${Date.now()}.pdf`,
            data: null,
            flatten: true
        }, userOptions);

        let tempXfdfFile = `./modules/tmp/${Date.now()}.xfdf`;
        let flatten = options.flatten ? 'flatten' : '';

        return fs.writeFileAsync(tempXfdfFile, module.exports.generateXfdf(options.data))

            .then(() => {
                return cp.execAsync(`pdftk ${options.src} fill_form ${tempXfdfFile} output ${options.dest} ${flatten}`);
            })

            .then(() => {
                return fs.unlinkAsync(tempXfdfFile);
            })

            .then(() => {
                let returnFile;
                return fs.readFileAsync(options.dest)
                    .then(file => {
                        returnFile = file;
                        return fs.unlinkAsync(options.dest);
                    })
                    .then(() => {
                        if (cb) return cb(null, returnFile);
                        else return returnFile;
                    })
                    .catch(err => {
                        if (cb) return cb(err);
                        else throw err;
                    });
            })

            .catch(err => {
                if (cb) return cb(err);
                else throw err;
            });

    },


    // STAMP ONE PDF ONTO ANOTHER
    stamp: (sourceFile, stampFile, destFile, flatten, cb) => {

        let flatArg = flatten ? ' flatten' : '';

        return cp.execAsync(`pdftk ${sourceFile} stamp ${stampFile} output ${destFile}${flatArg}`)

            .then((stdout, stderr) => {
                if (cb) {
                    return cb(null);
                }
                else return null;
            })

            .catch(err => {
                if (cb) {
                    return cb(err);
                } else {
                    throw err;
                }
            });

    }

};