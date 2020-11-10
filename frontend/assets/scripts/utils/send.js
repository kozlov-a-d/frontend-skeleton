export function sendRequest(url, data) {
    console.log('sendRequest', data);
    let self = this;
    const params = JSON.stringify(data);
    console.log(params);

    sendPost(url, params).then(
        function (json) {
            const res = JSON.parse(json);
            console.log(res);
            const status = res.success;
            status ? self.renderSuccess() : self.renderFail();
        },
        function (error) {
            console.log(error);
            self.renderFail();
        }
    );
}

/**
 * Send POST requestues
 * @param {*} url
 * @param {*} requestuestBody
 */
export function sendPost(url, requestuestBody) {
    return new Promise(function (succeed, fail) {
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.addEventListener('load', function () {
            if (request.status < 400) {
                succeed(request.responseText);
            } else {
                fail(new Error('Request failed: ' + request.statusText));
            }
        });
        request.addEventListener('error', function () {
            fail(new Error('Network error'));
        });
        request.send(requestuestBody);
    });
}
