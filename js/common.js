document.addEventListener("DOMContentLoaded", function () {

    // ========== DARK MODE WITH LOCALSTORAGE PERSISTENCE ==========
    const darkModePreference = localStorage.getItem("darkMode");

    if (darkModePreference === "enabled") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else if (darkModePreference === "disabled") {
        document.documentElement.removeAttribute("data-theme");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Optional: respect system preference if no saved preference
        document.documentElement.setAttribute("data-theme", "dark");
    }

    const authArea = document.getElementById("authArea");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    //only admin links
    const adminLinks = document.querySelectorAll(".admin-only");
    //only user links
    const userOnlyLinks = document.querySelectorAll(".user-only");
    // 
    const adminCards = document.querySelectorAll(".admin-only-card");

    console.log("Current User:", currentUser);
    console.log("Admin Links Found:", adminLinks.length);
    console.log("User Only Links Found:", userOnlyLinks.length);

    if (authArea) {
        if (currentUser) {
            authArea.innerHTML = `
                <div class="user-welcome">
                    <span>👋 Welcome, <strong>${currentUser.username}</strong></span>
                    <button id="logoutBtn" class="logout-btn">Logout</button>
                </div>
            `;

            document.getElementById("logoutBtn").addEventListener("click", function () {
                localStorage.removeItem("currentUser");
                window.location.href = "login.html";
            });
        }
    }

    adminLinks.forEach(link => {
        link.style.display = "none";
        console.log("Hidden admin link:", link.href);
    });

    userOnlyLinks.forEach(link => {
        link.style.display = "none";
        console.log("Hidden user link:", link.href);
    });


    if (currentUser) {
        if (currentUser.accountType === "admin") {

            adminLinks.forEach(link => {
                link.style.display = "inline-block";
                console.log("Showing admin link for admin user:", link.href);
            });

            userOnlyLinks.forEach(link => {
                link.style.display = "inline-block";
                console.log("Showing user link for admin user:", link.href);
            });
        } else if (currentUser.accountType === "user") {

            userOnlyLinks.forEach(link => {
                link.style.display = "inline-block";
                console.log("Showing user link for regular user:", link.href);
            });

        }
    } else {

        userOnlyLinks.forEach(link => {
            link.style.display = "inline-block";
        });
    }

    if (adminCards.length > 0) {
        if (currentUser && currentUser.accountType === "admin") {
            adminCards.forEach(card => {
                card.style.display = "block";
            });
            document.body.classList.add("admin-logged-in");
        } else {
            adminCards.forEach(card => {
                card.style.display = "none";
            });
        }
    }

});

const darkBtn = document.createElement('button');
darkBtn.innerHTML = '🌙';
darkBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:var(--gradient-1);border:none;border-radius:50%;width:55px;height:55px;cursor:pointer;font-size:1.5rem;box-shadow:var(--shadow-glow);transition:all 0.3s ease;';

// Check current mode and set button icon
if (document.documentElement.getAttribute('data-theme') === 'dark') {
    darkBtn.innerHTML = '☀️';
    darkBtn.style.background = 'var(--gradient-2)';
}

document.body.appendChild(darkBtn);

darkBtn.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        darkBtn.innerHTML = '🌙';
        darkBtn.style.background = 'var(--gradient-1)';
        localStorage.setItem("darkMode", "disabled");
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkBtn.innerHTML = '☀️';
        darkBtn.style.background = 'var(--gradient-2)';
        localStorage.setItem("darkMode", "enabled");
    }
});

darkBtn.addEventListener('mouseenter', () => {
    darkBtn.style.transform = 'scale(1.1) rotate(10deg)';
});
darkBtn.addEventListener('mouseleave', () => {
    darkBtn.style.transform = 'scale(1) rotate(0deg)';
});