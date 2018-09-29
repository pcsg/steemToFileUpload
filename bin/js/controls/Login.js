"use strict";

import css from "../utils/css";

// requirements
css('/bin/js/controls/Login.css').catch(function () {
    // nothing
});

/**
 * Opens the login window
 */
class Login {

    /**
     * constructor
     *
     * @param options
     */
    constructor(options) {
        this.onSuccess = function () {
        };

        if (typeof options.events.onSuccess !== 'undefined') {
            this.onSuccess = options.events.onSuccess;
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

        this.Background.classList.add('login-background');

        this.Main.classList.add('login-main');
        this.Main.addEventListener('click', (event) => {
            event.stopPropagation();
            return false;
        });

        this.Main.innerHTML = `
            <div class="login-main-container">
                <h1>STEEM Login</h1>
                <p>These data are not stored or sent anywhere. As soon as you close your browser window these data are no longer available.</p>
                
                <form>
                    <label>
                        <span>Username</span>
                        <input type="text" name="username" autofocus/>
                    </label>
                    
                    <label>
                        <span>Password</span>
                        <input type="password" name="password"/>
                    </label>
                    
                    <input type="submit" value="Login!" />
                </form>
            </div>
            <span class="login-main-loader fas fa-circle-notch fa-spin"></span>
        `;

        this.Main.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();

            this.login();
            return false;
        });

        this.Main.querySelector('.login-main-loader').style.display = 'none';
        this.Main.querySelector('.login-main-loader').style.opacity = '0';

        // show
        this.Background.addEventListener('click', this.close.bind(this));

        document.body.appendChild(this.Background);

        this.Background.appendChild(this.Main);
        this.Background.style.opacity = '0';

        this.Main.style.marginTop = '-50px';
        this.Main.style.opacity   = '0';

        return Velocity(this.Background, {
            opacity: 1
        }).promise.then(() => {
            return Velocity(this.Main, {
                marginTop: 0,
                opacity  : 1
            }, {
                duration: 350,
                easing  : "easeInQuad"
            }).promise.then(function () {
                // velocity workaround :D
            });
        });
    }

    /**
     * Close the login
     *
     * @reutrn {Promise}
     */
    close() {
        return Velocity(this.Main, {
            marginTop: '-50px',
            opacity  : 0
        }, {
            duration: 350,
            easing  : "easeOutQuint"
        }).promise.then(() => {
            return Velocity(this.Background, {
                opacity: 0
            }).promise.then(() => {
                this.Background.parentNode.removeChild(this.Background);
            });
        });
    }

    //endregion

    /**
     * Opens the login
     */
    login() {
        let username = this.Main.querySelector('[name="username"]').value;
        let password = this.Main.querySelector('[name="password"]').value;

        this.showLoading().then(() => {
            // check wif
            let postingKey = dsteem.PrivateKey.fromLogin(username, password, 'posting');

            this.checkAuthentication(username, postingKey).then((isAuthenticated) => {
                if (isAuthenticated === false) {
                    this.hideLoading().then(() => {
                        this.open().catch(() => {
                        });
                    });
                    return;
                }

                document.querySelector('.upload button').innerHTML = `
                    <span class="fa fa-upload"></span>
                    <span class="upload-text">Upload</span>
                `;

                window.STEEM_USER = username;
                window.STEEM_PASS = password;

                this.hideLoading();
                this.onSuccess();
            });
        });
    }

    /**
     *
     * @param username
     * @param postingKey
     * @returns {PromiseLike<T | never> | Promise<T | never>}
     */
    checkAuthentication(username, postingKey) {
        return window.Client.database.getAccounts([username]).then(function (result) {
            if (result.length === 0) {
                return false;
            }

            let publicPostingKey = result[0].posting.key_auths[0][0];
            let createdPub       = postingKey.createPublic(window.STEEM_PRFX).toString();

            return publicPostingKey === createdPub;
        }, function () {
            return false;
        });
    }

    //region loader

    /**
     * Shows the loading animation
     *
     * @returns {Promise<T | never>}
     */
    showLoading() {
        let Container = this.Main.querySelector('.login-main-container');

        return Velocity(Container, {
            opacity: 0
        }, {
            duration: 200
        }).promise.then(() => {
            this.Main.querySelector('.login-main-loader').style.display = '';
            this.Main.querySelector('.login-main-loader').style.opacity = '1';

            return Velocity(this.Main, {
                borderRadius: '10px',
                height      : 100,
                width       : 100
            }, {
                duration: 1000,
                easing  : 'easeOutQuint'
            }).promise.then(() => {
            });
        });
    }

    /**
     * Hides the loading animation
     */
    hideLoading() {
        return this.close();
    }

    //endregion
}

export default Login;
