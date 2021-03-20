const { Pool } = require("pg");
var Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const app = new Koa();
const bodyParser = require("koa-bodyparser");

var router = new Router();
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const pool = new Pool({
  user: "postgres",
  host: "hasura-test-rds.cqrnqcmido7u.ap-south-1.rds.amazonaws.com",
  database: "postgres",
  password: "admin123",
  port: 5432,
});

router.get("/", (ctx, next) => {
  ctx.body = "End point";
});

router.get("/all-albums", async (ctx) => {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * from public."Album"`);
    ctx.body = res.rows;
  } catch (err) {
    console.log(err);
    ctx.body = "Something went wrong";
  } finally {
    client.release();
  }
});
router.post("/add-album", async (ctx) => {
  console.log(ctx.request.body);
  const client = await pool.connect();
  const reqJson = ctx.request.body;
  try {
    await client.query(`INSERT INTO public."Album"("Title") Values($1)`, [
      reqJson.title,
    ]);
    ctx.body = "Success";
  } catch (err) {
    console.log(err);
    ctx.body = "Something went wrong";
  } finally {
    client.release();
  }
});
let port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
//module.exports = router;
