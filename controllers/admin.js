const Book = require('../models/book')
const Cart = require('../models/cart');

exports.getAddBook  = (req,res,next)=>{
    res.render("admin/add-book", {
      path: "/admin-add-book",
      pageTitle: "Add Book",
      editing:false
    });
}

exports.postAddBook = (req,res,next)=>{
    const title = req.body.title;
    const noOfPages = req.body.noOfPages;
    const category = req.body.category;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const check = req.body.check
    const book = new Book(title,category,noOfPages,price,imgUrl,check)
    book.save()
    res.redirect("/admin/admin-books");
}

exports.getAdminBooks = (req, res, next) => {
  Book.fetchAll((books) => {
    if(books.bestSeller){
      delete books.bestSeller;
    }
    res.render("admin/admin-books", {
      pageTitle: "Admin books",
      path: "/admin-books",
      books: books,
    });
  });
};

exports.postDeleteBook = (req,res,next)=>{
  const bookId = req.body.bookId
  const bookCategory = req.body.bookCategory
   Book.deleteBook(bookId,bookCategory)
   Cart.deleteCartItems(bookId)
   res.redirect("/admin/admin-books")
}


exports.getEditBook  = (req,res,next)=>{
  const edit = req.query.edit
  if(!edit){return res.redirect("/")}
  const editing = true
  const bookId = req.params.bookId
  const bookCategory = req.params.bookCategory
  Book.fetchAll(books=>{
    const categoryBooks = books[bookCategory];
    const neededBook = categoryBooks.filter((book) => book.id == bookId)[0]
    res.render("admin/add-book", {
      editing: editing,
      book: neededBook,
      path: "/admin-books",
      pageTitle: "Edit book",
      formerCategory: bookCategory,
    });
  })
}

exports.postEditBook = (req,res,next)=>{
  const formerCategory = req.body.formerCategory
  const title = req.body.title
  const category = req.body.category.toLowerCase();
  const noOfPages = req.body.noOfPages
  const price = req.body.price
  const imgUrl = req.body.imgUrl
  const check = req.body.check
  const bookId = req.body.bookId
  if(formerCategory !== category){
  Book.editBook(
    {
      title: title,
      category: category,
      noOfPages: noOfPages,
      price: price,
      imgUrl: imgUrl,
      id: bookId,
      check: check,
    },
    bookId,
    formerCategory,
    category
  );
  }
  else{
    Book.editBook({
      title: title,
      category: category,
      noOfPages: noOfPages,
      price: price,
      imgUrl: imgUrl,
      id: bookId,
      check: check
    },bookId,formerCategory,null)
  }
  
  res.redirect("/admin/admin-books")
}