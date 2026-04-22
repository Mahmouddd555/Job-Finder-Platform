document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let validUser = users.find(user =>
            user.username === username && user.password === password
        );

        if (validUser) {

            alert("Login successful ✅");

            localStorage.setItem("currentUser", JSON.stringify(validUser));

            if (validUser.accountType === "admin") {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "index.html";
            }

        } else {
            alert("Invalid username or password ❌");
        }

    });

});