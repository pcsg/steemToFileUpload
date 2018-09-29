"use strict";

import SteemUpload from "../classes/SteemUpload";
import Login from "./Login.js";
import FileUploadDisplay from "./FileUploadDisplay.js";

import promiseDelay from "../utils/promiseDelay";
import {convertUint8ArrayToBinaryString} from '../utils/pack';
import {debugMessage} from '../utils/debug';

/**
 * Upload control - uploads a file into the steem blockchain
 */
class Upload {

    constructor() {
        this.Input      = null;
        this.partLength = 60000;   // test net = 15000, live net = 60000
        this.timeDelay  = 5000;   // test net = 20000 // at hf20 we can reduce it ;-)

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
        let FileDisplay = new FileUploadDisplay();

        FileDisplay.show();
        FileDisplay.setTitle('Loading file');

        // Closure to capture the file information.
        Reader.addEventListener('load', function () {
            let binary = '';

            try {
                let array = new Uint8Array(this.result);
                //let binary = String.fromCharCode.apply(null, array);
                binary    = convertUint8ArrayToBinaryString(array);
            } catch (e) {
                FileDisplay.hide().catch(() => {
                });
                debugMessage(e, 'error');
                return;
            }

            if (binary === '') {
                FileDisplay.hide().catch(() => {
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
            FileDisplay.setTitle('Start creating file post');

            // @todo get last post, because 5min time delay

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
                FileDisplay.start();

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
        });

        debugMessage('File reading');

        Reader.readAsArrayBuffer(CurrentFile);
    }
}

export default Upload;
