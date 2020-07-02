var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost/swag-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var app = express();

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Adding a new product
app.post('/product', function (request, response) {
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  product.save(function (err, savedDocument) {
    if (err) {
      response.status(500).send({ error: "Product couldn't be saved." });
    } else {
      response.status(200).send(savedDocument);
    }
  });
});
// Adding a new wishlist
app.post('/wishlist', function (request, response) {
  var wishList = new WishList();
  wishList.title = request.body.title;
  wishList.products = request.body.products;
  wishList.save(function (err, wishList) {
    if (err) {
      response.status(500).send({ error: "Wishlist couldn't be created." });
    } else {
      response.status(200).send(wishList);
    }
  });
});

// Lists all the products
app.get('/product', function (request, response) {
  Product.find({}, function (err, products) {
    if (err) {
      response.status(500).send({ error: "Products couldn't be retrieved." });
    } else {
      response.status(200).send(products);
    }
  });
});
// Lists all the wishlists
app.get('/wishlist', function (request, response) {
  WishList.find({})
    .populate({ path: 'products', model: 'Product' })
    .exec(function (err, wishlists) {
      if (err) {
        response
          .status(500)
          .send({ error: "Wishlists couldn't be retrieved." });
      } else {
        response.status(200).send(wishlists);
      }
    });
});

// Adds a product to a wishlist
app.put('/wishlist/product/add', function (request, response) {
  Product.findOne({ _id: request.body.productId }, function (err, product) {
    if (err) {
      response.status(500).send({ error: "Product couldn't be found." });
    } else {
      WishList.update(
        { _id: request.body.wishlistId },
        { $addToSet: { products: request.body.productId } },
        function (err, wishlist) {
          if (err) {
            response.status(500).send({ error: "Product couldn't be added." });
          } else {
            response.status(200).send(wishlist);
          }
        }
      );
    }
  });
});

app.listen(3000, function () {
  console.log('Swag shop API up and running on port 3000...');
});
