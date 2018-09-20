"use strict";

import SteemFiles from '../../classes/SteemFiles';
import {hex2bin} from '../../utils/pack';
import {debugNode} from "../../utils/debug";

/**
 * One STEEM FILE
 */
class SteemFile {
    constructor(steemPost) {
        this.data = steemPost;
        this.Node = null;
    }

    /**
     * Return the domnode of the steem file
     *
     * @returns {HTMLElement}
     */
    create() {
        if (this.Node) {
            return this.Node;
        }

        this.Node = document.createElement('tr');

        console.log(this.data);

        this.Node.setAttribute('data-permlink', this.data.permlink);
        this.Node.setAttribute('data-id', this.data.id);
        this.Node.setAttribute('data-author', this.data.author);

        // meta data
        let jsonMetaData = JSON.parse(this.data.json_metadata);
        let mimeType     = jsonMetaData.mime_type || '';
        let size         = jsonMetaData.size || '';
        let icon         = 'far fa-file';

        if (mimeType.indexOf('video/') !== -1) {
            icon = 'far fa-video';
        }

        if (mimeType.indexOf('image/') !== -1) {
            icon = 'far fa-image';
        }

        if (mimeType === '') {
            icon = 'fa fa-bolt';
        }

        this.Node.setAttribute('data-size', size);


        this.Node.innerHTML = `
            <td>
                <span class="` + icon + `"></span>
            </td>
            <td>` + this.data.title + `</td>
            <td>` + this.data.created + `</td>
            <td>
                <button class="download">
                    <span class="fa fa-download"></span>
                </button>
            </td>
        `;

        this.Node.querySelector('button').addEventListener('click', event => {
            event.stopPropagation();

            this.download();

            return false;
        });

        return this.Node;
    }

    /**
     *
     * @param {Element} Parent
     */
    inject(Parent) {
        Parent.appendChild(this.create());
    }

    /**
     * Start the downloading of the file
     */
    download() {
        let author       = this.Node.getAttribute('data-author');
        let permlink     = this.Node.getAttribute('data-permlink');
        let jsonMetaData = JSON.parse(this.data.json_metadata);

        this.Node.querySelector('button').innerHTML = `<span class="fas fa-spinner fa-spin"></span>`;

        SteemFiles.getComments(author, permlink).then(comments => {
            let fileContent = '';

            console.log('File parts ' + comments.length);

            for (let i = 0, len = comments.length; i < len; i++) {
                fileContent = fileContent + comments[i].body;
            }

            let blob = new Blob([hex2bin(fileContent)], {
                type: jsonMetaData.mime_type
            });

            console.log(blob);
            //debugNode(fileContent);
            download(blob, this.data.root_title);

            this.Node.querySelector('button').innerHTML = `<span class="fa fa-download"></span>`;
        });
    }
}

export default SteemFile;
