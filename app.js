const http = require('http');
const api = require('./route/api')
const static = require('./route/static');
const url = require('url')

const hostname = 'blogserver';
const port = 3316;

const staticRegExp = /\/public\/(css|img|js|mp3)\/[\w]+\.(jpg|jpeg|gif|png|mp3|js|css)/

const server = http.createServer((req, res) => {
    const reqType = req.method
    const pathName = url.parse(req.url).pathname

    if (reqType === 'GET') {
        if (staticRegExp.test(pathName)) {
            static.get(req, res)
        } else {
            api.get(req, res)
        }
    } else if (reqType === 'POST') {
        api.post(req, res)
    }

});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
