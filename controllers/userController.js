const bcrypt = require('bcryptjs')
const db = require('../models')
const { getUsers } = require('./adminController')
const User = db.User

// -----------------------------------------------------------------------------------

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    console.log(req.body.name + req.body.name)
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  // -----------------------------------------------------------------------------------

  getUser: (req, res) => {
    return User.findByPk(req.user.id)
      .then((user) => {
        return res.render('profile', {
          user: user.toJSON()
        })
      })
  },

  editUser: (req, res) => {
    return User.findByPk(req.user.id)
      .then((user) => {
        return res.render('profileEdit', {
          user: user.toJSON()
        })
      })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then(() => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/users/profile')
              })
          })
      })
    }
    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          })
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/users/profile')
            })
        })
    }
  },

  // -----------------------------------------------------------------------------------

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  // -----------------------------------------------------------------------------------

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    // 而 logout 動作也只需要使用 Passport 提供的 req.logout() 就可以了
    req.logout()
    res.redirect('/signin')
  }
}

// -----------------------------------------------------------------------------------

module.exports = userController