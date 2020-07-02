var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require ('body-parser');
var db = mongoose.connect('mongodb://localhost/swag-shop', {useNewUrlParser: true, useUnifiedTopology: true});
var app = express();

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.listen(3000, function(){
  console.log('Swag shop API up and running on port 3000...')
});