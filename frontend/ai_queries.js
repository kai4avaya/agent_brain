function sendQuery() {
  const query = document.getElementById("queryInput").value;
  console.log("I am query", query);
  const url = `http://localhost:3000/query?query=${encodeURIComponent(query)}`;
  // caches.open("ai_llama").then((cache) => {
    // cache.match(url).then((cachedResponse) => {
      // if (cachedResponse) {
        document.getElementById("queryOutput").textContent = JSON.stringify(
          cachedResponse,
          null,
          2
        );
      // } else {
        fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then((response) => {
            cache.put(url, response.clone());
            console.log("RESPONSE", response);
            return response.json();
          })
          .then((data) => {
            const output = document.getElementById("queryOutput");
            const queryHolder = document.getElementById("queryHolder");
            output.innerHTML = ""; // clear the output first
            console.log("DATA", data);
            data.sourceNodes.forEach((node) => {
              const text = node.text;
              const truncatedText =
                text.length > 100 ? text.substring(0, 100) + "..." : text;
              const moreText = text.length > 100 ? text.substring(100) : "";

              const nodeElement = document.createElement("div");
              // const textElement = document.createElement('p');
              // textElement.innerHTML = `${truncatedText}<span style="display: none;">${moreText}</span> <a href="#" onclick="this.previousSibling.style.display='inline';this.style.display='none';">more</a>`;

              // const textElement = document.createElement('p');
              // textElement.innerHTML = `<span>${truncatedText}</span><span style="display: none;">${moreText}</span> <a href="#" onclick="this.previousSibling.style.display='inline';this.style.display='none';">more</a>`;

              const textElement = document.createElement("p");
              textElement.innerHTML = `<span>${truncatedText}</span><span style="display: none;">${moreText}</span>`;
              const moreLink = document.createElement("a");
              moreLink.href = "#";
              moreLink.textContent = "more";
              moreLink.onclick = function () {
                this.previousSibling.style.display = "inline";
                this.style.display = "none";
              };
              textElement.appendChild(moreLink);

              const linkElement = document.createElement("a");
              // linkElement.href = node.relationships.SOURCE.nodeId;
              let nodeId = node.relationships.SOURCE.nodeId;
              nodeId = nodeId.split("||")[0]; // This line splits the nodeId at '||' and takes the first part
              linkElement.href = "#"; // Change this to '#' to prevent the default link behavior
              linkElement.textContent = "Go to file: " + nodeId;
            
              // Add an event listener to the link
              linkElement.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent the default link behavior
            
                // Fetch the file and download it
                fetch(`http://localhost:3000/download/${nodeId}`, {
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
                  a.download = nodeId;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                })
                .catch(e => console.error('Error:', e));
              });
            
              nodeElement.appendChild(textElement);
              nodeElement.appendChild(linkElement);
              output.appendChild(nodeElement);
            });

            // Create a button
            const toggleButton = document.createElement("button");
            toggleButton.textContent = "Hide Query Data";

            // Initially, let's assume the data is visible
            let isDataVisible = true;

            toggleButton.onclick = function () {
              // // Get all the child nodes of the output
              // const children = output.childNodes;

              // // Toggle the visibility of each child node
              // for(let i = 0; i < children.length; i++) {
              if (isDataVisible) {
                // If the data is currently visible, hide it
                // children[i].style.display = 'none';
                output.style.display = "none";
                toggleButton.textContent = "Show Query Data";
                output.style.opacity = '0';
              } else {
                // If the data is currently hidden, show it
                // children[i].style.display = '';
                output.style.display = "";
                toggleButton.textContent = "Hide Query Data";
                output.style.opacity = '1';
              }

              // Toggle the isDataVisible flag
              isDataVisible = !isDataVisible;
            };

            // Add the button to the output
            queryHolder.appendChild(toggleButton);
          })
          .catch((error) => console.error("Error:", error));
  //     }
  //   });
  // });
}
