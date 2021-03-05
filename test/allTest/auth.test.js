const request = require('supertest');
const { sequelize } = require('../../models');
const app = require('../../index');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /join', () => {
  test('로그인 안 했으면 가입', (done) => {
    request(app)
      .post('/auth/join')
      .send({
        email: 'zerohch0@gmail.com',
        nick: 'zerocho',
        password: 'nodejsbook',
      })
      .expect('Location', '/') // 로그인 router가 보면 res.redirect('/');
      .expect(302, done);  //done은 로직을 끝내기 위해 사용, 만약 await을 썼다면 안적어도 된다. 알아서 끝내니까
  });
});

//agent의 좋은점은 여러 테스트에 걸쳐서 그 상태가 유지된다
//한번 로그인한 상태를 유지해서 그 상태로 여러가지 테스트가 가능하다.
//beforeEach는 각 테스트 전마다 실행시키는 것!
describe('POST /login', () => {
  const agent = request.agent(app);
  //로그인 시킨 후, 이 상태유지! but 현재 describe안에서만 실행
  beforeEach((done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
      })
      .end(done);
  });

  test('이미 로그인했으면 redirect /', (done) => {
    const message = encodeURIComponent('로그인한 상태입니다.');
    agent
      .post('/auth/join')
      .send({
        email: 'zerohch0@gmail.com',
        nick: 'zerocho',
        password: 'nodejsbook',
      })
      .expect('Location', `/?error=${message}`)
      .expect(302, done);
  });
});

describe('POST /login', () => {
  test('가입되지 않은 회원', async (done) => {
    const message = encodeURIComponent('가입되지 않은 회원입니다.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'zerohch1@gmail.com',
        password: 'nodejsbook',
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });

  test('로그인 수행', async (done) => { //위에서 agent로 유지시켰는데 왜 한번더 쓰는가? agent의 describe와 다른 describe임 
    request(app)
      .post('/auth/login')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
      })
      .expect('Location', '/')
      .expect(302, done);
  });

  test('비밀번호 틀림', async (done) => {
    const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'wrong',
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });
}); //describe

describe('GET /logout', () => {
  test('로그인 되어있지 않으면 403', async (done) => {
    request(app)
      .get('/auth/logout')
      .expect(403, done);
  });
  
afterAll(async () => {
  await sequelize.sync({ force: true });
});

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
      })
      .end(done);
  });

  test('로그아웃 수행', async (done) => {
    const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
    agent
      .get('/auth/logout')
      .expect('Location', `/`)
      .expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
