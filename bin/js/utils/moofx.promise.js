"use strict";

/**
 * Animation with moofx - helper method
 * - easier call
 *
 * @param Node
 * @param css
 * @param options
 *
 * @return {Promise}
 */
function mooPFX(Node, css, options) {
    return new Promise(function (resolve) {
        options = options || {
            duration: 300
        };

        options.callback = resolve;

        moofx(Node).animate(css, options);
    });
}
