//规定数据库模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {type: String},
    password: {
        type: String,
        select: false, //设置不显示密码
        //密码加密
        set(val){
            return require('bcryptjs').hashSync(val,10)
        }
    },
})

module.exports = mongoose.model('AdminUser', schema)