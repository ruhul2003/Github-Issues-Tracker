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
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;

            // Initially show all issues and update counts
            displayIssues(allIssues);
            updateCounts(allIssues);
        })
        .catch(err => console.error("Error fetching issues:", err));
};

// ==============================
// Display issues
// ==============================
const displayIssues = (issues) => {
    const container = document.getElementById("issues-container");
    container.innerHTML = ""; // clear previous issues

    if (issues.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center mt-5">No issues found</p>`;
        return;
    }

    issues.forEach(issue => {
        const borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";

        const priorityColor =
            issue.priority === "high" ? "bg-red-100 text-red-500" :
            issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
            "bg-gray-200 text-gray-500";

        const labels = issue.labels.map(label => {
            if (label === "bug") return `<span class="text-red-500 bg-red-100 px-2 py-1 rounded-full text-xs">BUG</span>`;
            if (label === "help wanted") return `<span class="text-orange-500 bg-orange-100 px-2 py-1 rounded-full text-xs">HELP WANTED</span>`;
            if (label === "enhancement") return `<span class="text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs">ENHANCEMENT</span>`;
            return "";
        }).join("");

        const card = document.createElement("div");
        card.className = `bg-white shadow-md rounded-lg p-5 border-t-4 ${borderColor}`;

        card.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="text-green-500 text-xl">
                    <i class="fa-regular fa-circle-check"></i>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityColor}">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
            <h2 class="font-bold mt-3 text-[16px]">${issue.title}</h2>
            <p class="text-gray-500 text-sm mt-2">${issue.description.substring(0,80)}...</p>
            <div class="flex gap-2 mt-3">${labels}</div>
            
                <p>#${issue.id} by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        container.appendChild(card);
    });
};

// ==============================
// Update counts section
// ==============================
const updateCounts = (issues) => {
    // Only update the main "All Issues" count
    document.getElementById("all-count").innerText = issues.length;
};

// ==============================
// Tab Buttons
// ==============================
const tabButtons = document.querySelectorAll(".tab button");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Active button highlight
        tabButtons.forEach(btn => btn.classList.remove("btn-primary"));
        button.classList.add("btn-primary");

        const tabText = button.innerText.toLowerCase();

        let filtered;
        if (tabText === "all") filtered = allIssues;
        else filtered = allIssues.filter(issue => issue.status === tabText);

        // Show filtered issues and update only the All Issues count
        displayIssues(filtered);
        updateCounts(filtered);
    });
});

// ==============================
// Page load
// ==============================
loadIssues();