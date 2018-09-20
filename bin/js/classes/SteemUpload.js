"use strict";

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
            app : 'stfu-file-uploader'
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
                    app : 'stfu-file-uploader'
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
}

export default SteemUpload;
