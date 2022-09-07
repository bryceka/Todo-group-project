/** @format */

const express          = require('express')
const app              = express()
const mongoose         = require('mongoose')
const passport         = require('passport')
// const passportGoogle   = require('./config/passport-google')
const session          = require('express-session')
const MongoStore       = require('connect-mongo')(session)
const flash            = require('express-flash')
const logger           = require('morgan')
const connectDB        = require('./config/database')
const mainRoutes       = require('./routes/auth/local-routes')
const todoRoutes       = require('./routes/todos')
const authGoogleRoutes = require('./routes/auth/google-routes')
const authLocalRoutes  = require('./routes/auth/local-routes')

require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport-local')(passport)
require('./config/passport-google')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', mainRoutes)
app.use('/auth-local', authLocalRoutes)
app.use('/auth-google', authGoogleRoutes)
app.use('/todos', todoRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}, you better catch it!`)
})
