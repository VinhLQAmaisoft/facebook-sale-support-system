const { OrderService, UserService } = require('../services')
const { logError, logWarn, genKeyWord } = require('../utils/index')


const OrderController = {
    async create(req, res) {
        try {
            let comment_id = req.body.comment_id;
            let shopkeeper = req.body.username;
            let product = req.body.product;
            let customerName = req.body.customerName;
            let address = req.body.address;
            let phone = req.body.phone;
            let customerId = req.body.customerId;
            let postId = req.body.postId;
            if (!comment_id || !product || !customerName || !address || !phone || !customerId || !postId) {
                return res.json({ data: null, message: "Lack of information" })
            }
            if (!shopkeeper) {
                return res.json({ data: null, message: "No user authen" })
            }
            let isExist = await OrderService.find({ comment_id: comment_id })
            if (isExist.length > 0) {
                return res.json({ data: null, message: "Order Đã tồn tại" })
            }
            let result = await OrderService.create({ comment_id, shopkeeper, product, customerName, address, phone, customerId, postId })
            return res.json({ data: result, message: "Create Order success" })
        } catch (error) {
            console.log("Create Order Error", error)
            return res.json({ data: null, message: "Create Order Error" })
        }
    },//FE truyền dữ liệu -> BE nhận dữ liệu -> BE xử lý dữ liệu -> BE trả dữ liệu
    async getOrder(req, res) {//req.body.name 
        try {
            let condition = {};
            if (req.body.username) {
                condition.shopkeeper = req.body.username
            } else {
                return res.json({ data: null, message: "No user authen" })
            }
            if (req.query.id) {
                condition._id = req.query.id
            }
            let result = await OrderService.find(condition)
            console.log('Condition: ', req.body)
            // console.log('result' + util.inspect(result ,false, null, true))
            if (result.length == 0) {
                return res.json({ data: null, message: "Order not existed !" })
            }
            return res.json({ data: result, message: "Get Order Success" })
        } catch (error) {
            logError("Get Order Error", error)
            return res.json({ data: error, message: "Get Order Error" })
        }
    },
    async edit(req, res) {
        try {
            let _id = req.body._id;
            let product = req.body.product;
            let customerName = req.body.customerName;
            let address = req.body.address;
            let phone = req.body.phone;
            let shipper = req.body.shipper;
            let shopkeeper = req.body.username;
            if (!shopkeeper) {
                return res.json({ data: null, message: "No user authen" })
            }
            if (!_id) {
                return res.json({ data: null, message: "Not have id Product" })
            } else if (!title && !price && !keywords) {
                return res.json({ data: null, message: "Not have information" })
            }
            let result = await OrderService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Product not existed !" })
            } else {
                let updateAt = Date.now()
                result = await OrderService.updateOne({ _id }, { product, customerName, address, phone, shipper, updateAt })
            }
            return res.json({ data: result, message: "Update  Success" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Update Error" })
        }
    },
    async delete(req, res) {
        try {
            let _id = req.body._id;
            let shopkeeper = req.body.username;
            if (!shopkeeper) {
                return res.json({ data: null, message: "No user authen" })
            }
            if (!_id) {
                return res.json({ data: null, message: "Not have id post" })
            }
            let result = await OrderService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Post not existed !" })
            } else {
                result = await OrderService.deleteOne({ _id })
            }
            return res.json({ data: result, message: "Delete  Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Delete Error" })
        }
    }, 
    async changeStatus(req, res) {
        try {
            let _id = req.query.id;
            let shopkeeper = req.body.username;
            if (!shopkeeper) {
                return res.json({ data: null, message: "No user authen" })
            }
            if (!_id) {
                return res.json({ data: null, message: "Not have id Product" })
            } 
            let result = await OrderService.find({_id})
            
            if (!result) {
                return res.json({ data: null, message: "Order not existed !" })
            } else {
                let updateAt = Date.now();            
                let status = result[0].status
                console.log('status begin',status)
                if (status === 'created') {
                    status = 'cancel'
                } else if (status === 'cancel') {
                    status = 'done'
                } else {
                    status = 'created'
                }
                console.log('status end',status)
                result = await OrderService.updateOne({ _id }, { status, updateAt })
            }
            return res.json({ data: result, message: "Update  Success" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Update Error" })
        }
    },
    async getTotalEarn(req, res) {
        try {
            let _id = req.query.id;
            let user = await UserService.find({ _id });

            if (!user) {
                return res.json({ data: null, message: "Not have id user" })
            }
            let shopkeeper = user[0].username
            let result = await OrderService.find({ shopkeeper })
            if (!result) {
                return res.json({ data: null, message: "Post not existed !" })
            }
            let totalMoney = 0;
            if (result.length != 0) {
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < result[i].product.length; j++) {
                        totalMoney += parseInt(result[i].product[j].quantity) * result[i].product[j].product.price
                    }
                }
            }
            return res.json({ data: totalMoney, message: "Get Total Earn Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Get Total Earn Error" })
        }
    }
}

module.exports = OrderController