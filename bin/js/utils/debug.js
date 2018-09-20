function debugNode(text) {
    let Debug = document.createElement('div');

    Debug.innerHTML = text;
    Debug.style.padding = '10px';
    Debug.style.margin = '10px 0 0 0';
    Debug.style.float = 'left';
    Debug.style.width = '400px';
    Debug.style['word-wrap'] = 'break-word';

    document.body.appendChild(Debug);
}

export {debugNode};