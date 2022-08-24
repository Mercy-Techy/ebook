const Book = require('../models/book')
const fs = require('fs')
const path = require('path')
const c = path.join(path.dirname(process.mainModule.filename),"data","cart.json")

module.exports = class Cart{
   constructor(bookId,bookCategory,cb){
        Book.fetchAll((books) => {
          const neededBook = books[bookCategory].find(
            (bok) => bok.id == bookId
          );
          this.title = neededBook.title;
          this.category = neededBook.category;
          this.noOfPages = neededBook.noOfPages;
          this.price = neededBook.price;
          this.imgUrl = neededBook.imgUrl;
          this.id = neededBook.id;
          this.formerCategory = neededBook.formerCategory;
          Cart.fetchAllCartBooks(cartBooks=>{
            cartBooks.push(this);
            fs.writeFile(c, JSON.stringify(cartBooks), (err) => {
              console.log(err);
            });
            cb(cartBooks)
          });
        })
   }
   checker(){
       return cartBooksSaved
   }
   static fetchAllCartBooks(cb){
       fs.readFile(c, (err, fileContent) => {
         if (err) {
         cb([]);
         } else {
          cb(JSON.parse(fileContent));
         }
       });
    }

    static deleteCartItems(bookId){
      fs.readFile(c,(err,fileContent)=>{
        let books = JSON.parse(fileContent)
        books= books.filter(
          (cartItem) => {
            return cartItem.id != bookId;
          }
        );
        fs.writeFile(c, JSON.stringify(books), (err) => console.log(err));
      })
    }

    static clearCart(){
      const cart = []
      fs.writeFile(c,JSON.stringify(cart),err=>console.log(err))
    }
}