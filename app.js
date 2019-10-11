var express = require('express'),
    app = express(),
    PORT = process.env.PORT || 5000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser')

var passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

app.set('view engine', 'ejs')
app.use(express.static("assets"));
app.use(bodyParser.urlencoded({extended:true}));
// mongoose.connect("mongodb://localhost/alumni_db", { useUnifiedTopology: true, useNewUrlParser: true});
mongoose.connect("mongodb+srv://ayushjainrksh:4T14E3nqVfPQMAnW@cluster0-4gaqm.gcp.mongodb.net/test?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true});

//User Model
var userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    username : String,
    password : String,
    contact : Number,
    branch : String,
    rollNo : String,
    job : String
},{timestamps : true});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

//Express-session setup
app.use(require("express-session")({
    secret : "I am AJ",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


app.get('/', function(req, res){
    res.render('home')
})

app.get('/view/:branch/:year', isLoggedIn, function(req, res){
    if(req.params.branch === 'cse'){
        fullBranch = 'Computer Science'
    }
    else if(req.params.branch === 'ece')
        fullBranch = 'Electronics and Communication'
    else
        fullBranch = 'Information Technology'

    // console.log(req.params.year.substring(2,4))
	User.find({branch: fullBranch, rollNo: {$regex: new RegExp('IIITU' + req.params.year.substring(2,4) + '.*', 'i')} }, function(err, foundUser){
        if(err)
            console.log(err);
        else{
            // console.log(foundUser)
	        res.render("view", {users : foundUser});
        }
	});
})


// app.get('/view/:branch/:year/:id', isLoggedIn, function(req, res){
// 	User.findById(req.params.id, function(err, foundUser){
//         if(err)
//             console.log(err);
//         else{
//             console.log("HEllo")
// 	        res.render("view", {users : foundUser});
//         }
// 	});
// })


// AUTH ROUTES

//Register Route
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var user = new User({firstName : req.body.firstName, lastName : req.body.lastName, username : req.body.username, contact : req.body.contact, branch : req.body.branch, rollNo : req.body.rollNo, job : req.body.job});
    User.register(user, req.body.password, function(err, newUser){
        if(err)
           console.log(err);
        else
        {
            passport.authenticate("local")(req, res, function(){
                if(err)
                    console.log(err);
                else
                    res.redirect("/");
            });
        }
    });
});

//Login Route
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect : "/",
    failureRedirect : "/"
}));

//Logout Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

//Log in authentication
function isLoggedIn(req, res, next){
	if(req.user)
		return next();
	res.redirect("/");
}


app.listen(PORT, function(err){
    if(err)
        console.log(err)
    else
        console.log('Server started...')
})
