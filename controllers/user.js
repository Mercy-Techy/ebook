const Book = require('../models/book')
const Cart = require('../models/cart')

exports.getHome = (req,res,next)=>{
    Book.fetchAll((books) => {
      bookCategories = Object.keys(books);
      let trendingBooksArray = [];
      for (let category of bookCategories) {
        if(category != 'bestSeller'){
        trendingBooksArray.push(
          books[category][Math.floor(Math.random() * (books[category].length - 1))]);
        }
      }  
        res.render("user/home", {
        pageTitle: "Home",
        path: "/",
        books:books.bestSeller ? books.bestSeller : [],
        trendingBooks:trendingBooksArray
      });
      })
    }


exports.getBookList = (req,res,next)=>{
  Book.fetchAll((books) => {
    res.render("user/book-list", {
      pageTitle: "List of Available Books",
      path: "/book-list",
      books: books,
    });
  });
}

exports.postGetBuy = (req,res,next)=>{
  Cart.clearCart()
     res.render("user/buy", {
       pageTitle: "Buy Product",
       path: "/",
       getting:false
     });
  }


exports.postBuy = (req,res,next)=>{
Cart.fetchAllCartBooks(cart=>{
  let totalPrice  = 0
  cart.map(book=>{
    totalPrice += Number(book.price);
  })
  res.render("user/buy", {
    pageTitle: "Buy Product",
    path: "/",
    totalPrice: totalPrice,
    books:cart,
    getting: true,
  });
})
}

exports.getCart = (req,res,next)=>{
  const bookId = req.params.bookId
  const bookCategory = req.params.bookCategory;
  if(bookCategory && bookId){
     const cart  = new Cart(bookId,bookCategory,cartBooks=>{
       res.render("user/cart", {
        books: cartBooks,
        pageTitle: "Cart",
        path: "/cart",
     })      
      })
  }
  else{
    Cart.fetchAllCartBooks((cartBooks) => {
      res.render("user/cart", {
        books: cartBooks,
        pageTitle: "Cart",
        path: "/cart",
      });
    });
  }
}

exports.removeCartItem = (req,res,next)=>{
  const bookId = req.params.bookId
  Cart.deleteCartItems(bookId)
  res.redirect('/cart')
}