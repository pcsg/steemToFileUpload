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
        `;

        this.Main.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();

            this.login();
            return false;
        });

        // show
        this.Background.addEventListener('click', this.close.bind(this));

        document.body.appendChild(this.Background);
        this.Background.appendChild(this.Main);
    }

    /**
     * Close the login
     */
    close() {
        this.Main.parentNode.removeChild(this.Main);
        this.Background.parentNode.removeChild(this.Background);
    }

    //endregion

    login() {
        // @todo show loader

        let username = this.Main.querySelector('[name="username"]').value;
        let password = this.Main.querySelector('[name="password"]').value;

        // check wif
        let postingKey = dsteem.PrivateKey.fromLogin(username, password, 'posting');

        // @todo check postingKey

        window.STEEM_USER = username;
        window.STEEM_PASS = password;

        this.close();
        this.onSuccess();
    }
}

export default Login;
