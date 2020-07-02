const express = require('express');
var exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const PORT = process.env.port || 5000;
const mongoose = require('mongoose');
const user = require('./models/user');
const cookieParser = require('cookie-parser');

function fetchData(finishedAPI) {
    const allCollection = 'https://sandbox.iexapis.com/stable/stock/market/collection/list?collectionName=mostactive&token=Tsk_75f8a00ef1ce400a9de5671974e6f490';
    request(allCollection, { json: true }, (err, res, body) => {
        if (err) { console.log(err); }
        if (res.statusCode === 200) {
            finishedAPI(body)
        }
    });
}

//using body-parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())

var hbs = exphbs.create({
    helpers: {
        log: function (email , password) {
            console.log('hello', email , password);
        },
    }
});
function init(){
    return new Promise((resolve, reject) => {
        
        mongoose.connect('mongodb+srv://pratapdb:1213639@cluster0.yndbe.mongodb.net/stock?retryWrites=true&w=majority', {
            useNewUrlParser: true
        }).then(() => { 
              console.log("contected...");
             
            })
            .catch((error) => {
                console.log(error);
                return reject(false);
            });
    });
}
init();

// Setting Handlebars Middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/js' ,express.static(path.join(__dirname, 'js')));

app.listen(PORT, () => console.log('Server Listeningon port' + PORT))

function stockData(req, res) {
    const userName = req.cookies.username;
    const userId = req.cookies.userId;
    const scripts = [{ 
        script: '/js/login.js' , 
        script: '/js/stockFile.js'  
    }];
    fetchData(function (data) {
    res.render('home', {
        stock: data,
        scripts:  scripts,
        userName: userName,
        userId : userId
    });
});
}

app.get('/stock' , function(req, res) {
    stockData(req , res)
});

// Setting Handlebars GET route
app.get('/', function (req, res) {
    var scripts = [{ 
        script: '/js/login.js' 
    }];
    res.render('login' , {
        scripts: scripts
    })
});
app.get('/signUp', function (req, res) {
    var scripts = [{ 
        script: '/js/login.js' 
    }];
    res.render('signUp' , {
        scripts: scripts
    })
});

app.post('/auth', function (req, res) {
    const { email ,  password} = req.body;
    if (email && password) {
       user.findOne({email}, (err , data)=>{
        if(data && data.comparePassword(password)) {
            res.cookie('username' , data.name);
            res.cookie('userId' , Math.floor(Math.random() * (1000 - 10 + 1) + 10));
            res.json({
                status: 200,
                data,
                message : 'Successful login'
            }); 
        } else  {
            res.json({
                status: 403,
                message : 'Wrong Password or email not exist'
            }); 
        }
       });
    } else {
        res.json({
            status: 500,
            message : 'Internal Error',
            data , err
        }); 
    }
});

app.post('/createUser', function (req, res) {
    const { email ,  password , name} = req.body;
    if (email && password) {
        user.create({email , password , name} , (err , data)=>{
            if(!err) {
            res.json({
                status: 200,
                data
            });
        } else {
            res.json({
                status: 500,
                data : err
            });
        }
        });
    } else {
        res.json({
            status: 500,
            message : 'Intenal error'
        }); 
    }
});

// Setting Handlebars POST route
app.post('/', function (req, res) {
    fetchData(function (data) {
        res.render('home', {
            stock: data,
        });
    }, req.body.stock_ticker);

});
