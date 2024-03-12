function loadDocs() {
    console.log("i am loading docs FRONTEND")
    fetch('http://localhost:3000/load_docs', { 
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token // Replace 'token' with your actual token
      }
    })
    .then(response => response.text())
    // .then(data => alert(data))
    .catch(error => console.error('Error:', error));
  }