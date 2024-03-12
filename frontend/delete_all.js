async function deleteAll() {
    const input = document.getElementById('deleteInput').value;
    if (input === 'delete-all') {
      fetch('http://localhost:3000/nuke', { 
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.text())
      .then(data => alert(data))
      .catch(error => console.error('Error:', error));
    } else {
      alert('You must type "delete-all" to confirm.');
    }
    await displayFiles()
  }