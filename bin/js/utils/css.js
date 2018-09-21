/**
 * Load a css file
 *
 * @param url
 * @return {Promise<any>}
 */
export default function (url) {
    return new Promise((resolve, reject) => {
        let link = document.createElement('link');

        link.type = 'text/css';
        link.rel  = 'stylesheet';

        link.onload = function () {
            resolve();
            console.log('style has loaded');
        };

        link.href = url;

        let headScript = document.querySelector('script');
        headScript.parentNode.insertBefore(link, headScript);
    });
};
