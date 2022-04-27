const express = require('express')

const app = express()

app.use(require('cors')())
app.use(express.json())

//托管静态资a源
app.use('/uploads',express.static(__dirname+'/uploads'))

//给app添加一个属性用于token
app.set('secret','qwer')

require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(3000,()=>{
    console.log('http://localhost:3000')
})