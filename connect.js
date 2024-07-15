const mongoose = require('mongoose')

async function mongooseConnect(url){
    return mongoose.connect(url);
}

module.exports = mongooseConnect;