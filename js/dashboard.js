console.log("📊 Admin Dashboard LOADED");

document.addEventListener("DOMContentLoaded", function () {
    loadDashboardStats();
    loadUsersTable();
    loadRecentActivity();
});

function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    const adminCount = users.filter(u => u.accountType === "admin").length;

    const userCount = users.filter(u => u.accountType === "user").length;

    const openJobs = jobs.filter(j => j.status === "open").length;

    const appCount = applications.length;

    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("adminCount").textContent = adminCount;
    document.getElementById("regularUsers").textContent = userCount;
    document.getElementById("totalJobs").textContent = jobs.length;
    document.getElementById("openJobs").textContent = openJobs;
    document.getElementById("totalApplications").textContent = appCount;
}

function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const tbody = document.getElementById("usersTableBody");

    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-users" style="font-size: 40px; opacity: 0.3; margin-bottom: 10px; display: block;"></i>
                    No registered users yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";

    users.forEach((user, index) => {
        const row = tbody.insertRow();

        const isAdmin = user.accountType === "admin";
        const badgeColor = isAdmin ?
            'background: rgba(155, 89, 182, 0.15); color: #8e44ad; border: 1px solid rgba(155, 89, 182, 0.3);' :
            'background: rgba(52, 152, 219, 0.15); color: #2980b9; border: 1px solid rgba(52, 152, 219, 0.3);';

        const badgeText = isAdmin ? '👑 Admin' : '👤 User';

        const joinDate = user.joinDate || "—";

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.email || "—"}</td>
            <td>
                <span style="
                    ${badgeColor}
                    padding: 6px 14px;
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 12px;
                    display: inline-block;
                ">
                    ${badgeText}
                </span>
            </td>
            <td>${user.companyName || "—"}</td>
            <td>
                <button onclick="viewUserDetails('${user.username}')" class="btn-view-user" style="
                    background: rgba(30, 144, 255, 0.1);
                    border: 1px solid rgba(30, 144, 255, 0.3);
                    color: #1e90ff;
                    padding: 6px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    transition: all 0.3s;
                ">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
    });
}

function loadRecentActivity() {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const activityList = document.getElementById("activityList");
    if (!activityList) return;

    let activities = [];

    const recentJobs = [...jobs].reverse().slice(0, 3);
    recentJobs.forEach(job => {
        activities.push({
            type: 'job',
            icon: '💼',
            text: `New job posted: <strong>${job.title}</strong> at ${job.company}`,
            time: job.createdAt || 'Recently'
        });
    });

    const recentApps = [...applications].reverse().slice(0, 3);
    recentApps.forEach(app => {
        activities.push({
            type: 'application',
            icon: '📝',
            text: `<strong>${app.fullname}</strong> applied for ${app.title}`,
            time: app.date || 'Recently'
        });
    });

    const recentUsers = [...users].reverse().slice(0, 3);
    recentUsers.forEach(user => {
        activities.push({
            type: 'user',
            icon: '👋',
            text: `<strong>${user.username}</strong> joined as ${user.accountType}`,
            time: user.joinDate || 'Recently'
        });
    });


    activities = activities.slice(0, 8);

    if (activities.length === 0) {
        activityList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #666;">
                <i class="fas fa-history" style="font-size: 40px; opacity: 0.3; margin-bottom: 10px;"></i>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }

    activityList.innerHTML = activities.map(act => `
        <div class="activity-item" style="
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 12px;
            margin-bottom: 10px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        ">
            <span style="font-size: 24px;">${act.icon}</span>
            <div style="flex: 1;">
                <p style="margin: 0; color: #1a2a3a;">${act.text}</p>
                <small style="color: #666; font-size: 11px;">${act.time}</small>
            </div>
        </div>
    `).join('');
}

function viewUserDetails(username) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);

    if (!user) {
        alert("❌ User not found!");
        return;
    }

    alert(`
👤 User Details:
━━━━━━━━━━━━━━━━━━━━
Username: ${user.username}
Email: ${user.email || '—'}
Account Type: ${user.accountType}
Company: ${user.companyName || '—'}
    `);
}

setInterval(() => {
    if (document.visibilityState === 'visible') {
        loadDashboardStats();
        loadRecentActivity();
    }
}, 30000);