

    function login() {
         const email = document.getElementById('email').value;
       const password = document.getElementById('password').value;
       console.log({email , password});
       const obj = {
        method : 'POST' , 
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
          email , 
          password
        })
       };
      fetch('http://localhost:5000/auth' , obj).then(res => res.json()).then((item)=>{
        console.log("item" , item);
        if(item.status === 200) {
          window.location.href = '/stock';
        } else {
          const errorMessage = document.getElementById('error');
          errorMessage.append(item.message);
        }
      }).catch((e)=>{
        console.log(e);
      });
   }
   function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const obj = {
      method : 'POST' , 
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        email , 
        password,
        name
      })
     };
    fetch('http://localhost:5000/createUser' , obj).then(res => res.json()).then((item)=>{
      console.log("item" , item);
      if(item.status) {
        window.location.href = '/stock';
      }
    }).catch((e)=>{
      console.log(e);
    });
  }


