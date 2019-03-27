var express = require('express'),
    app = express()
    PORT = 5000
    mongoose = require('mongoose')

var passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

app.set('view engine', 'ejs')
app.use(express.static("assets"));
mongoose.connect("mongodb://localhost/alumni_db");

//User Model
var userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    contact : Number,
    branch : String,
    rollNo : String,
    job : String
},{timestamps : true});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);


app.get('/', function(req, res){
    res.render('home')
})

app.get('/view', function(req, res){
    res.render('view')
})

app.listen(PORT, function(err){
    if(err)
        console.log(err)
    else
        console.log('Server started...')
})
