module.exports = options =>{
    return async (req,res,next)=>{
        //inflection可以把小写复数转换为大写类名，如categories->Cateegory
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../models/${modelName}`)
        next()
    }
}