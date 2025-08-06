const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');


// Import Admin model
const Admin = require('./models/admin');
const isAdminLoggedin = require('./middlewares/isAdminLoggedin');
const adminStudentRouter = require('./routes/admin/student'); 
const adminTeacherRouter = require('./routes/admin/teacher');
const studentRouter = require('./routes/student/home') ;
const teacherRouter = require('./routes/teacher/home') ;
const homeNavRouter = require('./routes/home/navabr') ;
const loginRouter =   require('./routes/login/all');
const logoutRouter =   require('./routes/logout/all');

// MongoDB Connection
mongoose.connect('mongodb+srv://Nakul-M:ismnagrota12@nakulproject.rlo0gdj.mongodb.net/?retryWrites=true&w=majority&appName=nakulproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));


// View Engine Setup
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate'); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
  secret: "thisshouldbeasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24*7 , // 1 day
} };

app.use(session(sessionOptions));
app.use(flash()) ;
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// Routes
app.get('/', (req, res) => {
  res.send("Welcome");
});
// Admin Dashboard
app.get('/admin/dashboard',isAdminLoggedin , (req, res) => {
  res.render('admin/dashboard' , { showFooter: false});
});

app.use("/admin/students" ,  adminStudentRouter); 
app.use("/admin/teachers" , adminTeacherRouter);
app.use('/student' , studentRouter) ;
app.use('/teacher' , teacherRouter) ;
app.use('/' , homeNavRouter);
app.use("/login" , loginRouter) ;
app.use("/logout" , logoutRouter) ;



// Start Server
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
