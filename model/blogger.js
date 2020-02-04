const fs = require('fs')
const { promisify } = require('util')
const BLOGGER_PATH = __dirname + '/../data/blogger.json'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)


module.exports = {

    getList() {
        const data = JSON.parse(fs.readFileSync(BLOGGER_PATH))
        return data
    },

    getOne(id) {
        id = Number(id)
        const data = JSON.parse(fs.readFileSync(BLOGGER_PATH))
        return data.find(it => it.id === id)
    },

    async add(content) {

        const item = {
            "cover": "",
            "title": "",
            "content": "",
            "comment_num": 0
        }
        const ff = await readFileAsync(BLOGGER_PATH, 'utf8')
        let list = JSON.parse(ff)
        list.push(Object.assign({ id: list.length }, item, content))

        const res = await writeFileAsync(BLOGGER_PATH, JSON.stringify(list))
        if (!res) {
            return {
                code: 0,
                success: 1
            }
        } else {
            console.log('add blogger fail! ' + res)
            return {
                code: 1,
                success: 0,
                errmsg: res
            }
        }
    },

    async delete(id) {
        const ff = await readFileAsync(BLOGGER_PATH, 'utf8')
        let list = JSON.parse(ff)
        id = Number(id)
        const idx = list.findIndex(it => it.id === id)
        if (idx > -1) {
            list.splice(idx, 1)
        } else {
            return {
                code: 0,
                success: 0,
                errmsg: 'notfound'
            }
        }

        const res = await writeFileAsync(BLOGGER_PATH, JSON.stringify(list))
        if (!res) {
            return {
                code: 0,
                success: 1
            }
        } else {
            console.log('delete blogger fail! ' + res)
            return {
                code: 1,
                success: 0,
                errmsg: res
            }
        }
    },

    async update(content) {
        let { id } = content || {}
        const ff = await readFileAsync(BLOGGER_PATH, 'utf8')
        let list = JSON.parse(ff)
        id = Number(id)
        let target = list.filter(it => it.id === id)[0]
        if (!target) {
            return {
                code: 0,
                success: 0,
                errmsg: 'notfound'
            }
        } else {
            target = Object.assign(target, content)
        }

        const res = await writeFileAsync(BLOGGER_PATH, JSON.stringify(list))
        if (!res) {
            return {
                code: 0,
                success: 1
            }
        } else {
            console.log('update blogger fail! ' + res)
            return {
                code: 1,
                success: 0,
                errmsg: res
            }
        }
    },

}
