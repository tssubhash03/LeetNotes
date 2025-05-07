chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LEETCODE_DATA") {
    const { title, difficulty, topics, code } = message.payload;

    document.getElementById("output").innerHTML = `
      <strong>Title:</strong> ${title}<br/>
      <strong>Difficulty:</strong> ${difficulty}<br/>
      <strong>Topics:</strong> ${topics}<br/>
      <strong>Code:</strong>
      <pre>${code}</pre>
    `;
  }
});
