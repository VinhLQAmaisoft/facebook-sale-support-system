const { CookieModel } = require('../models')// {key}=> Ông chỉ lấy đúng cái key ra thôi => tôi lấy thuộc tính UserModel của obj Models
// const  UserModel = require('../models')// key=> Ông lấy cả cái object ra => Tôi lấy obj Models 
const { logError } = require('../utils')

async function find(condition) {//
    try {
        return CookieModel.find(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.Find ", { input: condition, error })
        return null
    }
}

async function create(data) {
    try {
        return CookieModel.create(data)
    } catch (error) {
        logError("Lỗi tại OrderService.create ", { input: data, error })
        return null
    }
}

async function deleteOne(condition) {
    try {
        return CookieModel.deleteOne(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.deleteOne ", { input: condition, error })
        return null
    }
}

async function deleteMany(condition) {
    try {
        return CookieModel.deleteMany(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.deleteMany ", { input: condition, error })
        return null
    }
}

async function updateOne(condition, newData) {
    try {
        return CookieModel.updateOne(condition, newData)
    } catch (error) {
        logError("Lỗi tại OrderService.updateOne ", { input: condition, error })
        return null
    }
}

async function updateMany(condition, newData) {
    try {
        return CookieModel.updateOne(condition, newData)
    } catch (error) {
        logError("Lỗi tại OrderService.updateMany ", { input: condition, error })
        return null
    }
}

// Phân trang

module.exports = {
    find, create, deleteOne, deleteMany, updateOne, updateMany
}