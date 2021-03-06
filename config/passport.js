const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// -----------------------------------------------------------------------------------

// setup passport strategy
// passport.use(new LocalStrategy(option, function))
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    // 如果在第一組參數裡設定了 passReqToCallback: true，就可以 callback 的第一個參數裡拿到 req，這麼一來我們就可以呼叫 req.flash() 把想要客製化的訊息放進去
    passReqToCallback: true
  },
  // authenticate user
  // cb: callback
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// -----------------------------------------------------------------------------------

// 當資料很大包、會頻繁使用資料，但用到的欄位又很少時，就會考慮使用序列化的技巧來節省空間

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON() // 此處與影片示範不同
    return cb(null, user)
  })
})

// -----------------------------------------------------------------------------------

module.exports = passport