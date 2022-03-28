const { OrderService } = require("../services");
const { CustomerService } = require("../services");
const { logError, logWarn, genKeyWord } = require("../utils/index");

const CustomerController = {
  async getCustomer(req, res) {
    function getTotalMoney(orderList) {
      let sum = 0;
      for (const order of orderList) {
        sum += getOrderTotal(order);
      }
      return sum;
    }
    function getOrderTotal(order) {
      let sum = 0;
      for (const prd of order.product) {
        sum += parseInt(prd.quantity) * prd.product.price;
      }
      return sum;
    }

    try {
      let keyword = req.query.keyword;
      let shopkeeper = req.body.username;
      let data;
      let customerData = null;
      if (keyword == null || keyword == "") {
        data = await CustomerService.aggregate([        
          {
            $lookup: {
              from: "orders",
              localField: "facebook_id",
              foreignField: "customerId",
              pipeline:[{"$match":{"shopkeeper":shopkeeper}},],
              as: "order_detail",
            },
          },
          {
            $addFields: {
              numberOfOrders: {
                $cond: {
                  if: { $isArray: "$order_detail" },
                  then: { $size: "$order_detail" },
                  else: "0",
                },
              },
            },
          },
        ]);
        for (let i = 0; i < data.length; i++) {
          const customer = data[i];
          data[i].totalSpends = getTotalMoney(customer.order_detail);
        }
      } else {
        data = await CustomerService.find({ facebook_id: { $regex: keyword } });
      }
      //data = customer + tất cả order
      // dùng vòng lặp -> xóa hết tất cả các order không phải của shopkeeper chỉ định
      //=> data = customer + order của shopkeeper
      /*Array.splice(index,1) = xóa phần tử tại vị trí i trong Array */

      return res.json({ data: data, message: "Get Order Success" });
    } catch (error) {
      console.log(error);
      return res.json({ data: error, message: "Get Order Error" });
    }
  },

  async getOrder(req, res) {
    function getOrderTotal(order) {
      let sum = 0;
      for (const prd of order.product) {
        sum += parseInt(prd.quantity) * prd.product.price;
      }
      return sum;
    }
    //req.body.name
    try {
      let data = req.body.data;
      let shopkeeper = req.body.username;
      let orderType = req.body.orderType;// 1 - Order by customerId >< 2 - Order by OrderID
      let result=null;
      let output=[];
      console.log("getOrder Body: ",req.body
      );
      if(orderType==1){
        result = await OrderService.find({ customerId: data,shopkeeper: shopkeeper});
      }else if (orderType==2){
        console.log("in condition" + data);
        result = await OrderService.find({ _id: data});
      }
      if (result.length == 0) {
        return res.json({ data: null, message: "Order not existed !" });
      }
      for (let i = 0; i < result.length; i++) {
          const order = result[i];
          result[i].total = getOrderTotal(order);
          output.push({
            total: getOrderTotal(order),
            ...order._doc
          })
      }
      return res.json({ data: output, message: "Get Order Success" });
    } catch (error) {
      console.log("Get Order Error", error);
      return res.json({ data: error, message: "Get Order Error" });
    }
  },
};

module.exports = CustomerController;