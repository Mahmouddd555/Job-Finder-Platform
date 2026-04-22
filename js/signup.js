document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");
    const companyNameField = document.getElementById("company_name");
    const userTypeRadios = document.querySelectorAll('input[name="user-type"]');

    function updateCompanyRequirement() {
        const selectedType = document.querySelector('input[name="user-type"]:checked');
        if (selectedType && selectedType.value === "admin") {
            companyNameField.removeAttribute("disabled");
            companyNameField.setAttribute("required", "required");
            companyNameField.placeholder = "Enter company name (required for admin)";
            companyNameField.style.borderLeft = "4px solid #d63031";
            companyNameField.style.opacity = "1";
            companyNameField.style.backgroundColor = "";
        } else {
            companyNameField.removeAttribute("required");
            companyNameField.placeholder = "For Admin accounts Only";
            companyNameField.setAttribute("disabled", "disabled");
            companyNameField.style.borderLeft = "";
            companyNameField.style.opacity = "0.6";
            companyNameField.style.backgroundColor = "#f5f5f5";
        }
    }
    userTypeRadios.forEach(radio => {
        radio.addEventListener("change", updateCompanyRequirement);
    });

    updateCompanyRequirement();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm_password").value.trim();
        const accountTypeElement = document.querySelector('input[name="user-type"]:checked');

        if (!accountTypeElement) {
            alert("⚠️ Please choose an account type!");
            return;
        }

        const accountType = accountTypeElement.value;
        const companyName = document.getElementById("company_name").value.trim();

        // Validation
        if (password !== confirmPassword) {
            alert("❌ Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("❌ Password must be at least 6 characters long!");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            alert("❌ Please enter a valid email address!");
            return;
        }

        if (username.length < 3) {
            alert("❌ Username must be at least 3 characters long!");
            return;
        }

        //Admin validation for company name
        if (accountType === "admin") {
            if (companyName.length === 0) {
                alert("❌ As an Admin, you must enter a Company Name!");
                return;
            }


        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if username exists
        let exists = users.find(user => user.username === username);
        if (exists) {
            alert("❌ Username already exists! Please choose another one.");
            return;
        }

        // Check if email exists
        let emailExists = users.find(user => user.email === email);
        if (emailExists) {
            alert("❌ Email already registered! Please use another email or login.");
            return;
        }

        // Admin account uniqueness check
        if (accountType === "admin") {
            const existingAdmin = users.find(user =>
                user.accountType === "admin" &&
                user.companyName?.toLowerCase() === companyName.toLowerCase()
            );
            if (existingAdmin) {
                alert("❌ A company with this name already has an admin account!");
                return;
            }
        }

        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            accountType: accountType,
            companyName: accountType === "admin" ? companyName : (companyName || null),
            joinDate: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("✅ Account created successfully! Please login.");
        window.location.href = "login.html";
    });

});