// ==============================
// API URL
// ==============================
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// Global variable to store all issues
let allIssues = [];

// ==============================
// Load issues from API
// ==============================
const loadIssues = () => {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      allIssues = data.data;
      displayIssues(allIssues);
      updateCounts(allIssues);
    })
    .catch((err) => console.error("Error fetching issues:", err));
};

// ==============================
// Open Modal Function
// ==============================
const openModal = (issue) => {
  // Set Title and Description
  document.getElementById("modal-title").innerText = issue.title;
  document.getElementById("modal-description").innerText = issue.description;

  // Status Badge Logic
  const statusEl = document.getElementById("modal-status");
  statusEl.innerText = issue.status;
  statusEl.className = `px-4 py-1 rounded-full text-white text-sm capitalize ${
    issue.status === "open" ? "bg-green-500" : "bg-purple-500"
  }`;

  // Author and Date info
  document.getElementById("modal-author-date").innerText = 
    `Opened by ${issue.author} • ${new Date(issue.createdAt).toLocaleDateString()}`;

  // Labels logic for Modal
  const labelContainer = document.getElementById("modal-labels");
  labelContainer.innerHTML = issue.labels
    .map((label) => {
      if (label === "bug")
        return `<span class="text-red-500 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-sm font-bold">BUG</span>`;
      if (label === "help wanted")
        return `<span class="text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-sm font-bold">HELP WANTED</span>`;
      if (label === "enhancement")
        return `<span class="text-green-500 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-sm font-bold">ENHANCEMENT</span>`;
      return "";
    })
    .join("");

  // Assignee and Priority
  document.getElementById("modal-assignee").innerText = issue.author;

  const priorityEl = document.getElementById("modal-priority");
  priorityEl.innerText = issue.priority.toUpperCase();
  priorityEl.className = `px-6 py-1.5 rounded-lg text-white font-bold inline-block ${
    issue.priority === "high" ? "bg-red-500" : 
    issue.priority === "medium" ? "bg-yellow-500" : "bg-gray-400"
  }`;

  // Show the modal via checkbox
  document.getElementById("issue-modal").checked = true;
};

// ==============================
// Display issues
// ==============================
const displayIssues = (issues) => {
  const container = document.getElementById("issues-container");
  container.innerHTML = ""; 

  if (issues.length === 0) {
    container.innerHTML = `<p class="text-gray-500 text-center mt-5">No issues found</p>`;
    return;
  }

  issues.forEach((issue) => {
    const borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";

    const priorityColor =
      issue.priority === "high"
        ? "bg-red-100 text-red-500"
        : issue.priority === "medium"
        ? "bg-yellow-100 text-yellow-600"
        : "bg-gray-200 text-gray-500";

    const labels = issue.labels
      .map((label) => {
        if (label === "bug")
          return `<span class="text-red-500 bg-red-100 px-2 py-1 rounded-full text-xs font-bold">BUG</span>`;
        if (label === "help wanted")
          return `<span class="text-orange-500 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold">HELP WANTED</span>`;
        if (label === "enhancement")
          return `<span class="text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">ENHANCEMENT</span>`;
        return "";
      })
      .join("");

    const card = document.createElement("div");
    // Added cursor-pointer and h-full for alignment
    card.className = `bg-white shadow-md rounded-lg border-t-4 ${borderColor} cursor-pointer hover:shadow-lg transition-all h-full`;

    card.innerHTML = `
      <div class="flex flex-col h-full p-5">
        <div class="flex justify-between items-start mb-4">
            <div class="${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'} text-xl">
                <i class="${issue.status === 'open' ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-check'}"></i>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${priorityColor}">
                ${issue.priority.toUpperCase()}
            </span>
        </div>

        <div class="flex-grow mb-6">
            <h2 class="font-bold text-[16px] leading-tight text-gray-800">
                ${issue.title}
            </h2>
            <p class="text-gray-500 text-[13px] mt-2 leading-relaxed">
                ${issue.description.substring(0, 80)}...
            </p>

            <div class="flex flex-wrap gap-2 mt-4">
                ${labels}
            </div>
        </div>

        <div class="border-t pt-4 text-[12px] text-slate-400 space-y-1">
            <div class="font-medium">#${issue.id} by ${issue.author}</div>
            <div>${new Date(issue.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    `;

    // Add click event to open modal
    card.addEventListener("click", () => openModal(issue));
    
    container.appendChild(card);
  });
};

// ==============================
// Update counts section
// ==============================
const updateCounts = (issues) => {
  document.getElementById("all-count").innerText = issues.length;
};

// ==============================
// Tab Buttons
// ==============================
const tabButtons = document.querySelectorAll(".tab button");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("btn-primary"));
    button.classList.add("btn-primary");

    const tabText = button.innerText.toLowerCase();

    let filtered;
    if (tabText === "all") filtered = allIssues;
    else filtered = allIssues.filter((issue) => issue.status === tabText);

    displayIssues(filtered);
    updateCounts(filtered);
  });
});

// Page load
loadIssues();