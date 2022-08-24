const express = require('express')

const port = process.env.PORT || 5000

const bodyParser = require('body-parser')

const path = require('path')

const adminRouter = require('./routes/admin')

const userRouter = require('./routes/user')

const app = express()

app.set('view engine','ejs')

app.set('views','views')

app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, "public")));

app.use('/admin', adminRouter)

app.use(userRouter)

app.listen(port)