 function showError(msg) {
      const errorMessage = document.getElementById('error');
      errorMessage.innerText = '';
      errorMessage.innerText = msg;
    }

    function login() {
         const email = document.getElementById('email').value;
       const password = document.getElementById('password').value;
       console.log({email , password});
       if(!email || !password) {
        showError('Email and password are mandatory field');
        return;
       }
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
          showError(item.message);
        }
      }).catch((e)=>{
        showError(e.message)
      });
   }
   function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    if(!name || !email || !password) {
      showError('Name , email and password are mandatory');
      return;
    };
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
      if(item.status === 200) {
        window.location.href = '/stock';
      }else {
	        showError(item.message)
      }
    }).catch((e)=>{
	    showError(e.message)
      console.log(e);
    });
  }


