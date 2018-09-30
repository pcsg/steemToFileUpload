"use strict";

import * as conf from '../conf';
import {debugMessage} from "../utils/debug";

class SteemUpload {

    /**
     * Create the first post for the file
     *
     * @param fileTitle
     * @param [fileData]
     * @returns {Promise}
     */
    static createFilePost(fileTitle, fileData) {
        let wif     = dsteem.PrivateKey.fromLogin(window.STEEM_USER, window.STEEM_PASS, 'posting');
        let body    = 'FILE UPLOAD';
        let tagList = ['steemfile'];

        // prepare pemlink
        let permlink = fileTitle + '-' + new Date().toISOString();
        permlink     = permlink.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();


        // prepare json data
        fileData = fileData || {};

        let jsonMeta = {
            tags: tagList,
            app : conf.VERSION
        };

        if ("mime_type" in fileData) {
            jsonMeta.mime_type = fileData.mime_type;
        }

        if ("size" in fileData) {
            jsonMeta.size = fileData.size;
        }

        return new Promise(function (resolve, reject) {
            window.Client.broadcast.commentWithOptions(
                {
                    author         : window.STEEM_USER,
                    body           : body,
                    json_metadata  : JSON.stringify(jsonMeta),
                    parent_author  : '',
                    parent_permlink: tagList[0],
                    permlink       : permlink,
                    title          : fileTitle
                },
                {
                    allow_curation_rewards: true,
                    percent_steem_dollars : 10000,
                    allow_votes           : true,
                    author                : window.STEEM_USER,
                    permlink              : permlink,
                    max_accepted_payout   : "1000000.000 SBD",
                    extensions            : [[
                        0,
                        {
                            "beneficiaries": [{
                                "account": "pcsg-dev",
                                "weight" : 1000
                            }]
                        }
                    ]]
                },
                wif
            ).then(function () {
                resolve(permlink);
            }).catch(reject);
        });
    }

    /**
     * Create a file comment
     *
     * @param postPermLink
     * @param data - hex file part data
     * @returns {Promise}
     *
     * @deprecated
     */
    static createFileComment(postPermLink, data) {
        let wif      = dsteem.PrivateKey.fromLogin(window.STEEM_USER, window.STEEM_PASS, 'posting');
        let permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        let tagList  = ['steemfile'];

        return window.Client.broadcast.commentWithOptions(
            {
                author         : window.STEEM_USER,
                body           : data,
                json_metadata  : JSON.stringify({
                    tags: tagList,
                    app : conf.VERSION
                }),
                parent_author  : window.STEEM_USER,
                parent_permlink: postPermLink,
                permlink       : permlink,
                title          : '',
            },
            {
                allow_curation_rewards: true,
                percent_steem_dollars : 10000,
                allow_votes           : true,
                author                : window.STEEM_USER,
                permlink              : permlink,
                max_accepted_payout   : "1000000.000 SBD",
                extensions            : [[
                    0,
                    {
                        "beneficiaries": [{
                            "account": "pcsg-dev",
                            "weight" : 1000
                        }]
                    }
                ]]
            },
            wif
        );
    }

    //region transactions

    /**
     * Create a json transaction for a file part
     *
     * @param {String} data
     * @return {Promise}
     */
    static createFilePart(data) {
        const json = `{"d":"${data}", "t": "c"}`;

        debugMessage('Send tx');
        debugMessage(json);

        if (data === '') {
            return Promise.reject('Empty file part not allowed');
        }

        return this.broadcastJson(json);
    }

    /**
     * Create a json transaction for a file part
     *
     * @param {Array} txList
     * @return {Promise}
     */
    static createMainFile(txList) {
        const list = txList.map(function (tx) {
            return tx.id + ',' + tx.blockNum
        }).join(';');

        debugMessage('Send tx');
        debugMessage(list);

        if (list === '') {
            return Promise.reject('Empty file part not allowed');
        }

        return this.broadcastJson(JSON.stringify({
            tx: list
        }));
    }

    /**
     *
     * @param fileData
     * @return {Promise}
     */
    static createFileInfo(fileData) {
        return this.broadcastJson(JSON.stringify({
            name: fileData.name,
            mime: fileData.mime,
            size: fileData.size,
            t   : 'i'
        }));
    }

    /**
     *
     * @param {String} jsonString
     * @return {*|Promise<any>}
     */
    static broadcastJson(jsonString) {
        const wif = dsteem.PrivateKey.fromLogin(window.STEEM_USER, window.STEEM_PASS, 'active');
        const id  = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

        return window.Client.broadcast.json({
            required_auths        : [window.STEEM_USER],
            required_posting_auths: [],
            id                    : id,
            json                  : jsonString
        }, wif);
    }

    //endregion
}

export default SteemUpload;
