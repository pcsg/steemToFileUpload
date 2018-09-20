/**
 *
 * @param func
 * @param delay
 * @returns {Promise<any>}
 */
export default function (func, delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            func().then(resolve);
        }, delay)
    });
};
