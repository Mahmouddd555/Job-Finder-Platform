console.log("🚀 add-job.js LOADED - Version 4.0");

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("add-job-form");
    const pageTitle = document.getElementById("page-title");
    const submitBtn = document.getElementById("add-job-submit");
    const jobIdInput = document.getElementById("job-id");
    const titleInput = document.getElementById("job-title");
    const salaryInput = document.getElementById("salary");
    const companyInput = document.getElementById("company");
    const statusSelect = document.getElementById("job-status");
    const descInput = document.getElementById("description");
    const imageInput = document.getElementById("job-image");

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");

    const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&h=200&fit=crop";

    if (editId) {
        const job = jobs.find(j => j.id == editId);
        if (job) {
            pageTitle.textContent = "✏️ Edit Job";
            submitBtn.value = "Update Job";
            jobIdInput.value = job.id;
            titleInput.value = job.title;
            salaryInput.value = job.salary;
            companyInput.value = job.company;
            statusSelect.value = job.status;
            descInput.value = job.description || "";
            
            if (job.image && job.image !== "") {
                const preview = document.getElementById("image-preview");
                const img = document.getElementById("preview-img");
                img.src = job.image;
                preview.style.display = "block";
            }
        } else {
            alert("Job not found!");
            window.location.href = "add-job.html";
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = titleInput.value.trim();
        const salary = Number(salaryInput.value);
        const company = companyInput.value.trim();
        const status = statusSelect.value;
        const description = descInput.value.trim();
        
        if (!title || title.length < 3) {
            alert("❌ Job title must be at least 3 characters");
            return;
        }
        if (!salary || salary < 1000) {
            alert("❌ Salary must be at least 1000");
            return;
        }
        if (!company || company.length < 2) {
            alert("❌ Company name is required");
            return;
        }

        const imageFile = imageInput.files[0];
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                saveJob(title, salary, company, status, description, imageUrl);
            };
            reader.readAsDataURL(imageFile);
        } else {
            let imageUrl = defaultImage;
            if (editId) {
                const existingJob = jobs.find(j => j.id == editId);
                if (existingJob && existingJob.image) {
                    imageUrl = existingJob.image;
                }
            }
            saveJob(title, salary, company, status, description, imageUrl);
        }
    });
    
    function saveJob(title, salary, company, status, description, imageUrl) {
        jobs = JSON.parse(localStorage.getItem("jobs")) || [];

        if (editId) {
            const index = jobs.findIndex(j => j.id == editId);
            if (index !== -1) {
                jobs[index] = {
                    ...jobs[index],
                    title,
                    salary,
                    company,
                    status,
                    description,
                    image: imageUrl
                };
                localStorage.setItem("jobs", JSON.stringify(jobs));
                alert("✅ Job updated successfully!");
                window.location.href = "admin-jobs.html";
            } else {
                alert("❌ Error: Job not found");
            }
        } else {
            const newJob = {
                id: Date.now(),
                title,
                salary,
                company,
                status,
                description,
                image: imageUrl,
                createdAt: new Date().toISOString().split('T')[0]
            };
            jobs.push(newJob);
            localStorage.setItem("jobs", JSON.stringify(jobs));
            alert("✅ Job added successfully!");
            form.reset();
            document.getElementById("image-preview").style.display = "none";
            window.location.href = "admin-jobs.html";
        }
    }
});