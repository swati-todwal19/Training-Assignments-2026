import { openResumePopup } from "../resume/resumePopup.js";
import { LOCAL_STORAGE_KEYS } from "../../constantFile.js";

export function initJobDescription() {
  const container = document.getElementById("jobDescription");
  const backLink = document.getElementById("backLink");

  if (backLink) {

  }

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  fetch("data/jobs.json")
    .then(res => res.json())
    .then(jobs => {
      const job = jobs.find(j => j.id == jobId);
      if (!job) return;

      renderJobDescription(job, container);
    });

  document.addEventListener("resumeUploaded", (e) => {
    const { jobTitle, jobId, fileName } = e.detail;

    const applyBtn = document.querySelector(
      `.apply-btn[data-job-id="${jobId}"]`
    );
    if (!applyBtn) return;

    applyBtn.textContent = "Applied";
    applyBtn.classList.add("applied");
    applyBtn.disabled = true;

    let appliedJobs =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.APPLIED_JOBS)) || [];

    const alreadyExists = appliedJobs.some(job => job.jobId == jobId);
    if (!alreadyExists) {
      appliedJobs.push({ jobId, jobTitle, fileName });
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.APPLIED_JOBS,
        JSON.stringify(appliedJobs)
      );
    }
  });
}

function renderJobDescription(job, el) {
  const d = job.description;

  el.innerHTML = `
    <div class="job-desc-card">

      <div class="job-desc-header">
        <h2>${job.title}</h2>
        <p class="meta">
          ${job.company} • ${job.location} • ${job.type}
        </p>

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

      <button 
        class="apply-btn"
        data-job-id="${job.id}"
      >
        Apply Now
      </button>
    </div>
  `;

  const applyBtn = el.querySelector(".apply-btn");

  restoreAppliedState(applyBtn, job.id);

  applyBtn.addEventListener("click", () => {
    if (applyBtn.classList.contains("applied")) return;

    openResumePopup(job.title, job.id);
  });
}

function restoreAppliedState(button, jobId) {
  const appliedJobs =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.APPLIED_JOBS)) || [];

  const isApplied = appliedJobs.some(job => job.jobId == jobId);

  if (isApplied) {
    button.textContent = "Applied";
    button.classList.add("applied");
    button.disabled = true;
  }
}
