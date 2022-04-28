//规定数据库模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' //关联Category模型
    }
})

// 定义虚拟字段
schema.virtual('children', {
    localField: '_id', // 内键
    foreignField: 'parent', // 外键，关联模型的parent字段
    justOne: false, // 查询一条还是多条数据
    ref: 'Category' // 关联的模型
})

schema.virtual('newsList', {
    localField: '_id',
    foreignField: 'categories',
    justOne: false,
    ref: 'Article'
})

module.exports = mongoose.model('Category', schema)