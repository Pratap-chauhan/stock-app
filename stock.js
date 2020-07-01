const express = require('express');
var exphbs  = require('express-handlebars');
const app=express();
const path=require('path');
const request=require('request');
const bodyParser = require('body-parser');
const PORT = process.env.PORT|| 5000


// API key  API Token: pk_edf9c45a75ee47508c5c15bbe63572e4 

//Calling the  API function
function call_api(finishedAPI, ticker)
{
    console.log("ticker" , ticker);
    const apiURl  = `https://cloud.iexapis.com/stable/stock/aapl/quote?types=quote,news,chart&range=1m&last=10&token=sk_8fd87beab2cd4d159d707aaf3406f08e`;
    const allCollection = 'https://sandbox.iexapis.com/stable/stock/market/collection/list?collectionName=mostactive&token=Tsk_75f8a00ef1ce400a9de5671974e6f490';
    const apiUrl2 = 'https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=pk_edf9c45a75ee47508c5c15bbe63572e4';
    request(allCollection,{json:true},(err,res,body)=>{
    console.log("err" , {err} , body )    
    if(err)
        {console.log(err);}
        
        if(res.statusCode===200){
            // console.log(body);
            finishedAPI(body)
        }
     });
}

//using body-parser middleware

app.use(bodyParser.urlencoded({extended:false}));

var hbs = exphbs.create({
    helpers: {
        login : function () { 
            console.log('hello' , document.getElementById('email')) 
        }
    }
});
// Setting Handlebars Middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Setting Handlebars GET route
app.get('/', function (req, res) {
    // console.log("><><><>" , req);
    call_api(function(doneAPI){
        console.log("fone" , JSON.stringify(doneAPI));  
        res.render('home',{
            stock: doneAPI
        });
    });    
    // res.render('login')
   
});


app.post('/auth' , function(req , res) {
    console.log(req , res);
    const {body} = req;
    if(body.email && body.password) {
        call_api(function(doneAPI){
        console.log("fone" , JSON.stringify(doneAPI));  
        res.render('home',{
            stock: doneAPI
        });
    });
    }
});

// Setting Handlebars POST route
app.post('/', function (req, res) {
    call_api(function(doneAPI){
        // posted_stuff=req.body.stock_ticker;
        res.render('home',{
            stock: doneAPI,
          
        });
    },req.body.stock_ticker);    
   
});


app.use(express.static(path.join(__dirname,'public')));

app.listen(PORT,()=>console.log('Server Listeningon port'+PORT))