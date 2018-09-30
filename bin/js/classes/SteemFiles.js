"use strict";

import {debugMessage} from "../utils/debug";
import {binaryBuffer} from "../utils/pack";

class SteemFiles {

    /**
     * Return the current files in the steem blockchain
     *
     * @return {Promise}
     */
    static getFiles() {
        return window.Client.database.getDiscussions('created', {
            tag  : "steemfile",
            limit: 10
        });
    }

    /**
     * Return the comments of a file post and return the file data
     * - blob, filename, file info
     *
     * @param {string} author
     * @param {string} permlink
     * @returns {Promise}
     */
    static getComments(author, permlink) {
        return window.Client.database.call('get_content_replies', [author, permlink]);
    }

    /**
     * Download a complete file
     *
     * @param txId
     * @param blockNum
     * @return {PromiseLike<T | never> | Promise<T | never>}
     */
    static download(txId, blockNum) {
        debugMessage('Download');
        debugMessage(txId);
        debugMessage(blockNum);

        let txList   = [];
        let mimeType = '';
        let fileName = '';

        return window.Client.database.getTransaction({
            id       : txId,
            block_num: blockNum
        }).then(function (result) {
            if (!result) {
                return null;
            }

            debugMessage(result);

            let json = result.operations[0][1].json;

            try {
                json = JSON.parse(json);
            } catch (e) {
                debugMessage(e, 'error');
                return null;
            }

            if (typeof json.tx === 'undefined') {
                return null;
            }

            txList = json.tx.split(';').map(function (entry) {
                return entry.split(',');
            });

            // download a tx file part
            const downloadPart = function (txId, blockNum) {
                return window.Client.database.getTransaction({
                    id       : txId,
                    block_num: blockNum
                });
            };

            let l = txList.map(function (entry) {
                return downloadPart(entry[0], entry[1]);
            });

            return Promise.all(l);
        }).then(function (data) {
            if (!data) {
                return null;
            }

            const getTransactionFromBlockList = function (txId) {
                for (let i = 0, len = data.length; i < len; i++) {
                    if (data[i].transaction_id === txId) {
                        return data[i];
                    }
                }

                return null;
            };


            let i, len, tx, json;
            let fileContent = '';

            for (i = 0, len = txList.length; i < len; i++) {
                tx   = getTransactionFromBlockList(txList[i][0]);
                json = tx.operations[0][1].json;

                try {
                    json = JSON.parse(json);
                } catch (e) {
                    debugMessage(e, 'error');
                    continue;
                }

                if (json.t === 'i') {
                    mimeType = json.mime;
                    fileName = json.name;
                    continue;
                }

                if (json.t === 'c') {
                    console.warn(json.d);

                    fileContent = fileContent + json.d;
                }
            }

            let binary = atob(fileContent);
            let array  = binaryBuffer(binary);

            let blob = new Blob([array], {
                type: mimeType
            });

            //debugNode(fileContent);
            //download(blob, fileName);

            return {
                blob: blob,
                name: fileName,
                mime: mimeType
            }
        });
    }
}

export default SteemFiles;
