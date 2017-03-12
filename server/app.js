import 'babel-polyfill';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import mongo from 'koa-mongo';
import convert from 'koa-convert';
import cors from 'koa-cors';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

app.use(convert(logger()));
app.use(convert(cors()));
app.use(convert(bodyParser()));

app.use(convert(mongo({
  host: '127.0.0.1',
  port: '27017',
  db: 'cno',
  user: 'Cononico',
  pass: '123456',
  max: 100,
  min: 1,
  timeout: 30000,
  log: false,
})));

router.post('/danmuku', function* () {
  let danmu = {};
  const result = {
    retCode: 0,
    retMsg: '',
    retData: {},
  };
  try {
    danmu = yield this.mongo.db('cno').collection('danmuku').find().toArray();
    result.retData = {
      danmuku: danmu,
    };
  } catch (ex) {
    result.retCode = -1;
    result.retMsg = '服务器忙';
    console.warn(ex);
  }
  this.response.body = result;
});

router.post('/senddanmu', function* () {
  const danmu = this.request.body.danmu;
  const result = {
    retCode: 0,
    retMsg: '',
    retData: {},
  };
  try {
    yield this.mongo.db('cno').collection('danmuku').insert({ ...danmu });
  } catch (ex) {
    result.retCode = -1;
    result.retMsg = '服务器忙';
    console.warn(ex);
  }
  this.response.body = result;
});

app.use(convert(router.routes())).use(convert(router.allowedMethods()));

app.listen(3001, () => {
  console.warn('Server is running on port 3001');
});
