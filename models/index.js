const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {}; // 새로운 db객체를 만들어서
const sequelize = new Sequelize( //sequelize 인스턴스를 생성하고
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize; // db객체에 속성과 함께 집어넣는다.
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

//class에서 생성한 메소드 사용
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;
