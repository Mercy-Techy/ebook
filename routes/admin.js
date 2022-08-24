const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

router.get("/add-book", adminController.getAddBook);

router.post('/add-book',adminController.postAddBook)

router.get("/admin-books",adminController.getAdminBooks);

router.post('/delete-book',adminController.postDeleteBook)

router.get('/edit-book/:bookId/:bookCategory',adminController.getEditBook)

router.post('/edit-book',adminController.postEditBook)

module.exports = router