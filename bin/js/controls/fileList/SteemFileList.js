'use strict';

import SteemFiles from '../../classes/SteemFiles';
import SteemFile from "./SteemFile";

import {debugMessage} from '../../utils/debug';

/**
 * FileList DOMNode Control
 */
class SteemFileList {

    /**
     * constructor
     */
    constructor() {
        this.files = [];

        this.Table = null;
        this.THead = null;
        this.TBody = null;
    }

    /**
     * Create the DOMNode Element
     *
     * @return {HTMLTableElement}
     */
    create() {
        this.Table = document.createElement('table');
        this.THead = document.createElement('thead');
        this.TBody = document.createElement('tbody');

        this.THead.innerHTML = `
                <thead>
                <tr>
                    <th>Type</th>
                    <th>File</th>
                    <th>Date</th>
                    <th></th>
                </tr>
                </thead>`;

        this.TBody.innerHTML = `
                <tr>
                    <td><span class="fas fa-circle-notch fa-spin"></span></td>
                </tr>`;

        this.Table.appendChild(this.THead);
        this.Table.appendChild(this.TBody);

        return this.Table;
    }

    /**
     * Inject the HTMLNode into the parent
     *
     * @param {Element} Parent
     */
    inject(Parent) {
        Parent.appendChild(this.create());

        this.refresh().catch(function (err) {
            debugMessage(err, 'error');
        });
    }

    /**
     * Refresh the list
     *
     * @return {Promise}
     */
    refresh() {
        return SteemFiles.getFiles().then(posts => {
            this.TBody.innerHTML = '';

            for (let i = 0, len = posts.length; i < len; i++) {
                this.appendFile(
                    new SteemFile(posts[i])
                )
            }
        });
    }

    /**
     *
     * @param {SteemFile} File
     */
    appendFile(File) {
        File.inject(this.TBody);
    }
}

export default SteemFileList;