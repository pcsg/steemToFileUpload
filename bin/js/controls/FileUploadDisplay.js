"use strict";

import css from "../utils/css";

css('/bin/js/controls/FileUploadDisplay.css').catch(() => {
});

class FileUploadDisplay {

    /**
     *
     * @param {Object} [options]
     */
    constructor(options) {
        let defaults = ['steps'];

        this.options = options || {
            steps: 1
        };

        defaults.forEach((key) => {
            if (typeof this.options[key] === 'undefined') {
                this.options[key] = '';
            }
        });

        this.Elm = null;
        this.Title = null;
        this.Icon = null;
        this.Status = null;
        this.Progress = null;
        this.Background = null;

        this.$Animation = null;
    }

    /**
     * Create the DOMNode Element
     *
     * @returns {HTMLDivElement}
     */
    create() {
        this.Background = document.createElement('div');
        this.Background.classList.add('file-upload-background');

        this.Elm = document.createElement('div');
        this.Elm.classList.add('file-upload-display');

        this.Elm.innerHTML = `
            <div class="file-upload-display-container">
                <div class="file-upload-display-icon">
                    <span class="fas fa-circle-notch fa-spin"></span>
                </div>
                <div class="file-upload-display-data">
                    <div class="file-upload-display-data-title"></div>
                    <div class="file-upload-display-data-status">
                        <span class="fa fa-close"></span>
                    </div>
                    <div class="file-upload-display-data-bar">
                        <div class="file-upload-display-data-bar-progress"></div>
                    </div>
                </div>
            </div>
        `;

        this.Title = this.Elm.querySelector('.file-upload-display-data-title');
        this.Status = this.Elm.querySelector('.file-upload-display-data-status');
        this.Progress = this.Elm.querySelector('.file-upload-display-data-bar-progress');
        this.Icon = this.Elm.querySelector('.file-upload-display-icon');

        this.Background.appendChild(this.Elm);

        return this.Background;
    }

    /**
     *
     * @param Parent
     */
    inject(Parent) {
        Parent.appendChild(this.create());
    }

    /**
     * inject the file display into the body
     *
     * @return {Promise}
     */
    show() {
        this.inject(document.body);

        return mooPFX(this.Elm, {
            opacity: 1
        });
    }

    /**
     * hide the file upload
     *
     * @return {Promise}
     */
    hide() {
        return mooPFX(this.Elm, {
            opacity: 0
        }).then(() => {
            return mooPFX(this.Background, {
                opacity: 0
            });
        }).then(() => {
            this.Background.parentNode.removeChild(this.Background);
        });
    }

    /**
     * File upload is done
     * Execute the done step and hide the file upload
     *
     * @returns {Promise}
     */
    done() {
        this.Icon.innerHTML = `<span class="fa fa-check"></span>`;

        return new Promise((resolve) => {
            setTimeout(() => {
                this.hide().then(resolve).catch((e) => {
                    console.error(e);
                });
            }, 1000);
        });
    }

    //region display setter

    /**
     * Set the max steps of the file
     *
     * @param steps
     */
    setSteps(steps) {
        this.options.steps = parseInt(steps);
    }

    /**
     * Set title
     * @param text
     */
    setTitle(text) {
        this.Title.innerText = text;
    }

    /**
     * Animate the progress bar
     *
     * @param {Number} step
     * @return {Promise}
     */
    setProgress(step) {
        let steps = parseInt(this.options.steps);
        let current = steps / step;
        current = Math.round(current * 100) / 100;

        let currentPC = 100 / current;

        return mooPFX(this.Progress, {
            width: currentPC + '%'
        }, {
            duration: 200
        });
    }

    //endregion
}

export default FileUploadDisplay;
