"use strict";

import * as conf from '../conf';

/**
 * Shows a html debug node
 *
 * @param text
 */
function debugNode(text) {
    let Debug = document.createElement('div');

    Debug.innerHTML          = text;
    Debug.style.padding      = '10px';
    Debug.style.margin       = '10px 0 0 0';
    Debug.style.float        = 'left';
    Debug.style.width        = '400px';
    Debug.style['word-wrap'] = 'break-word';

    document.body.appendChild(Debug);
}

/**
 * prints debug message
 * - if dev is -> true
 *
 * @param {String|Number} message
 * @param {String} [type] - type of the message, default => log
 */
function debugMessage(message, type) {
    if (conf.DEV === false && conf.DEBUG === false) {
        return;
    }

    type = type || 'log';

    switch (type) {
        case 'error':
            console.error(message);
            break;

        case 'info':
            console.info(message);
            break;

        case 'warn':
            console.warn(message);
            break;

        default:
            console.log(message);
    }
}

export {
    debugNode,
    debugMessage
};