"use strict";

import SteemUpload from "../classes/SteemUpload";
import Login from "./Login.js";
import FileUploadDisplay from "./FileUploadDisplay.js";

import promiseDelay from "../utils/promiseDelay";
import {bin2hex, convertUint8ArrayToBinaryString} from '../utils/pack';

import {debugNode} from '../utils/debug';

/**
 * Upload control - uploads a file into the steem blockchain
 */
class Upload {

    constructor() {
        this.Input = null;
        this.partLength = 15000;   // test net = 10000, live net = 200000
        this.timeDelay = 20000;   // test net = 20000 // at hf20 we can reduce it ;-)

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
        this.Input = document.createElement('input');
        this.Input.type = 'file';
        this.Input.addEventListener('change', this.onChange.bind(this), false);

        this.Input.style.opacity = '0';
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
        let self = this,
            files = this.Input.files;

        if (!files.length) {
            return;
        }

        let CurrentFile = files[0];
        let Reader = new FileReader();
        let FileDisplay = new FileUploadDisplay();

        FileDisplay.show();
        FileDisplay.setTitle('Loading file');

        // Closure to capture the file information.
        Reader.addEventListener('load', function () {
            let binary = '';

            try {
                let array = new Uint8Array(this.result);
                //let binary = String.fromCharCode.apply(null, array);
                binary = convertUint8ArrayToBinaryString(array);
            } catch (e) {
                FileDisplay.hide().catch(() => {
                });
                console.error(e);
                return;
            }

            if (binary === '') {
                FileDisplay.hide().catch(() => {
                });
                return;
            }

            let hex = bin2hex(binary);

            console.info('!! Hex length: ' + hex.length);
            console.info('!! Bin length: ' + binary.length);
            console.log('File loaded and read');

            // start first post
            FileDisplay.setTitle('Start creating file post');

            SteemUpload.createFilePost(files[0].name, {
                mime_type: files[0].type,
                size: files[0].size,
            }).then(function (permLink) {
                let parts = Math.ceil(hex.length / self.partLength);
                let hexPart;
                let current = 0;

                console.log('calc');
                console.log(hex.length, self.partLength);


                FileDisplay.setSteps(parts);

                // @todo time delay
                let process = function () {
                    hexPart = hex.substr(
                        current * self.partLength,
                        current * self.partLength + self.partLength
                    );

                    FileDisplay.setTitle('Upload part ' + parseInt(current + 1) + ' of ' + parts);
                    FileDisplay.setProgress(current + 1);

                    if (hexPart === '') {
                        return Promise.resolve();
                    }

                    return SteemUpload.createFileComment(permLink, hexPart).then(function () {
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
                        //console.log(err);
                        if (err.jse_shortmsg.indexOf('.maximum_block_size') !== -1) {
                            console.log('maximum blocksize reached, wait 1 minute');
                            return promiseDelay(process, self.blockSizeReachedDelay);
                        }

                        // try again
                        return promiseDelay(process, self.timeDelay);
                    });
                };

                FileDisplay.setTitle('Upload part ' + parseInt(current + 1) + ' of ' + parts);
                FileDisplay.start();

                return promiseDelay(process, self.timeDelay).then(function () {
                    console.log('done');

                    FileDisplay.done();

                    // refresh from
                    return window.List.refresh();
                });
            }).catch(function (err) {
                console.error(err);
                alert(err.message);
            });
        });

        console.log('File reading');

        Reader.readAsArrayBuffer(CurrentFile);
    }
}

export default Upload;
