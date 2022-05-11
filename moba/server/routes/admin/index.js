module.exports = app => {
    const express = require('express')
    const AdminUser = require('../../models/AdminUser')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    require('express-async-errors')
    const router = express.Router({
        mergeParams: true //合并参数，不然后面的路由使用不了前面的参数
    })

    //后端增加数据的接口
    router.post('/',async (req,res)=>{
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    //后端根据ID修改数据的接口
    router.put('/:id',async (req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
    //后端根据ID删除数据的接口
    router.delete('/:id',async (req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
    })
    //获取数据的接口
    router.get('/', async (req,res)=>{
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        //populate联表查询，与Category里面的ref呼应
        //操作之后返回items的parent属性里面就有Category的name和_id
        const items = await req.Model.find().setOptions(queryOptions).limit(100)
        res.send(items)
    })
    //根据ID获取数据的接口
    router.get('/:id',async (req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    const authMiddleware = require('../../middleware/auth')
    const resourceMiddleware = require('../../middleware/resource')
    //这样写可以实现通用的动态资源请求接口
    //使用了中间件，其实就是一个路径对应多个处理，然后链式按顺序处理
    app.use('/admin/api/rest/:resource',resourceMiddleware(),router)
    // app.use('/admin/api/rest/:resource',authMiddleware(),resourceMiddleware(),router)
    
// -------------------------------
    //使用插件处理上传的图片
    //中间件处理之后会将图片数据挂载在req上,如下面的req.file
    const multer = require('multer')
    const upload = multer({dest:__dirname+'/../../uploads'})
    app.post('/admin/api/upload',authMiddleware(),upload.single('file'),(req,res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
// -------------------------------
    app.post('/admin/api/login',async (req,res)=>{
        const {username,password} = req.body
        // 1.根据用户名找用户
        const user = await AdminUser.findOne({username}).select('+password')
        //user不存在时抛出异常
        assert(user,422,'用户不存在')
        // 2.校验密码
        const isValid = require('bcryptjs').compareSync(password,user.password)
        assert(isValid,422,'密码错误')
        // 3.返回token
        const token = jwt.sign({id:user._id},app.get('secret'))
        res.send(token)
    })

    //统一的异常错误处理，用于捕获http-assert抛出的异常
    app.use(async (err,req,res,next)=>{
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}   