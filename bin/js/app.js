'use strict';

// Support
// ===============================================================

if (window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob &&
    typeof btoa !== 'function' &&
    typeof atob !== 'function'
) {

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

// file download
// ===============================================================

// @todo move to own class

import SteemFiles from "./classes/SteemFiles";

const Download       = document.querySelector('[name="download"]');
const DownloadForm   = document.querySelector('form.download-file');
const DownloadButton = document.querySelector('[name="start-download"]');

const downloadFile = function () {
    let file = Download.value.trim();

    if (file === '') {
        return;
    }

    file = file.replace('steemfile://', '');
    file = file.split('-');

    SteemFiles.download(file[0], file[1]).then(function (fileData) {
        download(fileData.blob, fileData.name);
    });
};

DownloadForm.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    downloadFile();

    return false;
});

Download.addEventListener('keyup', function (event) {
    if (event.which === 13) { // enter
        return;
    }

    let value = Download.value;

    DownloadButton.disabled = true;

    if (value.indexOf('-') !== -1) {
        DownloadButton.disabled = false;
    }
});
