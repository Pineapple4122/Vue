//规定数据库模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {type: String},
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' //关联Category模型
    }
})

module.exports = mongoose.model('Category', schema)