const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          console.log('exUser', exUser);
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              // console.log('result', result);
              //done은 passport.authenticate()의 callback이다.
              done(null, exUser); //done이 호출되면 auth.js의 나머지 부분 실행
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다' });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다' });
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      },
    ),
  );
};
