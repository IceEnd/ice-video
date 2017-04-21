import 'babel-polyfill';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import mongo from 'koa-mongo';
import cors from 'koa-cors';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(mongo({
  host: '127.0.0.1',
  port: '27017',
  db: 'cno',
  user: 'Cononico',
  pass: '123456',
  max: 100,
  min: 1,
  timeout: 30000,
  log: false,
}));

router.post('/danmuku', async (ctx) => {
  let danmu = {};
  const result = {
    retCode: 0,
    retMsg: '',
    retData: {},
  };
  ctx.body = result;
  try {
    danmu = await ctx.mongo.db('cno').collection('danmuku').find().toArray();
    result.retData = {
      danmuku: danmu,
    };
  } catch (ex) {
    result.retCode = -1;
    result.retMsg = '服务器忙';
    console.warn(ex);
  }
  ctx.body = result;
});

router.post('/senddanmu', async (ctx) => {
  const danmu = this.request.body;
  const result = {
    retCode: 0,
    retMsg: '',
    retData: {},
  };
  try {
    await ctx.mongo.db('cno').collection('danmuku').insert({ ...danmu });
  } catch (ex) {
    result.retCode = -1;
    result.retMsg = '服务器忙';
    console.warn(ex);
  }
  ctx.body = result;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3001, () => {
  console.warn('Server is running on port 3001');
});
