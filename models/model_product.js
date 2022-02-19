var mongoose = require('../config/DBConnect');
let date = new Date(Date.now);
var ProductModel = mongoose.model("product", new mongoose.Schema({
    title : String,
    price : Number,
    username : String,
    keyword : {
        type : Array,
        default : [],
    },
    createAt: {
        type : Date,
        default :  Date.now()
    },
    updateAt: {
        type : Date,
        default : Date.now()
    }
}))
module.exports = ProductModel;
