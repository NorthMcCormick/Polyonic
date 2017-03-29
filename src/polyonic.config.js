const fs = require('fs-extra');

var config = fs.readJsonSync('polyonic.config.json');

// Do some cool config normalizing or something here



module.exports = config;