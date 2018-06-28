const express = require('express');
const router = express.Router();
const {readdirSync, statSync} = require('fs');
const {join} = require('path');

// Get all directory names in /api/
const versions = readdirSync(__dirname).filter(file => statSync(join(__dirname, file)).isDirectory());

// Configure the router to use these directory names, please use 'v1, v2, v3, ...'
versions.map(version => {
  router.use(`/${version}`, require(`./${version}`));
});

module.exports = router;
