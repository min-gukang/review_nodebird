const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //session에 user id 저장 , done하는 순간 req.login 콜백함수 실행!
  });

  //로그인 이후 사용자권한으로 api요청보낼때 실행되는 부분
  //브라우저가 session-cookie로 {id: 3, session-id: 'asdfsdfadsf'} 보냄
  passport.deserializeUser((id, done) => {
    console.log('id :', id);
    User.findOne({
      where: { id },
        include: [
          {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followers',
          },
          {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followings',
          },
        ],
    })
      //req.user, req.isAuthenticated()가 들어있음. 로그인 되어 있으면 isAuthenticated는 true로 설정됨. 그 다음 router로 진행됨.
      //이제 그 라우터에서는 req.user에 사용자 정보가 들어있음.
      .then((user) => done(null, user)) //여기서 user를 복구해준다. req.user로 접근가능, req.isAuthenticated()
      .catch((err) => done(err));
  });
  local();
};
