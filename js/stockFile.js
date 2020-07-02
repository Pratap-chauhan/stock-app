function createTable (data) {
    const tbody = document.getElementById('stocks');
    tbody.innerHTML = '';
    for(let i = 0 ; i <data.length ; i++) {
      const tr = document.createElement('tr');
      const ctd = document.createElement('td');
      const companyName = document.createTextNode(data[i].companyName);
      ctd.appendChild(companyName);
      tr.appendChild(ctd);
      const std = document.createElement('td');
      const csymbol = document.createTextNode(data[i].symbol);
      std.appendChild(csymbol);
      tr.appendChild(std);
      const rstd = document.createElement('td');
      const iexRealtimeSize = document.createTextNode(data[i].iexRealtimeSize);
      rstd.appendChild(iexRealtimeSize);
      tr.appendChild(rstd);
      

      const rptd = document.createElement('td');
      const iexRealtimePrice = document.createTextNode(data[i].iexRealtimePrice);
      rptd.appendChild(iexRealtimePrice);
      tr.appendChild(rptd);


      const whtd = document.createElement('td');
      const week52High = document.createTextNode(data[i].week52High);
      whtd.appendChild(week52High);
      tr.appendChild(whtd);


      const wltd = document.createElement('td');
      const week52Low = document.createTextNode(data[i].week52Low);
      wltd.appendChild(week52Low);
      tr.appendChild(wltd);

      tbody.appendChild(tr);
    }
   }

   function fetchStocks() {
    const url = 'https://sandbox.iexapis.com/stable/stock/market/collection/list?collectionName=mostactive&token=Tsk_75f8a00ef1ce400a9de5671974e6f490';
    fetch(url).then(res=>res.json()).then((item)=>{
      const data  = item;
      createTable(data);
    }).catch((error)=>{
      console.trace(error);
    })
  }
 

  window.addEventListener('load', ()=>{
    fetchStocks();
    setInterval(()=>{
      fetchStocks()
    }, 1*60*60);
  }, false);