document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const files = document.getElementById('file-input').files;
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token // replace 'token' with your actual token
        }
      })
    .then(response => response.text())
    .then(async data => {
      document.getElementById('status').textContent = 'Files uploaded successfully';
      await displayFiles();
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('status').textContent = 'Error uploading files';
    });
  });