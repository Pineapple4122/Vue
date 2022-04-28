//规定数据库模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {type: String},
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' //关联Category模型
    },
    body: {type: String}
},{
    timestamps: true // 时间戳，自动生成两个时间createAt和updateAt
})

module.exports = mongoose.model('Article', schema)