const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
  host: config.host,
  dialect: config.dialect
}
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Session = require('./session')(sequelize, Sequelize);
db.PostImage = require('./postImage')(sequelize, Sequelize);

db.User.hasMany(db.Post)
db.User.hasOne(db.Session)
db.Post.hasMany(db.PostImage)
// db.Post.belongsToMany(db.Hashtag, { through: 'post_hashtag' })
// db.Hashtag.belongsToMany(db.Post, { through: 'post_hashtag' })

module.exports = db;