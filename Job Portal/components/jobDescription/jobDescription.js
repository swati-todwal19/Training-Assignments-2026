import { openResumePopup } from "../resume/resumePopup.js";
import { requireAuth } from "../authCheck/authCheck.js";
import { applyJob, getCurrentUser } from "../jobAction/jobAction.js";

export function initJobDescription() {
  const container = document.getElementById("jobDescription");
  const backLink = document.getElementById("backLink");

  if (backLink) {
    backLink.addEventListener("click", () => window.history.back());
  }

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  fetch("data/jobs.json")
    .then(res => res.json())
    .then(jobs => {
      const job = jobs.find(j => String(j.id) === String(jobId));
      if (!job || !container) return;

      renderJobDescription(job, container);
    });

  document.addEventListener("resumeUploaded", (e) => {
  const { jobId, success } = e.detail || {};

  if (!success) return; 

  const applyBtn = document.querySelector(
    `.apply-btn[data-job-id="${jobId}"]`
  );

  if (!applyBtn) return;

  markJobApplied(applyBtn, jobId);
});

}

function renderJobDescription(job, el) {
  const d = job.description;

  el.innerHTML = `
    <div class="job-desc-card">
      <div class="job-desc-header">
        <h2>${job.title}</h2>
        <p class="meta">${job.company} • ${job.location} • ${job.type}</p>
        <div class="tags">
          ${d.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
      </div>

      <section>
        <h3>Job Overview</h3>
        <p>${d.jobOverview}</p>
      </section>

      <section>
        <h3>Responsibilities</h3>
        <ul>
          ${d.responsibilities.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </section>

      <section>
        <h3>Skills Required</h3>
        <ul class="skills">
          ${d.skillsRequired.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </section>

      <section>
        <h3>Growth & Culture</h3>
        <p>${d.growthAndCulture}</p>
      </section>

      <section class="job-info-grid">
        <div><b>Designation:</b> ${d.designation}</div>
        <div><b>Department:</b> ${d.department}</div>
        <div><b>Experience:</b> ${job.experience}</div>
        <div><b>Education:</b> ${d.educationQualification}</div>
      </section>

      <button class="apply-btn" data-job-id="${job.id}">
        Apply Now
      </button>
    </div>
  `;

  const applyBtn = el.querySelector(".apply-btn");

  restoreAppliedState(applyBtn, job.id);

  applyBtn.addEventListener("click", () => {
    if (applyBtn.classList.contains("applied")) return;

    requireAuth("apply", () => {
      openResumePopup(job.title, job.id);
    });
  });
}

function restoreAppliedState(button, jobId) {
  if (!button) return;

  const user = getCurrentUser();
  if (!user || !Array.isArray(user.appliedJobs)) return;

  if (user.appliedJobs.includes(String(jobId))) {
    button.textContent = "Applied";
    button.classList.add("applied");
    button.disabled = true;
  }
}

function markJobApplied(button, jobId) {
  if (!button) return;

  applyJob(String(jobId));

  button.textContent = "Applied";
  button.classList.add("applied");
  button.disabled = true;
}
