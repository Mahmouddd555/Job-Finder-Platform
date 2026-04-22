document.addEventListener("DOMContentLoaded", function () {

  const defaultJobs = [];

  if (!localStorage.getItem("jobs")) {
    localStorage.setItem("jobs", JSON.stringify(defaultJobs));
  }

  const container = document.querySelector(".job-list");
  if (!container) return;

  const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=60&h=60&fit=crop";

  container.innerHTML = "";
  storedJobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card-modern";

    card.innerHTML = `
      <img src="${job.image || defaultImage}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">
      <h3>${job.title}</h3>
      <p>${job.company}</p>
      <p>${job.location || 'Remote'}</p>
      <p>$${typeof job.salary === 'number' ? job.salary.toLocaleString() : job.salary}</p>
      <button class="view-btn">View Details</button>
    `;

    card.querySelector(".view-btn").addEventListener("click", function () {
      localStorage.setItem("selectedJobId", job.id);
      window.location.href = "job-details.html";
    });

    container.appendChild(card);
  });

});

// ========== Counters Animation ==========
const counters = document.querySelectorAll(".counter");

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const step = target / 100;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    update();
  });
};

const statsSection = document.querySelector(".stats");
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(statsSection);
}