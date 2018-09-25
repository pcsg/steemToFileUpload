'use strict';

// Support
// ===============================================================

if (window.File && window.FileReader && window.FileList && window.Blob) {

}

// MAIN STEEM CONFIG
// ===============================================================

import * as conf from './conf';

// live
window.STEEM_USER = '';
window.STEEM_PASS = '';

// testnet
if (conf.DEV) {
    window.STEEM_PRFX = 'STX';

    window.Client = new dsteem.Client('https://testnet.steem.vc', {
        addressPrefix: window.STEEM_PRFX,
        chainId      : '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
    });
} else {
    window.STEEM_PRFX = false;
    window.Client     = new dsteem.Client('https://api.steemit.com');
}

// Load file list
// ===============================================================

import SteemFileList from './controls/fileList/SteemFileList';

let FileListNode = document.querySelector('.files');

window.List = new SteemFileList();
window.List.inject(FileListNode);

// file upload
// ===============================================================

import Upload from "./controls/Upload";

new Upload().inject(document.querySelector('.upload'));
