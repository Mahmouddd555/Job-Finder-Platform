console.log("✏️ edit-job.js LOADED");

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const editId = localStorage.getItem("editJobId");
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    console.log("Edit ID:", editId);
    console.log("Jobs loaded:", jobs);

    if (!editId || editId === "null" || editId === "undefined") {
        alert("❌ No job selected for editing!");
        window.location.href = "admin-jobs.html";
        return;
    }

    const jobToEdit = jobs.find(j => j.id == editId);

    if (!jobToEdit) {
        alert("❌ Job not found!");
        window.location.href = "admin-jobs.html";
        return;
    }

    console.log("Job to edit:", jobToEdit);

    document.getElementById("job-id").value = jobToEdit.id;
    document.getElementById("job-title").value = jobToEdit.title || "";
    document.getElementById("salary").value = jobToEdit.salary || "";
    document.getElementById("company").value = jobToEdit.company || "";
    document.getElementById("job-status").value = jobToEdit.status || "open";
    document.getElementById("description").value = jobToEdit.description || "";

    // ========== Animation ==========
    form.style.opacity = "0";
    form.style.transform = "translateY(20px)";
    form.style.transition = "0.5s";

    setTimeout(() => {
        form.style.opacity = "1";
        form.style.transform = "translateY(0)";
    }, 200);

    // ========== Auto-resize textarea ==========
    const textarea = document.getElementById("description");
    if (textarea) {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        setTimeout(() => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }, 100);
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("🔥 Update Submitted");

        const title = document.getElementById("job-title").value.trim();
        const salary = parseFloat(document.getElementById("salary").value);
        const company = document.getElementById("company").value.trim();
        const status = document.getElementById("job-status").value;
        const description = document.getElementById("description").value.trim();

        if (!title || title.length < 3) {
            alert("❌ Job title must be at least 3 characters");
            return;
        }

        if (isNaN(salary) || salary < 1000) {
            alert("❌ Salary must be at least 1000");
            return;
        }

        if (!company || company.length < 2) {
            alert("❌ Company name is required");
            return;
        }

        jobs = JSON.parse(localStorage.getItem("jobs")) || [];

        const index = jobs.findIndex(j => j.id == editId);

        if (index !== -1) {
            jobs[index] = {
                ...jobs[index],
                title,
                salary,
                company,
                status,
                description,
            };

            localStorage.setItem("jobs", JSON.stringify(jobs));
            localStorage.removeItem("editJobId");

            alert("✅ Job Updated Successfully!");
            window.location.href = "admin-jobs.html";
        } else {
            alert("❌ Error: Job not found");
        }
    });

});