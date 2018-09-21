"use strict";

import SteemUpload from "../classes/SteemUpload";
import promiseDelay from "../utils/promiseDelay";
import {bin2hex} from '../utils/pack';
import {debugNode} from '../utils/debug';

/**
 * Upload control - uploads a file into the steem blockchain
 */
class Upload {

    constructor() {
        this.Input      = null;
        this.partLength = 15000;   // test net = 10000, live net = 200000
        this.timeDelay  = 20000;   // test net = 20000 // at hf20 we can reduce it ;-)

        this.blockSizeReachedDelay = 60000;   // test net = 60000
    }

    /**
     * Opens the upload
     */
    open() {
        if (!this.Input) {
            this.Input      = document.createElement('input');
            this.Input.type = 'file';
        }

        this.Input.click();
        this.Input.addEventListener('change', this.onChange.bind(this), false);
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

        // Closure to capture the file information.
        Reader.addEventListener('load', function () {
            let array  = new Uint8Array(this.result);
            let binary = String.fromCharCode.apply(null, array);
            let hex    = bin2hex(binary);

            console.info('!! Hex length: ' + hex.length);
            console.info('!! Bin length: ' + binary.length);
            console.log('File loaded and read');

            // start first post
            console.log('Start creating post');

            SteemUpload.createFilePost(files[0].name, {
                mime_type: files[0].type,
                size     : files[0].size,
            }).then(function (permLink) {
                let parts   = Math.ceil(hex.length / self.partLength);
                let hexPart;
                let current = 0;

                console.log('Parts: ' + parts);

                // @todo time delay
                let process = function () {
                    hexPart = hex.substr(
                        current * self.partLength,
                        current * self.partLength + self.partLength
                    );

                    console.log('Upload ' + current + ' from ' + parts);
                    //console.log(hexPart);

                    if (hexPart === '') {
                        return Promise.resolve();
                    }

                    return SteemUpload.createFileComment(permLink, hexPart).then(function () {
                        if (current + 1 > parts) {
                            return Promise.resolve();
                        }

                        current = current + 1;

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


                console.log('Start Uploading');

                return promiseDelay(process, self.timeDelay).then(function () {
                    console.log('done');

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
