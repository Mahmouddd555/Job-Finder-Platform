let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.accountType !== "admin") {
        alert("Access Denied! Admin only.");
        window.location.href = "index.html";
        return;
    }

    setupFilters();
    loadAndDisplay();
});

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadAndDisplay();
        });
    });
}

function loadAndDisplay() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const allJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const allApplications = JSON.parse(localStorage.getItem("applications")) || [];

    const companyJobs = allJobs.filter(job => job.company === currentUser.companyName);
    const companyJobIds = companyJobs.map(job => job.id);

    let companyApplications = allApplications.filter(app => companyJobIds.includes(Number(app.jobId)));

    if (currentFilter !== 'all') {
        companyApplications = companyApplications.filter(app => {
            const status = app.status || 'pending';
            if (currentFilter === 'pending') return status === 'pending' || !app.status;
            return status === currentFilter;
        });
    }

    const allCompanyApps = allApplications.filter(app => companyJobIds.includes(Number(app.jobId)));
    updateStats(companyJobs, allCompanyApps);

    displayTable(companyApplications, companyJobs);
}

function updateStats(companyJobs, companyApplications) {
    const totalApps = document.getElementById("totalApplications");
    const uniqueJobs = document.getElementById("uniqueJobsCount");
    const pendingCount = document.getElementById("pendingCount");

    const pending = companyApplications.filter(app => app.status === "pending" || !app.status).length;

    if (totalApps) totalApps.textContent = companyApplications.length;
    if (uniqueJobs) uniqueJobs.textContent = companyJobs.length;
    if (pendingCount) pendingCount.textContent = pending;
}

function displayTable(applications, companyJobs) {
    const container = document.getElementById("appliedJobsContainer");

    if (!container) return;

    if (applications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No Applications Yet</h3>
                <p>When candidates apply for your jobs, they will appear here.</p>
                <p style="font-size: 13px; margin-top: 10px; color: #6c5ce7;">
                    <i class="fas fa-building"></i> Your Company: ${companyJobs[0]?.company || '—'}
                </p>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <div class="table-responsive">
            <table class="applications-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Candidate</th>
                        <th>Email</th>
                        <th>Job Title</th>
                        <th>Experience</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    applications.forEach((app, index) => {
        const job = companyJobs.find(j => j.id == app.jobId) || {};

        let statusHtml = '';
        if (app.status === 'approved') {
            statusHtml = '<span class="status-badge approved">Approved</span>';
        } else if (app.status === 'rejected') {
            statusHtml = '<span class="status-badge rejected">Rejected</span>';
        } else {
            statusHtml = '<span class="status-badge pending">Pending</span>';
        }

        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(app.fullname)}</strong></td>
                <td>${escapeHtml(app.email)}</td>
                <td>${escapeHtml(job.title || app.jobTitle)}</td>
                <td>${app.experience || 0} years</td>
                <td>${formatDate(app.appliedDate)}</td>
                <td>${statusHtml}</td>
                <td class="action-buttons">
                    <button class="btn-accept" data-id="${app.id}">Accept</button>
                    <button class="btn-reject" data-id="${app.id}">Reject</button>
                    <button class="btn-pending" data-id="${app.id}">Pending</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table></div>`;
    container.innerHTML = tableHTML;


    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', () => updateStatus(btn.dataset.id, 'approved'));
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', () => updateStatus(btn.dataset.id, 'rejected'));
    });

    document.querySelectorAll('.btn-pending').forEach(btn => {
        btn.addEventListener('click', () => updateStatus(btn.dataset.id, 'pending'));
    });
}

function updateStatus(applicationId, newStatus) {
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    const index = applications.findIndex(a => a.id == applicationId);

    if (index !== -1) {
        applications[index].status = newStatus;
        localStorage.setItem("applications", JSON.stringify(applications));

        const app = applications[index];
        const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        const newNotification = {
            id: Date.now(),
            userEmail: app.email,
            jobTitle: app.jobTitle,
            company: app.company,
            status: newStatus,
            message: newStatus === 'approved'
                ? `Your application for "${app.jobTitle}" has been ACCEPTED!`
                : newStatus === 'rejected'
                    ? `Your application for "${app.jobTitle}" has been REJECTED.`
                    : `Your application for "${app.jobTitle}" status has been reset to PENDING.`,
            timestamp: new Date().toISOString(),
            read: false
        };
        notifications.push(newNotification);
        localStorage.setItem("notifications", JSON.stringify(notifications));

        let message = '';
        if (newStatus === 'approved') message = 'Candidate Approved!';
        else if (newStatus === 'rejected') message = 'Candidate Rejected!';
        else message = 'Status set to Pending';

        alert(message);
        loadAndDisplay();
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}