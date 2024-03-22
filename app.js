const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { router: indexRouter } = require('./routes/index');


const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sever Rodando na Porta: ${port}`));