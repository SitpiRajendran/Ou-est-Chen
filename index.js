// EXPRESS SETUP
const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
var session = require("express-session");
var bodyParser = require("body-parser");
const passport = require('passport');
const favicon = require('express-favicon');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.use('/models', express.static(__dirname + '/models'))

// DATABASE SETUP
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://SitpiRaja:<password>@cluster0.5tswq.mongodb.net/chasse-au-chen?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('Connected to Mongoose'))

// Passport


require('./config/passport')(passport);

app.use(express.static("public"));
app.use(session({ secret: "chasseauchen", resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/img', express.static(__dirname + 'public/img'))
app.use(favicon(__dirname + '/public/img/favicon.ico'));

// ROUTING

app.use('/', indexRouter)

app.get('*', function(req, res, next){
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

app.listen(process.env.PORT || 80)
