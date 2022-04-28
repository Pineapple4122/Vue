module.exports = app => {
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://127.0.0.1:27017/moba',{
        useNewUrlParser: true
    })

    // 引用models里面定义的所有模块
    require('require-all')(__dirname+'/../models')
}