// ✅ Wait until the submission result shows "Accepted"
function waitForAcceptedSubmission(callback) {
  const observer = new MutationObserver(() => {
    const acceptedElement = document.querySelector('span[data-e2e-locator="submission-result"]');
    const isAccepted = acceptedElement && acceptedElement.innerText === "Accepted";

    if (isAccepted) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ✅ Extract code from editor
function extractCode() {
  const codeElement = document.querySelector("div.view-lines");
  if (!codeElement) return "Code not found.";
  return Array.from(codeElement.querySelectorAll("div.view-line"))
    .map((line) => line.innerText)
    .join("\n");
}

// ✅ Extract title and problem number
function extractTitleAndNumber() {
  const titleElement = document.querySelector('div.text-title-large a[href^="/problems/"]');
  const fullTitle = titleElement?.innerText || "Not found";
  let problemNumber = "N/A";
  let problemName = "N/A";

  if (fullTitle.includes(".")) {
    const parts = fullTitle.split(".");
    problemNumber = parts[0].trim();
    problemName = parts.slice(1).join(".").trim();
  }

  return { fullTitle, problemNumber, problemName };
}

// ✅ Extract difficulty
function extractDifficulty() {
  const difficultyElement = document.querySelector('div.text-difficulty-easy, div.text-difficulty-medium, div.text-difficulty-hard');
  return difficultyElement?.innerText || "Unknown";
}

// ✅ Extract topics
function extractTopics() {
  return Array.from(document.querySelectorAll('a[href^="/tag/"]')).map(el => el.innerText.trim());
}

// ✅ Extract constraints like time and space complexity
function extractConstraints() {
  const rawConstraints = Array.from(document.querySelectorAll("li code")).map(el => el.innerText.trim());
  const filtered = rawConstraints.filter(line =>
    /(time|space)\s*complexity/i.test(line) || /O\([^)]*\)/.test(line)
  );
  return filtered;
}

// ✅ Extract examples from the description
function extractExamples() {
  const examples = [];
  const preTags = Array.from(document.querySelectorAll("pre"));

  preTags.forEach((pre, i) => {
    const text = pre.innerText;
    const input = (text.match(/Input:\s*(.+)/) || [])[1]?.trim() || "";
    const output = (text.match(/Output:\s*(.+)/) || [])[1]?.trim() || "";
    const explanation = (text.match(/Explanation:\s*([\s\S]*)/) || [])[1]?.trim() || "";

    if (input && output) {
      examples.push({
        exampleNumber: i + 1,
        input,
        output,
        explanation,
      });
    }
  });

  return examples;
}

// ✅ Extract runtime, memory, and performance percentages
function extractRuntimes() {
  const runtimeElements = document.querySelectorAll('.text-sd-foreground.text-lg.font-semibold');
  return Array.from(runtimeElements).map(element => element.innerText.trim());
}

// ✅ Combine all extractions
function extractProblemInfo() {
  const { fullTitle, problemNumber, problemName } = extractTitleAndNumber();
  const submittedCode = extractCode();
  const difficulty = extractDifficulty();
  const topics = extractTopics();
  const constraints = extractConstraints();
  const examples = extractExamples();
  const runtimes = extractRuntimes();

  return {
    fullTitle,
    problemNumber,
    problemName,
    submittedCode,
    difficulty,
    topics,
    constraints,
    examples,
    runtimes
  };
}

// ✅ Wait and run on Accepted submissions
console.log("🚀 LeetCode Extractor Loaded");
waitForAcceptedSubmission(() => {
  const data = extractProblemInfo();
  console.log("✅ Accepted Submission Extracted:", data);

  // ✅ Store in localStorage (optional)
  localStorage.setItem("lastAcceptedSubmission", JSON.stringify(data));

  // You could also send to Google Sheets or backend here
});
