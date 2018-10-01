"use strict";

import Login from "./Login.js";
import FileUploadDisplay from "./FileUploadDisplay.js";
import SteemUpload from "../classes/SteemUpload.js";
import SteemFileWindow from "./SteemFileWindow.js";

import promiseDelay from "../utils/promiseDelay";
import {convertUint8ArrayToBinaryString} from '../utils/pack';
import {debugMessage} from '../utils/debug';

/**
 * Upload control - uploads a file into the steem blockchain
 */
class Upload {

    constructor() {
        this.Input                 = null;
        this.partLength            = 1500;   // test net = 15000, live net = 60000
        this.timeDelay             = 2000;   // test net = 20000 // at hf20 we can reduce it ;-)
        this.maxPartsForHiddenFile = 50;

        this.FileDisplay = null;

        this.blockSizeReachedDelay = 60000;   // test net = 60000
    }

    /**
     * Opens the upload
     */
    open(event) {
        if (window.STEEM_USER === '' || window.STEEM_PASS === '') {
            new Login({
                events: {
                    onSuccess: () => {
                        this.open(event);
                    }
                }
            }).open().catch(() => {
            });

            return;
        }

        this.Input.click();
    }

    /**
     *
     * @param {HTMLElement} Parent
     */
    inject(Parent) {
        this.Input      = document.createElement('input');
        this.Input.type = 'file';
        this.Input.addEventListener('change', this.onChange.bind(this), false);

        this.Input.style.opacity  = '0';
        this.Input.style.position = 'absolute';

        Parent.appendChild(this.Input);
        Parent.querySelector('button').addEventListener('click', this.open.bind(this));

        Parent.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            return false;
        })
    }

    /**
     * on change event -> file is selected
     */
    onChange() {
        let self  = this,
            files = this.Input.files;

        if (!files.length) {
            return;
        }

        let CurrentFile = files[0];
        let Reader      = new FileReader();

        this.FileDisplay = new FileUploadDisplay();

        this.FileDisplay.show();
        this.FileDisplay.setTitle('Loading file');

        // Closure to capture the file information.
        Reader.addEventListener('load', function () {
            let binary = '';

            try {
                let array = new Uint8Array(this.result);
                //let binary = String.fromCharCode.apply(null, array);
                binary    = convertUint8ArrayToBinaryString(array);
            } catch (e) {
                self.FileDisplay.hide().catch(() => {
                });
                debugMessage(e, 'error');
                return;
            }

            if (binary === '') {
                debugMessage('binary is empty', 'warn');

                self.FileDisplay.hide().catch(() => {
                });
                return;
            }

            //let hex = bin2hex(binary);
            let b64  = btoa(binary);
            let data = b64;

            debugMessage('!! b64 length: ' + b64.length);
            debugMessage('!! Bin length: ' + binary.length);
            debugMessage('File loaded and read');

            // start first post
            self.FileDisplay.setTitle('Start creating file post');

            // @todo get last post, because 5min time delay

            self.upload(data, {
                mime: files[0].type,
                size: files[0].size,
                name: files[0].name
            }).catch(function (e) {
                console.error(e);
            });
        });

        debugMessage('File reading');

        Reader.readAsArrayBuffer(CurrentFile);
    }

    /**
     * Upload the file via custom json
     *
     * @param data
     * @param {Object} fileMeta
     *
     * @returns {Promise}
     */
    upload(data, fileMeta) {
        let self    = this;
        let parts   = Math.ceil(data.length / this.partLength);
        let dataPart;
        let current = 0;

        debugMessage('data information');
        debugMessage('length: ' + data.length);
        debugMessage('Parts ' + parts);

        this.FileDisplay.setSteps(parts);
        this.FileDisplay.setTitle('Upload part ' + parseInt(current + 1) + ' of ' + parts);

        let tx = [];

        // upload process of one file part
        const process = function () {
            dataPart = data.substr(
                current * self.partLength,
                self.partLength
            );

            self.FileDisplay.setTitle('Upload part ' + parseInt(current + 1) + ' of ' + parts);
            self.FileDisplay.setProgress(current + 1);

            if (dataPart === '') {
                debugMessage('nothing todo');
                return Promise.resolve();
            }

            debugMessage('Create custom json');

            return SteemUpload.createFilePart(dataPart).then(function (result) {
                debugMessage('-> tx done');
                debugMessage(result);

                tx.push({
                    id      : result.id,
                    blockNum: result.block_num
                });

                if (current >= parts) {
                    return Promise.resolve();
                }

                current = current + 1;

                self.FileDisplay.setProgress(current);


                if (current >= parts) {
                    return Promise.resolve();
                }

                return promiseDelay(process, self.timeDelay);
            }).catch(function (err) {
                console.error(err);
            });
        };

        // execution
        return promiseDelay(process, self.timeDelay).then(function () {
            debugMessage('File upload done');
            debugMessage('Create File information');

            return SteemUpload.createFileInfo(fileMeta);
        }).then(function (result) {
            console.warn(result);

            tx.push({
                id      : result.id,
                blockNum: result.block_num
            });

            // create main tx
            return SteemUpload.createMainFile(tx);
        }).then(function (mainTx) {
            self.FileDisplay.done();

            new SteemFileWindow({
                file    : mainTx.id + '-' + mainTx.block_num,
                message : `
                    <p>Your upload was successful! Remember the following filename well, 
                    if you forget it, it'll be hard to get back your file.</p>
                    <p>You can now find your file at the following address:</p>`,
                postable: true
            }).open();

            // refresh from
            return window.List.refresh();
        });
    }

    /**
     * Easier, more pollution
     *
     * @deprecated
     */
    uploadWithComments() {
        SteemUpload.createFilePost(files[0].name, {
            mime_type: files[0].type,
            size     : files[0].size,
        }).then(function (permLink) {
            let parts   = Math.ceil(data.length / self.partLength);
            let dataPart;
            let current = 0;

            debugMessage('data information');
            debugMessage(data.length, self.partLength);
            debugMessage('Parts ' + parts);

            FileDisplay.setSteps(parts);

            // processing one part
            let process = function () {
                dataPart = data.substr(
                    current * self.partLength,
                    current * self.partLength + self.partLength
                );

                FileDisplay.setTitle('Upload part ' + parseInt(current + 1) + ' of ' + parts);
                FileDisplay.setProgress(current + 1);

                if (dataPart === '') {
                    debugMessage('nothing todo');
                    return Promise.resolve();
                }

                debugMessage('Create comment');

                return SteemUpload.createFileComment(permLink, dataPart).then(function () {
                    debugMessage('-> comment done');

                    if (current >= parts) {
                        return Promise.resolve();
                    }

                    current = current + 1;

                    FileDisplay.setProgress(current);


                    if (current >= parts) {
                        return Promise.resolve();
                    }

                    return promiseDelay(process, self.timeDelay);
                }, function (err) {
                    debugMessage(err, 'error');

                    if (err.jse_shortmsg.indexOf('.maximum_block_size') !== -1) {
                        debugMessage('maximum blocksize reached, wait 1 minute');
                        return promiseDelay(process, self.blockSizeReachedDelay);
                    }

                    // try again
                    return promiseDelay(process, self.timeDelay);
                });
            };

            FileDisplay.setTitle('Upload part ' + parseInt(current + 1) + ' of ' + parts);

            return promiseDelay(process, self.timeDelay).then(function () {
                debugMessage('done');

                FileDisplay.done().catch(() => {
                });

                // refresh from
                return window.List.refresh();
            });
        }).catch(function (err) {
            debugMessage(err, 'error');
            alert(err.message);
        });
    }
}

export default Upload;
