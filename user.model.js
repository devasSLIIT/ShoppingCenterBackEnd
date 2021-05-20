const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    First_Name: {
        type: String
    },
    Middle_Name: {
        type: String
    },
    Last_Name: {
        type: String
    },
    Contact_Number: {
        type: String
    },
    Country: {
        type: String
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    Type: {
        type: String
    }
});

module.exports = mongoose.model('User', User);