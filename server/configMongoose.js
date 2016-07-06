import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const conf = {
  hostname: process.env.MONGO_HOSTNAME || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  env: process.env.MONGO_ENV || 'local',
};

let dbUser
if(process.env.MONGO_USER && process.env.MONGO_PASS) {
  dbUser = {user: process.env.MONGO_USER, pass: process.env.MONGO_PASS}
} else {
  dbUser = undefined; // on local dev not required
}

mongoose.connect(`mongodb://${conf.hostname}:${conf.port}/${conf.env}`, dbUser);

var defaultDraftJSobject = {
    "blocks" : [],
    "entityMap" : {}
}

var articleSchema = new Schema({
    articleTitle: { type: String, required: true, default: 'default article title' },
    articleSubTitle: { type: String, required: true, default: '' },
    articleContent: { type: String, required: true, default: '' },
    articleContentJSON: { type: Object, required: true, default: defaultDraftJSobject },
    articlePicUrl: { type: String, required: true, default: '/static/placeholder.png' }
  }, 
  { 
    minimize: false 
  }
);

var Article = mongoose.model('Article', articleSchema, 'articles');

var userSchema = {
  "username" : { type: String, index: {unique: true, dropDups: true }},
  "password" : String,
  "firstName" : String,
  "lastName" : String,
  "email" : { type: String, index: { unique: true, dropDups: true }},
  "role" : { type: String, default: 'editor' },
  "verified" : Boolean,
  "imageUrl" : String
}

var User = mongoose.model('User', userSchema, 'pubUsers');


export default {
  Article,
  User
}