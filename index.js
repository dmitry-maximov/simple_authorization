require('dotenv').config;
const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server started on ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

start();
