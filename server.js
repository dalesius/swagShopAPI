var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require ('body-parser');
var db = mongoose.connect('mongodb://localhost/swag-shop', {useNewUrlParser: true, useUnifiedTopology: true});
var app = express();

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product', function(request, response){
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  product.save(function(err, savedDocument){
    if (err) {
      response.status(500).send({error:"Product couldn't be saved"});
    } else {
      response.status(200).send(savedDocument);
    }
  });
});

app.listen(3000, function(){
  console.log('Swag shop API up and running on port 3000...')
});