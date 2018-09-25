"use strict";

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
     * Return the comments of a file post
     *
     * @param {string} author
     * @param {string} permlink
     * @returns {Promise}
     */
    static getComments(author, permlink) {
        return window.Client.database.call('get_content_replies', [author, permlink]);
    }
}

export default SteemFiles;
