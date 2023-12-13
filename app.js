require("dotenv").config();

const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { AppDataSource } = require("./src/models/dataSource");
const { routes } = require("./src/router");
const { globalErrorHandler } = require("./src/utils/error");
const passport = require("passport");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// passport.use(
//   'google-signup',
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET_KEY,
//       callbackURL: process.env.GOOGLE_SIGNUP_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       return done(null, user);
//     }
//   )
// );

// passport.use(
//   'google-signin',
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET_KEY,
//       callbackURL: process.env.GOOGLE_SIGNIN_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       return done(null, user);
//     }
//   )
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   done(null, id);
// });

app.use(routes);
app.use(globalErrorHandler);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.get("/", (req, res) => {
  res.send(`
      <h1>Log in</h1>
      <a href="http://127.0.0.1:3000/users/google-signin">Log in</a>
      <a href="http://127.0.0.1:3000/users/google-signup">Sign up</a>
  `);
});
// app.get("/", (req, res) => {
//   res.send(`
  <a href="https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.SIGN_UP_REDIRECT_URI}&response_type=code">
//   <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" />
// </a>
//   `);
// });
CLIENT_ID=a8334dfb964aeab1206bbc4c0b7a20f9
SIGN_UP_REDIRECT_URI = http://localhost:3000/users/kakao-sign-up
https://kauth.kakao.com/oauth/authorize?client_id=${a8334dfb964aeab1206bbc4c0b7a20f9}&redirect_uri=${http://localhost:3000/users/kakao-sign-up}&response_type=code
const startServer = async () => {
  const PORT = process.env.PORT;

  await AppDataSource.initialize();
  
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
