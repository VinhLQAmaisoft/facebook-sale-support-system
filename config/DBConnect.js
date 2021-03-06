var mongoose = require("mongoose");//Mongoose thuần chưa kết nối db
require('dotenv').config()
//kết nối đb
// console.log(process.env.DB_CONNECTION_STRING_LOCAL + process.env.DB_NAME)
mongoose.connect(process.env.DB_CONNECTION_STRING_REMOTE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;//Check xem có lỗi hay không
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log(`Kết nối database thành công`);
});
module.exports = mongoose;//Mongoose t đã kết nối db