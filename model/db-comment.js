module.exports = {
    async getCommentList(bloggerId) {
        // console.log(this)
        return this.query('select * from comment where blogger_id=?', [bloggerId])
            .then((res, err) => {
                // console.log(res, err)
                return (JSON.stringify(res));
            }).catch(e => {
                console.log('SQL error!!! :' + e)
                return {
                    code: -56,
                    result: 0,
                    errmsg: 'SQL error'
                }
            })
    },


    // async add(content) {
    //     const item = {
    //         "blogger_id": -1,
    //         "user_id": -1,
    //         "content": ""
    //     }
    //     const ff = await readFileAsync(COMMENT_PATH, 'utf8')
    //     let list = JSON.parse(ff)
    //     list.push(Object.assign({ id: list.length }, item, content))

    //     const res = await writeFileAsync(COMMENT_PATH, JSON.stringify(list))
    //     if (!res) {
    //         return {
    //             code: 0,
    //             success: 1
    //         }
    //     } else {
    //         console.log('add comment fail! ' + res)
    //         return {
    //             code: 1,
    //             success: 0,
    //             errmsg: res
    //         }
    //     }
    // },

    // async delete(id) {
    //     const ff = await readFileAsync(COMMENT_PATH, 'utf8')
    //     let list = JSON.parse(ff)
    //     id = Number(id)
    //     const idx = list.findIndex(it => it.id === id)
    //     if (idx > -1) {
    //         list.splice(idx, 1)
    //     } else {
    //         return {
    //             code: 0,
    //             success: 0,
    //             errmsg: 'notfound'
    //         }
    //     }

    //     const res = await writeFileAsync(COMMENT_PATH, JSON.stringify(list))
    //     if (!res) {
    //         return {
    //             code: 0,
    //             success: 1
    //         }
    //     } else {
    //         console.log('delete blogger fail! ' + res)
    //         return {
    //             code: 1,
    //             success: 0,
    //             errmsg: res
    //         }
    //     }
    // }

}



