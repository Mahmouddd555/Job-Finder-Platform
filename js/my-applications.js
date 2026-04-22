let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    if (currentUser.accountType === "admin") {
        alert("Admins should use Applied Jobs page!");
        window.location.href = "applied_jobs.html";
        return;
    }

    setupFilters();
    loadMyApplications();
    loadStats();
    checkNotifications();
});

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadMyApplications();
        });
    });
}

function checkNotifications() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const userNotifications = notifications.filter(n =>
        n.userEmail === currentUser.email && !n.read
    );

    if (userNotifications.length > 0) {
        const latestNotification = userNotifications[userNotifications.length - 1];
        showNotificationToast(latestNotification.message, latestNotification.status === 'approved' ? 'success' : 'error');

        notifications.forEach(n => {
            if (n.userEmail === currentUser.email) n.read = true;
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }
}

function showNotificationToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `<i class="fas fa-bell"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function loadStats() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    if (!currentUser) return;

    const userApplications = applications.filter(app =>
        app.email === currentUser.email ||
        app.fullname === currentUser.username
    );

    const totalApps = userApplications.length;
    const approved = userApplications.filter(app => app.status === "approved").length;
    const pending = userApplications.filter(app => app.status === "pending" || !app.status).length;
    const rejected = userApplications.filter(app => app.status === "rejected").length;

    document.getElementById("totalApplications").textContent = totalApps;
    document.getElementById("approvedCount").textContent = approved;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("rejectedCount").textContent = rejected;
}

function loadMyApplications() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const container = document.getElementById("myApplicationsContainer");

    if (!container) return;

    if (!currentUser) {
        container.innerHTML = `<div class="empty-state"><h3>Please Login</h3></div>`;
        return;
    }

    let userApplications = applications.filter(app =>
        app.email === currentUser.email ||
        app.fullname === currentUser.username
    );

    // Apply filter
    if (currentFilter !== 'all') {
        userApplications = userApplications.filter(app => {
            const status = app.status || 'pending';
            if (currentFilter === 'pending') return status === 'pending' || !app.status;
            return status === currentFilter;
        });
    }

    if (userApplications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No Applications Found</h3>
                <p>${currentFilter === 'all' ? "You haven't applied for any jobs yet." : "No applications with this status."}</p>
                ${currentFilter === 'all' ? '<a href="job-Search.html" class="btn-main">Browse Jobs</a>' : '<button class="btn-main" onclick="clearFilter()">View All</button>'}
            </div>
        `;
        return;
    }

    userApplications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    let tableHTML = `
        <div class="table-responsive">
            <table class="applications-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>My Experience</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;

    userApplications.forEach((app, index) => {
        const job = jobs.find(j => j.id == app.jobId) || {};

        let statusBadge = '';
        if (app.status === 'approved') {
            statusBadge = '<span class="status-badge approved">Approved</span>';
        } else if (app.status === 'rejected') {
            statusBadge = '<span class="status-badge rejected">Rejected</span>';
        } else {
            statusBadge = '<span class="status-badge pending">Pending</span>';
        }

        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(job.title || app.jobTitle || 'Unknown')}</strong></td>
                <td>${escapeHtml(app.company || job.company || '—')}</td>
                <td>${formatDate(app.appliedDate)}</td>
                <td>${app.experience || 0} years</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table></div>`;
    container.innerHTML = tableHTML;
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

function clearFilter() {
    currentFilter = 'all';
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    filterBtns[0].classList.add('active');
    loadMyApplications();
}