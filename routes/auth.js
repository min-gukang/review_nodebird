const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');

const router = express.Router();

router.post('/join', isNotLoggedIn,  async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      //이미 있는 회원인지 확인한다.
      return res.redirect('/join?error=exist'); //이미 있으면 회원가입 페이지로 리다이렉트
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return next(err);
  }
});
//미들웨어 확장
router.post('/login', isNotLoggedIn,  (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    // local까지 실행되고, localStrategy로 간다
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    console.log('user: ', user);
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    //req.login하는 순간, serializeUser로 가서 session에 아이디저장
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log('user:', user.dataValues);
      //여기서 session-cookie를 브라우저로 보내준다.
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
