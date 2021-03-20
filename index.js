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
  host: "localhost",
  database: "Hasura-db",
  password: "admin@123",
  port: 5433,
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
app.listen(3004, () => {
  console.log("Server listening on 3004");
});
