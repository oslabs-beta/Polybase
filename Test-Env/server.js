const express = require('express');
mongoose = require('mongoose');
const User = require('./mongooseConfig');

const app = express();
const port = 3000;

app.use(express.json());

