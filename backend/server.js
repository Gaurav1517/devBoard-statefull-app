const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const redis = require("redis");
const morgan = require("morgan");

const env = require("./config/env");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const deploymentRoutes = require("./routes/deployments");

const app = express();

/* ---------------- LOGGING ---------------- */

app.use(morgan("dev"));

/* ---------------- REDIS ---------------- */

const redisClient = redis.createClient({
  url: `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`,
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

(async () => {
  await redisClient.connect();
})();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "devboard:"
});

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://172.21.192.1:3000"
];

app.use(cors({
  origin: "http://172.21.192.1:3000",
  credentials: true
}));
/* ---------------- BODY PARSER ---------------- */

app.use(express.json());

/* ---------------- SESSION ---------------- */

app.use(session({
  name: "devboard.sid",
  store: redisStore,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: false,      // true only if HTTPS
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24
  }
}));

/* ---------------- ROUTES ---------------- */

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/deployments", deploymentRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/health", (req,res)=>{
  res.json({status:"ok"});
});

/* ---------------- SERVER ---------------- */

app.listen(env.APP_PORT, () => {
  console.log(`🚀 Server running on port ${env.APP_PORT}`);
});