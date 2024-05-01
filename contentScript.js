const GROQ_API_KEY = process.env.GROQ_API_KEY;

function generateIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("tabindex", "-1");
  svg.setAttribute("title", "AutoAwesome");
  svg.style.width = "12px";
  svg.style.height = "12px";
  svg.style.marginRight = "2px";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25z"
  );

  if (document.querySelector(".sk-client-theme--dark")) {
    // dark mode
    path.setAttribute("fill", "white");
  } else {
    // light mode
    path.setAttribute("fill", "black");
  }

  svg.appendChild(path);

  return svg;
}

const generateMessage = (systemMessage) => {
  const messageEle = document.querySelectorAll("[contenteditable].ql-editor")[0]
    .children[0];

  if (
    !messageEle.innerText ||
    messageEle.innerText.split("\n").filter(Boolean).length === 0
  )
    return;

  const requestData = {
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: messageEle.innerText,
      },
    ],
    model: "llama3-70b-8192",
  };

  fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      messageEle.innerHTML = data.choices[0].message?.content;
      console.log("Content ", data.choices);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};

const timeout = setInterval(() => {
  const toolbar = document.querySelectorAll(".c-texty_buttons");
  if (toolbar.length > 0) {
    clearInterval(timeout);

    const correct = document.createElement("button");

    correct.innerHTML = "correct";

    const professional = document.createElement("button");
    professional.innerHTML = "professional";

    correct.addEventListener("click", () => {
      generateMessage(
        "Fix any spelling or grammar errors in the following message. Only include the corrected message in the response, and don't include this in response 'Here is the corrected message'"
      );
    });

    professional.addEventListener("click", () => {
      generateMessage(
        "Convert the following message to a more professional tone. only include transformed message in the response, and don't include this in response 'Here is the revised message in a more professional tone'"
      );
    });

    const correctWrapper = document.createElement("div");
    correctWrapper.style.display = "flex";
    correctWrapper.style.alignItems = "center";
    correctWrapper.style.marginRight = "10px";

    correctWrapper.appendChild(generateIcon());
    correctWrapper.appendChild(correct);

    const professionalWrapper = document.createElement("div");
    professionalWrapper.style.display = "flex";
    professionalWrapper.style.alignItems = "center";
    professionalWrapper.appendChild(generateIcon());
    professionalWrapper.appendChild(professional);

    if (toolbar[0]) {
      toolbar[0].appendChild(correctWrapper);
      toolbar[0].appendChild(professionalWrapper);
    }
  }
}, 1000);
