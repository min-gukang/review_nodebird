const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const Post = require('../models/post');
const Hashtag = require('../models/hashtag');

const router = express.Router();

try {
  fs.readdirSync('uploads'); //폴더가 없으면 에러가 뜨니까 catch로 간다
} catch (error) {
  console.error('uploads 폴더가 없어서 폴더 생성합니다.');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      console.log('multer :', ext, path.basename(file.originalname, ext));
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  console.log('req.user: ', req.user.dataValues);
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    console.log('post: ', post);
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        }),
      );
      console.log('result: ', result); // [[Hashtag{}, true], [Hashtag{}, true]] ...  // 두번째 요소는 findOrCreate에서 table이 존재하는지 여부를 나타낸값이다.
      await post.addHashtags(result.map((r) => r[0])); //db에 create한 걸 변수에 담아서 // 배열로 넣으면 여러개 넣을 수 있다.
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
