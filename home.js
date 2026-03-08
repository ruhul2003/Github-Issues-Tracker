// API URLS

const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";
const SINGLE_ISSUE_API = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";

// Global variable to store all issues
let allIssues = [];


// Load issues from API (Initial Load)

const loadIssues = () => {
    const container = document.getElementById("issues-container");
    
    container.innerHTML = `
        <div id="loading-spinner" class="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
            <div class="flex flex-col items-center p-10">
                <span class="loading loading-spinner w-24 text-primary"></span>
                <h2 class="text-2xl font-bold text-gray-800 mt-6">Loading Issues...</h2>
                <p class="text-gray-500 mt-2">Fetching the latest data from the tracker</p>
            </div>
        </div>
    `;

    fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
            allIssues = data.data;
            displayIssues(allIssues);
            updateCounts(allIssues);
        })
        .catch((err) => {
            console.error("Error fetching issues:", err);
            container.innerHTML = `<div class="col-span-4 text-center py-20"><p class="text-red-500">Failed to load issues.</p></div>`;
        });
};


// Open Modal Function (Using Single Issue API)

const openModal = (id) => {
    // 1. Open the modal shell first
    const modalCheckbox = document.getElementById("issue-modal");
    modalCheckbox.checked = true;

    // 2. Show a loading state inside the modal while fetching
    document.getElementById("modal-title").innerText = "Loading details...";
    document.getElementById("modal-description").innerText = "";
    document.getElementById("modal-labels").innerHTML = '<span class="loading loading-dots loading-md"></span>';

    // 3. Fetch specific issue data
    fetch(`${SINGLE_ISSUE_API}${id}`)
        .then(res => res.json())
        .then(response => {
            const issue = response.data;


            document.getElementById("modal-title").innerText = issue.title;
            document.getElementById("modal-description").innerText = issue.description;

  
            const statusEl = document.getElementById("modal-status");
            statusEl.innerText = issue.status;
            statusEl.className = `px-4 py-1 rounded-full text-white text-sm capitalize ${
                issue.status === "open" ? "bg-green-500" : "bg-purple-500"
            }`;

            // Author and Date info
            document.getElementById("modal-author-date").innerText = 
                `Opened by ${issue.author} • ${new Date(issue.createdAt).toLocaleDateString()}`;

            // Labels
            const labelContainer = document.getElementById("modal-labels");
            labelContainer.innerHTML = issue.labels
                .map((label) => {
                    if (label === "bug") return `<span class="text-red-500 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-sm font-bold">BUG</span>`;
                    if (label === "help wanted") return `<span class="text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-sm font-bold">HELP WANTED</span>`;
                    if (label === "enhancement") return `<span class="text-green-500 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-sm font-bold">ENHANCEMENT</span>`;
                    return "";
                }).join("");


            document.getElementById("modal-assignee").innerText = issue.author;
            const priorityEl = document.getElementById("modal-priority");
            priorityEl.innerText = issue.priority.toUpperCase();
            priorityEl.className = `px-6 py-1.5 rounded-lg text-white font-bold inline-block ${
                issue.priority === "high" ? "bg-red-500" : 
                issue.priority === "medium" ? "bg-yellow-500" : "bg-gray-400"
            }`;
        })
        .catch(err => {
            console.error("Error fetching single issue:", err);
            document.getElementById("modal-title").innerText = "Error Loading Issue";
        });
};


// Display issues
const displayIssues = (issues) => {
    const container = document.getElementById("issues-container");
    container.innerHTML = ""; 

    if (!issues || issues.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center mt-10 col-span-full text-lg">No issues found.</p>`;
        return;
    }

    issues.forEach((issue) => {
        const borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
        const priorityColor =
            issue.priority === "high" ? "bg-red-100 text-red-500" : 
            issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" : 
            "bg-gray-200 text-gray-500";

        const labels = issue.labels
            .map((label) => {
                if (label === "bug") return `<span class="text-red-500 bg-red-100 px-2 py-1 rounded-full text-[10px] font-bold">BUG</span>`;
                if (label === "help wanted") return `<span class="text-orange-500 bg-orange-100 px-2 py-1 rounded-full text-[10px] font-bold">HELP WANTED</span>`;
                if (label === "enhancement") return `<span class="text-green-500 bg-green-100 px-2 py-1 rounded-full text-[10px] font-bold">ENHANCEMENT</span>`;
                return "";
            }).join("");

        const card = document.createElement("div");
        card.className = `bg-white shadow-md rounded-lg border-t-4 ${borderColor} cursor-pointer hover:shadow-lg transition-all h-full`;

        card.innerHTML = `
            <div class="flex flex-col h-full p-5">
                <div class="flex justify-between items-start mb-4">
                    <div class="${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'} text-xl">
                        <i class="fa-regular fa-circle-check"></i>
                    </div>
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${priorityColor}">
                        ${issue.priority.toUpperCase()}
                    </span>
                </div>
                <div class="flex-grow mb-6">
                    <h2 class="font-bold text-[16px] leading-tight text-gray-800">${issue.title}</h2>
                    <p class="text-gray-500 text-[13px] mt-2 leading-relaxed">${issue.description.substring(0, 80)}...</p>
                    <div class="flex flex-wrap gap-2 mt-4">${labels}</div>
                </div>
                <div class="border-t pt-4 text-[12px] text-slate-400 space-y-1">
                    <div class="font-medium">#${issue.id} by ${issue.author}</div>
                    <div>${new Date(issue.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        `;


        card.addEventListener("click", () => openModal(issue.id));
        container.appendChild(card);
    });
};


// Update counts section
const updateCounts = (issues) => {
    const countEl = document.getElementById("all-count");
    if (countEl) countEl.innerText = issues.length;
};


// Tab Buttons

const tabButtons = document.querySelectorAll(".tab button");
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("btn-primary"));
        button.classList.add("btn-primary");

        const tabText = button.innerText.toLowerCase();
        let filtered = tabText === "all" ? allIssues : allIssues.filter((issue) => issue.status === tabText);

        displayIssues(filtered);
        updateCounts(filtered);
    });
});


// Search Functionality

const searchBtn = document.getElementById("search-btn");
const searchInput = document.querySelector('input[placeholder="Search issues..."]');

const handleSearch = () => {
    const searchText = searchInput.value.trim();
    const container = document.getElementById("issues-container");

    if (!searchText) {
        displayIssues(allIssues);
        updateCounts(allIssues);
        return;
    }

    container.innerHTML = `<div class="col-span-4 flex flex-col items-center py-10"><span class="loading loading-spinner loading-lg text-primary"></span></div>`;

    fetch(`${SEARCH_API_URL}${encodeURIComponent(searchText)}`)
        .then(res => res.json())
        .then(data => {
            displayIssues(data.data);
            updateCounts(data.data);
        })
        .catch(err => console.error("Search error:", err));
};

if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSearch(); });
}

// Initial Page Load
loadIssues();