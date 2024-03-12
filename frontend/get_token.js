let token;
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('http://localhost:3000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Include any necessary data in the body of the request
      body: JSON.stringify({
        username: 'username',
        password: 'password',
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      token = data.token;
      localStorage.setItem('token_avaya', token);
  
      // Show the success notice
      const successNotice = document.getElementById('success-notice');
      successNotice.style.display = 'block';
  
      // Hide the success notice after 3 seconds
      setTimeout(() => {
        successNotice.style.display = 'none';
      }, 3000);
    })
    .catch((error) => {
      console.error('Error:', error);
  
      // Show the error notice
      const errorNotice = document.getElementById('error-notice');
      errorNotice.style.display = 'block';
  
      // Hide the error notice after 3 seconds
      setTimeout(() => {
        errorNotice.style.display = 'none';
      }, 3000);
    });
  });