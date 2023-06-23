require('./config/config');
const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.URLDB)
        .then(() => console.log('Connected !!!'))

} catch (err) {
    err => console.log('NOt Connected !!!')
}

module.exports = mongoose.connect(process.env.URLDB);