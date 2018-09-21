'use strict';

// Support
// ===============================================================

if (window.File && window.FileReader && window.FileList && window.Blob) {

}

// MAIN STEEM CONFIG
// ===============================================================

// live
window.STEEM_USER = '';
window.STEEM_PASS = '';

// testnet
// window.STEEM_USER = 'foo-test';
// window.STEEM_PASS = 'foo-bar-4321';

window.Client = new dsteem.Client('https://testnet.steem.vc', {
    addressPrefix: 'STX',
    chainId      : '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
});

// Load file list
// ===============================================================

import SteemFileList from './controls/fileList/SteemFileList';

let FileListNode = document.querySelector('.files');

window.List = new SteemFileList();
window.List.inject(FileListNode);

// file upload
// ===============================================================

import Upload from "./controls/Upload";

document.querySelector('.upload').addEventListener('click', function () {
    new Upload().open();
});
