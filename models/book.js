const fs = require('fs')
const path = require('path')
const p = path.join(path.dirname(process.mainModule.filename),"data","books.json")

const getBooksFile = (cb)=>{
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            cb({})
        }
        else{
            cb(JSON.parse(fileContent))
        }
    })
}

module.exports = class Book{
    constructor(title,category,noOfPages,price,imgUrl,check){
        this.title = title;
        this.category = category.toLowerCase()
        this.noOfPages = noOfPages;
        this.price = price;
        this.imgUrl = imgUrl
        this.id = Math.random().toString();
        this.check = check;
    }
    save(){
       getBooksFile(books=>{
           let bookKeys = Object.keys(books)
           if(bookKeys){
               const bookCategory = bookKeys.find(cat=>this.category=== cat)
                   if(bookCategory){
                       books[bookCategory].push(this)
                   }
                   else{
                       books[this.category] = []
                       books[this.category].push(this)
                   }
            }
            else{
                books[this.category] = []
                books[this.category].push(this);
            }
            if(this.check){
               let bestSeller = bookKeys.find(cat=>"bestSeller" === cat)
               if(bestSeller){
                   books["bestSeller"].push(this);
               }
               else{
                   books["bestSeller"] = []
                   books["bestSeller"].push(this);
               }
            }
           fs.writeFile(p,JSON.stringify(books),err=>{
               if(err){console.log(err)}
           })
       })
    }
    static editBook(obj,id,formerCategory,category){
        getBooksFile(books=>{
            let neededCategory = books[formerCategory]
             const newNeededCategory = neededCategory.filter(book=>book.id != id)
             neededCategory = newNeededCategory
             if (obj.check == "on") {
               if (books.bestSeller) {
                 let bestSellerBookId = books.bestSeller.findIndex(
                   (book) => book.id == id
                 );
                 if (bestSellerBookId > -1) {
                   books.bestSeller[bestSellerBookId] = obj;
                 } else {
                   books.bestSeller.push(obj);
                 }
               } else {
                 books.bestSeller = [];
                 books.bestSeller.push(obj);
               }
             } else {
                 if(books.bestSeller){
                     books.bestSeller = books.bestSeller.filter(i=>{return i.id != id})
                 }
               delete obj.check;
             }
             if(category){
                 books[formerCategory] = neededCategory
                 if(books[formerCategory].length == 0){
                     delete books[formerCategory]
                 }
                 let bookKeys = Object.keys(books)
                 const bookCategory = bookKeys.find(cat=> category=== cat)
                 if(bookCategory){
                     books[category].push(obj)
                 }
                 else{
                     books[category] = []
                     books[category].push(obj)
                 } 
             }else{
                 neededCategory.push(obj);
                 books[formerCategory] = neededCategory;  
             }
             fs.writeFile(p, JSON.stringify(books), (err) => {
               if (err) {
                 console.log(err);
               }
             });       
        })
    }
    static fetchAll(cb){
        getBooksFile(cb)
    }
    static deleteBook(id,cat){
        Book.fetchAll(books=>{
            const updatedArray = books[cat].filter(obj=>obj.id !== id)
            books[cat]  = updatedArray
            if(books[cat].length == 0){
                delete books[cat]
            }
            if(books.bestSeller){
            let bestSellerArray = books.bestSeller;
            let bestSellerBook = bestSellerArray.find((book) => book.id == id)
            if (bestSellerBook) {
              bestSellerArray = bestSellerArray.filter((book) => book.id != id);
              books.bestSeller = bestSellerArray;
              if(books["bestSeller"].length == 0){
                  delete books["bestSeller"]
              }
            }}
            fs.writeFile(p, JSON.stringify(books), (err) => {
              if (err) {
                console.log(err);
              }
            });
        })
    }
}