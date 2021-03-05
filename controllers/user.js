const User = require('../models/user');

exports.addFollowing = async (req, res, next) => {
    try {
      //유저가 있는지 확인한다.
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
      } else {
        res.status(404).send('no user');
      }
    } catch (err) {
        console.error(err);
        return next(err);
    }
  }