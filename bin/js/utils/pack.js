/**
 * Implement hex2bin and bin2hex in JavaScript
 * https://gist.github.com/jasperck
 *
 * Copyright 2017, JasperChang <jasperc8@gmail.com>
 * Licensed under The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

const hex2bin = str => str.match(/.{1,2}/g).reduce((str, hex) => str += String.fromCharCode(parseInt(hex, 16)), '');

const bin2hex = str => str.split('').reduce((str, glyph) => str += glyph.charCodeAt().toString(16).length < 2 ? `0${glyph.charCodeAt().toString(16)}`
    : glyph.charCodeAt().toString(16), '');


const binaryBuffer = function (bin) {
    let length = bin.length;
    let buf = new ArrayBuffer(length);
    let arr = new Uint8Array(buf);

    for (let i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }

    return buf;
};

/**
 *
 * @param u8Array
 * @returns {string}
 */
function convertUint8ArrayToBinaryString(u8Array) {
    let i, len = u8Array.length, b_str = "";

    for (i = 0; i < len; i++) {
        b_str += String.fromCharCode(u8Array[i]);
    }

    return b_str;
}

export {
    bin2hex,
    hex2bin,
    binaryBuffer,
    convertUint8ArrayToBinaryString
};