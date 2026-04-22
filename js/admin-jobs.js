window.onload = function () {
    loadJobs();
};

function loadJobs() {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    let table = document.getElementById("jobsTable");

    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Salary</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;

    jobs.forEach(job => {
        table.innerHTML += `
        <tr>
            <td>${job.id}</td>
            <td>${job.title}</td>
            <td>${job.salary}</td>
            <td>${job.company}</td>
            <td>${job.status}</td>
            <td>
                <button onclick="editJob(${job.id})">Edit</button>
                <button onclick="deleteJob(${job.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function editJob(id) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let job = jobs.find(j => j.id === parseInt(id));
    if (!job) {
        alert("Job not found!");
        return;
    }

    localStorage.setItem("editJobId", id);
    window.location.href = "edit-job.html";
}

function deleteJob(id) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    jobs = jobs.filter(j => j.id != id);

    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Job deleted!");

    loadJobs();
}

function editJobById(inputId) {
    let idInput = document.getElementById("jobIdInput");
    let id = idInput ? idInput.value.trim() : inputId;

    console.log("Edit by ID:", id);

    if (!id) {
        alert("❌ Please enter a Job ID!");
        return;
    }

    editJob(id);
    idInput.value = "";
}

// ========== DELETE JOB BY ID ==========
function deleteJobById(inputId) {
    let idInput = document.getElementById("jobIdInput");
    let id = idInput ? idInput.value.trim() : inputId;

    console.log("Delete by ID:", id);

    if (!id) {
        alert("❌ Please enter a Job ID!");
        return;
    }

    deleteJob(id);
    idInput.value = "";
}
