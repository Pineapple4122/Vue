//规定数据库模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String },
    avatar: { type: String },
    banner: { type: String },
    delay: { type: String },
    cost: { type: String },
    title: { type: String },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    scores: {
        difficult: { type: Number },
        skills: { type: Number },
        attack: { type: Number },
        survive: { type: Number },
    },
    skills: [{
        icon: { type: String },
        name: { type: String },
        description: { type: String },
        tips: { type: String },
    }],
    //顺逆风出装
    items1: [{type:mongoose.Schema.Types.ObjectId,ref:'Item'}],
    items2: [{type:mongoose.Schema.Types.ObjectId,ref:'Item'}],
    usageTips: {type: String},
    battleTips: {type: String},
    teamTips: {type: String},
    partners: [{
        hero: {type:mongoose.Schema.Types.ObjectId,ref:'Hero'},
        discription: {type: String}
    }]
})

module.exports = mongoose.model('Hero', schema, 'heroes')