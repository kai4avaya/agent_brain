
function sendAI() {
    const query = document.getElementById("aiInput").value;
    query.textContent = "";
    const url = `http://localhost:3000/ai?query=${encodeURIComponent(query)}`;
    // caches.open("ai_llama").then((cache) => {
      // cache.match(url).then((cachedResponse) => {
        // if (cachedResponse) {
          const aiOutput = document.getElementById("aiOutput");
          aiOutput.innerHTML += `<p>User: ${query}</p>`;
        //   aiOutput.innerHTML += `<p>AI: ${response}</p>`;
        // } else {
          fetch(url, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
            .then((response) => {
            //   cache.put(url, response.clone());
              return response.json();
            })
            .then((data) => {
              const aiOutput = document.getElementById("aiOutput");
            //   aiOutput.innerHTML += `<p>User: ${query}</p>`;
              aiOutput.innerHTML += `<p>AI: ${data.response}</p>`;
            })
            .catch((error) => console.error("Error:", error));
        // }
      // });
    // });
  }

  
//   window.onload = function () {
//     aiInput.addEventListener('keydown', function(event) {
//         if (event.key === 'Enter') {
//           event.preventDefault(); // Prevent the default action (form submission)
//           sendAI();
//         }
//       });
//   }