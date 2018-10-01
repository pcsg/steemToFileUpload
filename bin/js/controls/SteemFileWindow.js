"use strict";

import css from "../utils/css";
import * as conf from "../conf";

// requirements
css('/bin/js/controls/SteemFileWindow.css').catch(function () {
    // nothing
});

/**
 * Opens the login window
 */
class SteemFileWindow {

    /**
     * constructor
     *
     * @param options
     */
    constructor(options) {
        this.options = options || {};

        this.onSuccess = function () {
        };

        if (typeof this.options.events !== 'undefined'
            && typeof this.options.events.onSuccess !== 'undefined') {
            this.onSuccess = this.options.events.onSuccess;
        }

        // defaults
        if (typeof this.options.message === 'undefined') {
            this.options.message = '';
        }

        if (typeof this.options.file === 'undefined') {
            this.options.file = '';
        }
    }

    //region opening, closing

    /**
     * open the login window
     *
     * @return {Promise}
     */
    open() {
        this.Background = document.createElement('div');
        this.Main       = document.createElement('div');

        this.Background.classList.add('steem-file-window-background');

        this.Main.classList.add('steem-file-window-main');
        this.Main.addEventListener('click', (event) => {
            event.stopPropagation();
            return false;
        });


        let message = this.options.message || '';
        let file    = conf.FILE_SCHEME + this.options.file || '';

        this.Main.innerHTML = `
            <div class="login-main-container">
                <h1>STEEM File</h1>
                ${message}
                
                <pre><code>${file}</code></pre>
            </div>
        `;

        // show
        this.Background.addEventListener('click', this.close.bind(this));

        document.body.appendChild(this.Background);

        this.Background.appendChild(this.Main);
        this.Background.style.opacity = '0';

        this.Main.style.marginTop = '-50px';
        this.Main.style.opacity   = '0';

        return mooPFX(this.Background, {
            opacity: 1
        }).then(() => {
            return mooPFX(this.Main, {
                marginTop: 0,
                opacity  : 1
            }, {
                duration: 350,
                easing  : "easeInQuad"
            });
        });
    }

    /**
     * Close the login
     *
     * @return {Promise}
     */
    close() {
        return mooPFX(this.Main, {
            marginTop: '-50px',
            opacity  : 0
        }, {
            duration: 350,
            easing  : "easeOutQuint"
        }).then(() => {
            return mooPFX(this.Background, {
                opacity: 0
            }).then(() => {
                this.Background.parentNode.removeChild(this.Background);
            });
        });
    }

    //endregion

}

export default SteemFileWindow;
