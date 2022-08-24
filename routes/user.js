const express = require('express')

const userController = require('../controllers/user')

const router = express.Router()

router.get('/',userController.getHome)

router.get('/book-list',userController.getBookList)

router.get('/cart',userController.getCart)

router.get("/deleteCartItem/:bookId",userController.removeCartItem);

router.post('/receipt',userController.postGetBuy)

router.post('/buy-books',userController.postBuy)

router.get('/cart/:bookId/:bookCategory',userController.getCart)

module.exports = router