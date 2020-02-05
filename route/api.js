const fs = require('fs')
const url = require('url')
const crypto = require('crypto')
const path = require('path')
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const middleWare = require('../middle-ware')
const { promisify } = require('util')

const $db = require('../db');

const bloggerModel = require('../model/blogger')
const commentModel = require('../model/comment')
const userModel = require('../model/user')
const PRIVATE_KEY = 'agblog26';
const COMMENT_PATH = path.resolve(__dirname, '../data/comment.json')


const getHandler = {
    '/': function (req, res) {
        // console.log('ppppppp ', typeof logs)
        fs.readFile(__dirname + '/../views/index.html', (err, data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data.toString())
        })

    },

    '/detail': function (req, res) {
        fs.readFile(__dirname + '/../views/detail.html', (err, data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data.toString())
        })
    },

    '/blogger/get_list': function (req, res) {
        const logs = bloggerModel.getList()
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(logs));
    },

    '/blogger/get_detail': function (req, res) {
        const id = querystring.parse(url.parse(req.url).query).id || 0
        const logs = bloggerModel.getOne(id)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(logs));
    },

    '/comment/get_list': async function (req, res) {
        let id = querystring.parse(url.parse(req.url).query).id || 0
        id = Number(id)
        const list = await $db.getCommentList(id)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(list)
        // let readStream = fs.createReadStream(COMMENT_PATH);
        // let chunks = []
        // let output
        // readStream.on('close', () => {
        //     output = JSON.parse(Buffer.concat(chunks).toString()).filter(item => item.blogger_id === id)
        //     res.end(JSON.stringify(output))
        // });
        // readStream.on('data', chunk => {
        //     chunks.push(chunk);
        // });

        // readStream.on('error', (err) => {
        //     console.trace();
        //     console.error('Stack:', err.stack);
        //     console.error('The error raised was: static file fail! ', err);
        // });


    },

    '/404': function (req, res) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    },
}

const postHandler = {
    '/blogger/add': async function (data, req, res) {
        const info = await bloggerModel.add(JSON.parse(JSON.stringify(data)))
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(info));
    },
    '/blogger/delete': async function (data, req, res) {
        const id = JSON.parse(data).id || -1
        const info = await bloggerModel.delete(id)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(info));
    },
    '/blogger/update': async function (data, req, res) {
        const info = await bloggerModel.update(JSON.parse(data))
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(info));
    },
    '/user/register': async function (data, req, res) {
        const { password } = JSON.parse(data) || {}
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(password).digest("hex");
        const info = await userModel.add(Object.assign({}, JSON.parse(data), { password: newPas }))
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(info));
    },
    '/user/login': async function (data, req, res) {
        const { password, name } = JSON.parse(data) || {}
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(password).digest("hex");
        const userInfo = {
            name: name
        }
        const isPass = await userModel.check(Object.assign({}, JSON.parse(data), { password: newPas }))
        // console.log('*** ', isPass)
        let token;
        let info = {
            code: -2,
            success: 0
        };

        if (isPass) {
            token = jwt.sign(userInfo, PRIVATE_KEY, { expiresIn: '1h' });
            info = {
                access_token: token,
                code: 0,
                success: 1
            }
        }
        // res.setHeader("Access-Control-Allow-Credentials", true);
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(info));
    },
    '/comment/add': async function (data, req, res) {
        const info = await commentModel.add(JSON.parse(data))
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(info));
    },

}


const api = {
    get(req, res) {
        const pathname = url.parse(req.url).pathname
        // console.log('***** pathname: ', pathname)
        console.log('----- get request: ', req.url)
        if (getHandler.hasOwnProperty(pathname)) {
            getHandler[pathname](req, res)
        } else {
            getHandler['/404'](req, res)
        }
    },
    post(req, res) {
        const pathname = url.parse(req.url).pathname
        // console.log('***** pathname: ', pathname)
        console.log('----- post request: ', req.url)


        if (postHandler.hasOwnProperty(pathname)) {
            let postData = ''
            req.on('data', data => {
                postData += data
            })
            req.on('end', async () => {
                if (pathname.indexOf('login') === -1) {
                    const info = await middleWare(req, res)

                    if (info.code === 0 && info.success === 1) {
                        postHandler[pathname](postData, req, res)
                    } else {
                        console.log('请求失败' + info.toString())
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
                        res.end(JSON.stringify(info));
                    }
                } else {
                    postHandler[pathname](postData, req, res)
                }
            })
            req.on('error', (e) => {
                console.error(`请求遇到问题: ${e.message}`);
            });
        } else {
            getHandler['/404'](req, res)

        }
    }
}

module.exports = api;