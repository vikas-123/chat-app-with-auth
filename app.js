const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))


const users = require('./routes/users');
const chat = require('./routes/chat');

// Passport Config
require('./config/passport')(passport);

const db = require('./config/database');
mongoose.Promise = global.Promise;

 //////////////////////////
// Connect to Database
//////////////////////////

mongoose.connect(db.mongoURI, {
  
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.get("/", (req, res) => {
      res.render('index')
   });

app.use('/users', users);
app.use('/chat',chat);


const port = process.env.PORT|| 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});