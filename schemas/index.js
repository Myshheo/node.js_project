// import mongoose from 'mongoose';
const mongoose = require('mongoose');

require('dotenv').config();
const apiKey = process.env.API_KEY;
const dbName = process.env.DB_NAME
const dbPassword = process.env.DB_PASSWORD;

const connect = () => {
  // mongoose.connect는 MongoDB 서버에 연결하는 메서드입니다.
  mongoose
    .connect(
      apiKey,
      {
        dbName: dbName,
      },
    )
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

//connect 익명함수를 exports
module.exports = connect;
