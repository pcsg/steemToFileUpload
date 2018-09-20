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

export {
    bin2hex,
    hex2bin
};