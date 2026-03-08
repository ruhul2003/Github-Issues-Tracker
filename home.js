// ==============================
// API URL
// ==============================
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// সব issues store করার জন্য global variable
let allIssues = [];

// ==============================
// Load issues from API
// ==============================
const loadIssues = () => {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            // সব issue store
            allIssues = data.data;

            // default এ সব issue show
            displayIssues(allIssues);
        })
        .catch(err => console.error("Error fetching issues:", err));
};

// ==============================
// Display issues
// ==============================
const displayIssues = (issues) => {
    const container = document.getElementById("issues-container");
    container.innerHTML = ""; // clear previous issues

    issues.forEach(issue => {
        // Status border color
        const borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";

        // Priority color
        const priorityColor =
            issue.priority === "high" ? "bg-red-100 text-red-500" :
            issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
            "bg-gray-200 text-gray-500";

        // Labels badges
        const labels = issue.labels.map(label => {
            if (label === "bug") return `<span class="text-red-500 bg-red-100 px-2 py-1 rounded-full text-xs">BUG</span>`;
            if (label === "help wanted") return `<span class="text-orange-500 bg-orange-100 px-2 py-1 rounded-full text-xs">HELP WANTED</span>`;
            if (label === "enhancement") return `<span class="text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs">ENHANCEMENT</span>`;
            return ""; // in case of unknown label
        }).join("");

        // Card create
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
            <div class="border-t mt-4 pt-3 text-sm text-gray-500">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;

        container.appendChild(card);
    });
};

// ==============================
// Tab Buttons
// ==============================
const tabButtons = document.querySelectorAll(".tab button");

// প্রতিটা button এ event add
tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Active button change
        tabButtons.forEach(btn => btn.classList.remove("btn-primary"));
        button.classList.add("btn-primary");

        // Filter issues based on button text
        const tabText = button.innerText.toLowerCase();

        if (tabText === "all") {
            displayIssues(allIssues);
        } else {
            const filtered = allIssues.filter(issue => issue.status === tabText);
            displayIssues(filtered);
        }
    });
});

// ==============================
// Page load
// ==============================
loadIssues();