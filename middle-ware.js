var UserModel = require('./model/user');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'agblog26';

module.exports = function (req, res) {
    return new Promise(function (resolve, reject) {
        try {
            let token = req.headers['authorization'];
            if (!token) {
                resolve({ code: -6, success: 0, errmsg: '缺少token' })
                return;
            }
            jwt.verify(token, PRIVATE_KEY, async function (err, decoded) {
                // console.log('*** ', decoded)
                if (!err) {
                    if (decoded.exp <= new Date() / 1000) {
                        resolve({ code: -3, success: 0, errmsg: 'token过期' })
                    } else {
                        const targetInfo = await UserModel.getDetailInfo(decoded.name)
                        if (targetInfo) {
                            resolve(Object.assign({}, { code: 0, success: 1, errmsg: '' }, { result: targetInfo }))
                        } else {
                            resolve({ code: -5, success: 0, errmsg: '找不到该用户' })
                        }
                    }
                } else {
                    console.log(err)
                    throw new Error(err)
                }
            })
        } catch (e) {
            reject({ code: -4, success: 0, errmsg: e })
        }
    })
}

