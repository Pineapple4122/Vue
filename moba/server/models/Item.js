//规定数据库模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {type: String},
    icon: {type: String}
})

module.exports = mongoose.model('Item',schema)