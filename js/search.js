document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("searchBtn");


    loadAndDisplayAllJobs();

    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        let value = searchInput.value.toLowerCase().trim();

        if (value === "") {
            alert("🔍 Please enter a search term!");
            return;
        }

        searchJobs(value);
    });

    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            searchBtn.click();
        }
    });
});

function getAllJobs() {
    let dynamicJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    return dynamicJobs;
}


function loadAndDisplayAllJobs() {
    const allJobs = getAllJobs();
    displayJobsByCategory(allJobs);
}

function displayJobsByCategory(jobs) {
    const container = document.getElementById("jobsContainer");
    if (!container) return;

    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="no-jobs-found">
                <i class="fas fa-frown"></i>
                <h3>No Jobs Found</h3>
                <p>No jobs available at the moment. Please add jobs from admin dashboard.</p>
            </div>
        `;
        return;
    }

    const categories = {};
    jobs.forEach(job => {
        const cat = job.category || "All Jobs";
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push(job);
    });

    let html = '';

    for (const [category, categoryJobs] of Object.entries(categories)) {
        html += `
            <div class="job-category-section">
                <h2 class="category-title">
                    <i class="fas fa-folder-open"></i> ${category}
                </h2>
                <div class="jobs-grid">
        `;

        categoryJobs.forEach(job => {
            html += `
                <div class="job-search-card" data-job-id="${job.id}" onclick="viewJobDetails(${job.id})">
                    <div class="job-search-header">
                        <h3>${escapeHtml(job.title)}</h3>
                        <span class="job-status ${job.status}">${job.status === 'open' ? '🟢 Open' : '🔴 Closed'}</span>
                    </div>
                    <div class="job-search-company">
                        <i class="fas fa-building"></i> ${escapeHtml(job.company)}
                    </div>
                    <div class="job-search-salary">
                        <i class="fas fa-dollar-sign"></i> $${(job.salary || 0).toLocaleString()}
                    </div>
                    <div class="job-search-description">
                        ${escapeHtml(job.description || 'No description available').substring(0, 100)}${(job.description || '').length > 100 ? '...' : ''}
                    </div>
                    <button class="view-job-btn" onclick="event.stopPropagation(); viewJobDetails(${job.id})">
                        View Details <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function searchJobs(searchTerm) {
    const allJobs = getAllJobs();
    const searchLower = searchTerm.toLowerCase();

    const filteredJobs = allJobs.filter(job => {
        if (job.title && job.title.toLowerCase().includes(searchLower)) return true;
        if (job.company && job.company.toLowerCase().includes(searchLower)) return true;
        if (job.description && job.description.toLowerCase().includes(searchLower)) return true;
        if (job.requirements && Array.isArray(job.requirements) && job.requirements.some(req => req.toLowerCase().includes(searchLower))) return true;
        return false;
    });

    if (filteredJobs.length === 0) {
        const container = document.getElementById("jobsContainer");
        if (container) {
            container.innerHTML = `
                <div class="no-jobs-found">
                    <i class="fas fa-search"></i>
                    <h3>No jobs found for "${escapeHtml(searchTerm)}"</h3>
                    <p>Try searching with different keywords like "developer", "engineer", or "manager"</p>
                    <button onclick="loadAndDisplayAllJobs()" class="reset-btn">Show All Jobs</button>
                </div>
            `;
        }
        return;
    }

    displayJobsByCategory(filteredJobs);
}

// ========== View job details ==========
function viewJobDetails(jobId) {
    localStorage.setItem("selectedJobId", jobId);
    window.location.href = "job-details.html";
}

// ========== Helper: Escape HTML ==========
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== Show All Jobs ==========
function showAllJobs() {
    loadAndDisplayAllJobs();
    const searchInput = document.getElementById("search");
    if (searchInput) searchInput.value = '';
}