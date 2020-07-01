

    const stock = require('../stock');
   
    const request=require('request');
    function login() {
       const email = document.getElementById('email').nodeValue;
       const password = document.getElementById('password').nodeValue;
       const apiCall = new request('http://localhost:5000/auth', {
         method: 'POST',
         body :{
           email , 
           password
         }
       }).then((item) =>{
         console.log(item);
       }).catch((error)=>{
         console.log(error);
       })
   }

//     {{!-- if(window.sessionStorage.getItem('_id')) {
//         console.log(window.sessionStorage.getItem('_id'))
//       } else {
//       window.sessionStorage.setItem('_id' , '123423234');
//       } --}}
//   {{!-- function clearSession( ) {
//     setTimeout(function() { sessionStorage.clear(); }, (5 * 60 * 60))
//   }
//   function LogOff () {
//    console.log("ssss");
//   clearSession();
//  } --}}