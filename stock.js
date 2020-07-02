const express = require('express');
var exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const PORT = process.env.port || 5000;
const mongoose = require('mongoose');
const user = require('./models/user');

function call_api(finishedAPI, ticker) {
    console.log("ticker", ticker);
    const apiURl = `https://cloud.iexapis.com/stable/stock/aapl/quote?types=quote,news,chart&range=1m&last=10&token=sk_8fd87beab2cd4d159d707aaf3406f08e`;
    const allCollection = 'https://sandbox.iexapis.com/stable/stock/market/collection/list?collectionName=mostactive&token=Tsk_75f8a00ef1ce400a9de5671974e6f490';
    const apiUrl2 = 'https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_edf9c45a75ee47508c5c15bbe63572e4';
    request(allCollection, { json: true }, (err, res, body) => {
        if (err) { console.log(err); }
        if (res.statusCode === 200) {
            finishedAPI(body)
        }
    });
}

//using body-parser middleware

app.use(bodyParser.urlencoded({ extended: false }));

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
    var scripts = [{ 
        script: '/js/login.js' , 
        script: '/js/stockFile.js'  
    }];
    call_api(function (doneAPI) {
    res.render('home', {
        stock: doneAPI,
        scripts:  scripts
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
    // console.log(body);
    if (email && password) {
        user.create({email , password , name} , (err , data)=>{
            console.log("data" , data , err);
            res.json({
                status: 200
            });
        });
    } else {
        res.json({
            status: 500
        }); 
    }
});

// Setting Handlebars POST route
app.post('/', function (req, res) {
    call_api(function (doneAPI) {
        // posted_stuff=req.body.stock_ticker;
        res.render('home', {
            stock: doneAPI,

        });
    }, req.body.stock_ticker);

});
