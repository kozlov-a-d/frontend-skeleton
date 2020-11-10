/**
 * @function {loadScript}
 * @param {string} src
 * @returns {Promise} Promise(script object)
 */
const loadScript = (src) => {
    const scripts = [...document.scripts].filter(script => script.src === src);
    return new Promise((resolve, reject) => {
        if (scripts.length) {
            let script = scripts[scripts.length - 1];

            if(script.dataset.load === 'loaded') { // Проверяем загружен ли скрипт, если нет, то ждем загрузки
                resolve(script);
            } else if(script.dataset.load === 'error') {
                reject(script);
            } else {
                script.addEventListener('error', ()=>{
                    script.dataset.load = 'error';
                    reject(script);
                });
                script.addEventListener('load', ()=>{
                    script.dataset.load = 'loaded';
                    resolve(script);
                });
            }

        } else {
            let script = document.createElement('script');
            script.src = src;
            script.addEventListener('error', ()=>{
                script.dataset.load = 'error';
                reject(script);
            });
            script.addEventListener('load', ()=>{
                script.dataset.load = 'loaded'; // Помечаем, что скрипт уже загружен
                resolve(script);
            });
            document.body.appendChild(script);
        }
    });
};

/**
 * @function {loadStyle}
 * @param {string} src
 * @returns {Promise} Promise(stylesheet object)
 */
const loadStyle = (src) => {
    const styles = [...document.styleSheets].filter(style => style.href === src);
    return new Promise((resolve, reject) => {
        if (styles.length) {
            resolve(styles);
        } else {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = src;
            style.onerror = () => {
                reject(style);
            };
            style.onload = () => {
                resolve(style);
            };
            document.head.appendChild(style);
        }
    });
};

export { loadScript, loadStyle };
