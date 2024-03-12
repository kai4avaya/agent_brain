async function startChat_stream2() {
  const response = await fetch("http://localhost:3000/chat?message=hello", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
 
    const chunk = decoder.decode(value);
    document.getElementById("chat").innerText += chunk;
  }
}


async function startChat_stream() {
  await fetch("http://localhost:3000/chat?message=hello what kinds of things does your store sell?", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) => {
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text();
    })
    .then((result) => {
      //   document.getElementById('output').textContent = result;
      document.getElementById("chat").textContent = result;
    });
}




// let aiOutput; // = document.getElementById("aiOutput");
let aiOutput; //= document.getElementById("aiOutput");

let ai_count = 0;
async function startChat_stream3() {
    const query = document.getElementById("aiInput").value;
    query.textContent = "";
    aiInput.value = "";


    // console.log("aiOutput aiOutput",aiOutput)
    // aiOutput.innerHTML += '<p>AI: thinking...<p>';

    // const aiOutput = document.getElementById("aiOutput");
    aiOutput.innerHTML += `<p id='user${ai_count}'>User: ${query}</p>`;
    aiOutput.innerHTML += `<p id='ai${ai_count}'>AI: thinking...<p>`;

    await fetch(`http://localhost:3000/chat?message=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }
            push();
          },
        });
      })
      .then((stream) => {
        const text =  new Response(stream, {
            headers: { "Content-Type": "text/html" },
          }).text()
        console.log("STREAMS")
        return text;
        
        //new Response(stream, {
        //   headers: { "Content-Type": "text/html" },
        // }).text();
      })
    //   .then((result) => {
    //     console.log("result", aiOutput, result);
    //     //   aiOutput.innerHTML += `<p>User: ${query}</p>`;
    //  //     aiOutput.innerHTML += `<span>AI: ${data.response}</span>`;
    //       const tempAiMessage = document.getElementById(`ai${ai_count}`);
    //       tempAiMessage.innerHTML = `<p>AI: ${' '+result}</p>`;
    //       ai_count += 1;
    //   });
    .then((result) => {
        console.log("result", aiOutput, result);
        const tempAiMessage = document.getElementById(`ai${ai_count}`);
        tempAiMessage.innerHTML = `<p style="opacity: 0; transition: opacity 0.5s;">AI: ${' '+result}</p>`;
        requestAnimationFrame(() => {
          tempAiMessage.firstChild.style.opacity = "1";
        });
        ai_count += 1;
      });
  }

  


window.onload = function () {
    aiOutput = document.getElementById("aiOutput");

    aiInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default action (form submission)
          startChat_stream3();
        }
      });
  }