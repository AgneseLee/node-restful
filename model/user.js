const fs = require('fs')
const { promisify } = require('util')
const USER_PATH = __dirname + '/../data/user.json'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

module.exports = {
    async add(content) {
        const item = {
            "sex": "man",
            "pic": "https://cdn.pixabay.com/photo/2020/01/18/15/47/teddy-4775611__340.jpg"
        }
        const ff = await readFileAsync(USER_PATH, 'utf8')
        let list = JSON.parse(ff)
        list.push(Object.assign({ id: list.length + 1 }, item, content))

        const res = await writeFileAsync(USER_PATH, JSON.stringify(list))
        if (!res) {
            return {
                code: 0,
                success: 1
            }
        } else {
            console.log('add user_account fail! ' + res)
            return {
                code: 1,
                success: 0,
                errmsg: res
            }
        }
    },

    async check(info) {
        const ff = await readFileAsync(USER_PATH, 'utf8')
        let accountList = JSON.parse(ff)
        const { name, password } = info || {}
        if (name && password) {
            const filter = accountList.filter(v => v.name === name) || []
            if (!filter[0]) {
                return false
            }
            if (filter[0].password === password) {
                return true
            }
        }
        return false
    },

    async getDetailInfo(name){
        const ff = await readFileAsync(USER_PATH, 'utf8')
        let accountList = JSON.parse(ff)
        return accountList.find(it => it.name === name)
    }
}