document.addEventListener("DOMContentLoaded", function () {

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const jobId = localStorage.getItem("selectedJobId");

    const job = jobs.find(j => j.id == jobId);

    if (!job) {
        alert("Job not found!");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("title").textContent = job.title;
    document.getElementById("company").innerHTML = "<i class='fas fa-building'></i> Company: " + job.company;
    document.getElementById("salary").innerHTML = "<i class='fas fa-dollar-sign'></i> Salary: " + (typeof job.salary === 'number' ? "$" + job.salary.toLocaleString() : job.salary);
    document.getElementById("status").innerHTML = "<i class='fas fa-circle'></i> Status: " + (job.status || "Open");
    document.getElementById("description").textContent = job.description || "No description available for this position.";

    const jobImage = document.getElementById("job-image");
    const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=220&h=220&fit=crop";

    if (job.image && job.image !== "") {
        jobImage.src = job.image;
        jobImage.alt = job.title;
    } else {
        jobImage.src = defaultImage;
        jobImage.alt = "Default job image";
    }

    document.getElementById("applyForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {
            alert("❌ Please login first to apply for this job!");
            window.location.href = "login.html";
            return;
        }

        const fullname = this.fullname.value.trim();
        const email = this.email.value.trim();
        const exp = this.experience.value;

        if (!fullname || !email || !exp) {
            alert("❌ Please fill all fields!");
            return;
        }

        const applications = JSON.parse(localStorage.getItem("applications")) || [];

        const alreadyApplied = applications.find(app =>
            app.email === email && app.jobId == job.id
        );

        if (alreadyApplied) {
            alert("⚠️ You have already applied for this job!");
            return;
        }

        const newApplication = {
            id: Date.now(),
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            fullname: fullname,
            email: email,
            appliedDate: new Date().toISOString(),
            status: "pending"
        };

        applications.push(newApplication);
        localStorage.setItem("applications", JSON.stringify(applications));

        alert("✅ Application submitted successfully!");
        this.reset();
    });

});