
document.addEventListener('DOMContentLoaded', (event) => {
document.getElementById('scrape-form').addEventListener('submit',async function(event) {
    event.preventDefault();

    const urls = document.getElementById('urls').value.split(',').map(url => url.trim());
    console.log("I am URLS", urls)
    fetch('http://localhost:3000/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // replace 'token' with your actual token
      },
      body: JSON.stringify({ urls: urls })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch((error) => {
      console.error('Error:', error);
    });
    await displayFiles();
  });
})