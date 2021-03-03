const Sequelize = require('sequelize');

module.exports = class User extends (
  Sequelize.Model
) {
  static init(sequelize) {
    //class의 메소드네..
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, //소셜로그인의 경우 email이 안들어갈수있다
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100), // bcrypt로 해쉬된 값이 꽤 길다.
          allowNull: true,
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'local',
        },
        snsId: {
          //이거 뭐지, 소셜로그인 아이디인가?
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscore: true, // camelCase or snake_case
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }

  static associate(db) {
    //class의 메소드네..
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'followingId',
    }); //'foreignKey': 연관된 다른 테이블에 생성되는 남 칼럼
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'followerId',
    });
  }
};
