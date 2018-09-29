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

        this.Elm        = null;
        this.Title      = null;
        this.Icon       = null;
        this.Status     = null;
        this.Progress   = null;
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

        this.Title    = this.Elm.querySelector('.file-upload-display-data-title');
        this.Status   = this.Elm.querySelector('.file-upload-display-data-status');
        this.Progress = this.Elm.querySelector('.file-upload-display-data-bar-progress');
        this.Icon     = this.Elm.querySelector('.file-upload-display-icon');

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
     */
    show() {
        this.inject(document.body);

        Velocity(this.Elm, {
            opacity: 1
        });
    }

    /**
     * hide the file upload
     *
     * @return {Promise}
     */
    hide() {
        return Velocity(this.Elm, {
            opacity: 0
        }).promise.then(() => {
            return Velocity(this.Background, {
                opacity: 0
            }).promise.then(() => {
                this.Background.parentNode.removeChild(this.Background);
            });
        });
    }

    /**
     * Set
     */
    start(next) {
        let steps = parseInt(this.options.steps);

        if (typeof next === 'undefined') {
            next = 1;
        }

        if (next > steps) {
            next = steps;
        }

        let nextPC = Math.round(100 / (steps / next));

        return new Promise((resolve) => {
            this.$Animation = Velocity(this.Progress, {
                width: nextPC + '%'
            }, {
                duration: 50000
            }).promise.then(resolve);
        });
    }

    /**
     * File upload is done
     * Execute the done step and hide the file upload
     *
     * @returns {Promise<any>}
     */
    done() {
        return new Promise((resolve) => {
            if (this.$Animation) {
                Velocity(this.Progress, 'stop');
            }

            this.Icon.innerHTML = `<span class="fa fa-check"></span>`;

            setTimeout(() => {
                this.hide().then(resolve).catch(() => {
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
     *
     * @param {Number} step
     */
    setProgress(step) {
        let steps     = parseInt(this.options.steps);
        let current   = Math.round(steps / step);
        let currentPC = 100 / current;

        if (this.$Animation) {
            Velocity(this.Progress, 'stop');
        }

        Velocity(this.Progress, {
            width: currentPC + '%'
        }, {
            duration: 200
        }).promise.then(() => {
            this.start(current + 1);
        });
    }

    //endregion
}

export default FileUploadDisplay;
