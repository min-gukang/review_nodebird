const app = require('./index');

app.listen(app.get('port'), () => {
    console.log(`listening at ${app.get('port')}`);
  });