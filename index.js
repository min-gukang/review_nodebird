const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
// const passport = require('passport');

dotenv.config();
const { sequelize } = require('./models');

const app = express();

app.set('port', 5000);
app.set('view engine', 'html'); // 확장자가 nunjucks일때 nunjucks를 적어도 됨. 지금은 템플릿 파일이 html
nunjucks.configure('views', {
    express: app,
    watch: true, //이건 템플릿이 수정됬을때 자동으로 리로드되게 하는 옵션, 이걸쓰려면 초키달?이라는 디펜덴시 설치
})

//DB sync!! 
sequelize.sync({ force: false })
    .then(() => {
        console.log('DB Connected!');
    })
    .catch((error) => {
        console.error(error);
    })
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads'))); //static미들웨어는 next()가 없어서 다음 미들웨어로 안 넘어감
app.use(express.json()); // 예전 body-parser를 대체함. json으로 파싱한다. 
app.use(express.urlencoded({ extended: true })); // urlenocoded는 form형태를 파싱, true권장
app.use(cookieParser(process.env.COOKIE_SECRET)); //signed된 쿠키로 만들기 위해..? req.signedCookies로 접근할 수 있다. 
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET, //보통 cookieParser의 secret과 같이쓴다. 성격이 비슷하고 secret들을 최대한 안만들기위해??
    cookie: {
        httpOnly: true,
        secure: false
    }
}))

//에러처리 핸들러 
app.use((req, res, next) => {
    //에러생성
    const error = new Error(`${req.method} ${req.url} 라우터가 존재하지 않습니다`);
    error.status = 404;
    next(error); //에러처리 핸들러로 보냄. 
})

app.use((err, req, res, next) => { // err인자는 위 핸들러의 error핸들러다. 
    res.locals.message = err.message; // 템플릿 렌더와 변수를 따로 보내는 방법. 이렇게 locals의 속성으로 변수로 지정하면 아래 render메소드와 함께 템플릿으로 렌더된다.
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status ||500);
    res.render('error');
})