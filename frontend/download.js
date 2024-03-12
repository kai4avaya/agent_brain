const download = function download() {
    const listItems = document.querySelectorAll('#file-list li a'); // Select the links within the list items
    console.log('listItems', listItems)
    listItems.forEach((item) => {
      item.addEventListener('click', function() {
        console.log('item', item)

        const filename = this.textContent;

        fetch(`http://localhost:3000/download/${filename}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(e => console.error('Error:', e));
      });
    });
  };

  console.log("nerd!")