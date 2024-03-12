document.addEventListener('DOMContentLoaded', (event) => {
    // const token = localStorage.getItem('token_avaya');

    pollForToken(displayFiles);
})
const pollForToken = (callback) => {
    const intervalId = setInterval(() => {
        const token = localStorage.getItem('token_avaya');
        // console.log("token 1", token)
        // const token = token; // replace with how you're getting the token

        if (token) {
          

            clearInterval(intervalId);
            // console.log("token", token)
            callback();
        }
    }, 1000); // check every second
}

const displayFiles = async () => {
    fetch('http://localhost:3000/files', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => response.json())
  .then(async files => {
    console.log("before loadDocs")
    await loadDocs()
    const fileList = document.getElementById('file-list');
    // clear

    while (fileList.firstChild) {

        // removing each child
        console.log("i am deleting files!")
        fileList.removeChild(fileList.firstChild);
      }

    for (const file of files) {
      const li = document.createElement('li');
      // li.classList.add('link-style');

      li.textContent = file;
      // fileList.appendChild(li);



      // Create a div
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.justifyContent = 'space-between';

  // Create the link
  const a = document.createElement('a');
  a.textContent = file;
  a.style.color = 'blue';
  a.style.cursor = 'pointer';
  a.style.textDecoration = 'underline';

  // Create the button
  const button = document.createElement('button');
  button.classList.add('delete-button');
  button.textContent = 'X';
  button.style.color = 'red';
  button.style.cursor = 'pointer';

  button.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default button click behavior
    try {
        await fetch(`http://localhost:3000/document/${file}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        await displayFiles(); // Reload the files list
    } catch (error) {
        console.error('Error deleting file:', error);
    }
});

  

  // Append the link and button to the div
  div.appendChild(a);
  div.appendChild(button);

  // Replace the text content of the list item with the div
  li.textContent = '';
  li.appendChild(div);
      fileList.appendChild(li);





    }

    console.log('Before calling download', download());
    download();
    console.log('After calling download');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}