const MONGOURL = 'mongodb://localhost:27017/newsdb';
const DEV_SECRET = 'dev-secret';
const RATELIMWIN = 15 * 60 * 1000;
const RATELIMMAX = 50;

module.exports = {
  MONGOURL,
  DEV_SECRET,
  RATELIMWIN,
  RATELIMMAX,
};
