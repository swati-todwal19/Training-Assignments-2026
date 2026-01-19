const jobListEl = document.getElementById("jobList");
const searchInput = document.querySelector(".search-box input");
const locationSelect = document.getElementById("location");
const jobTypeSelect = document.getElementById("jobType");
const searchBtn = document.getElementById("search-btn");

const filterLocation = document.getElementById("filterLocation");
const filterType = document.getElementById("filterType");
const filterExperience = document.getElementById("filterExperience");
const filterBtn = document.getElementById("filterBtn");

const jobDescriptionBox = document.getElementById("jobDescriptionBox");
const jobDescriptionContent = document.getElementById("jobDescriptionContent");

let allJobs = [];

const storedJobs = localStorage.getItem("jobs");

if(storedJobs) {
    allJobs = JSON.parse(storedJobs);
    renderDefaultJobs(allJobs);
}else {
    fetch("data/jobs.json")
  .then(res => res.json())
  .then(data => {
    allJobs = data;

    localStorage.setItem("jobs", JSON.stringify(data));
    renderDefaultJobs(allJobs);
  })
  .catch(err => {
    jobListEl.innerHTML = "<p>Failed to load jobs.</p>";
    console.error(err);
  });
}

function renderJobCard(job) {
  const card = document.createElement("div");
  card.className = "job-card";

  card.innerHTML = `
    <div class="card-header">
      <div class="company-section">
        <img src="${job.logo}" class="company-logo" />
        <div class="company-text">
          <div class="company-name">${job.company}</div>
          <div class="company-location">${job.location}</div>
        </div>
      </div>
    </div>

    <div class="job-title">${job.title}</div>

    <div class="job-meta">
      <span class="tag">${job.positions} Positions</span>
      <span class="tag">${job.type}</span>
      <span class="tag">${job.experience}</span>
      <span class="job-salary">${job.salary}</span>
    </div>

    <div class="job-actions">
      <button class="apply-btn">Apply Now</button>
      <button class="view-details-btn">View Details</button>
    </div>
  `;

    const viewBtn = card.querySelector(".view-details-btn");
    viewBtn.addEventListener("click", () => {
    jobDescriptionContent.innerHTML = renderJobDescription(job.description);
    jobDescriptionBox.classList.remove("hidden");
    
    //background scroll lock
    document.body.style.overflow = "hidden";
    
    const closeDescBtn = document.getElementById("closeDescBtn");
    closeDescBtn.addEventListener("click", () => {
    jobDescriptionBox.classList.add("hidden");
    jobDescriptionContent.innerHTML = "";

    //unlock background scroll
    document.body.style.overflow = "auto";
   });
});

  jobListEl.appendChild(card);
}

function renderDefaultJobs(jobs) {
  jobListEl.innerHTML = "";

  const uniqueRoles = [...new Set(jobs.map(job => job.title))];

  uniqueRoles.forEach(role => {
    const sampleJob = jobs.find(job => job.title === role);
    renderJobCard(sampleJob);
  });
}

function renderJobs(jobs) {
  jobListEl.innerHTML = "";

  if (jobs.length === 0) {
    jobListEl.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobs.forEach(job => renderJobCard(job));
}

function renderJobDescription(desc) {
  if (typeof desc === "string") {
    return `<p>${desc}</p>`;   
  }

  return `
    <h4>Job Overview</h4>
    <p>${desc.jobOverview}</p>

    <h4>Responsibilities</h4>
    <ul>
      ${desc.responsibilities.map(r => `<li>${r}</li>`).join("")}
    </ul>

    <h4>Skills Required</h4>
    <ul>
      ${desc.skillsRequired.map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h4>Growth & Culture</h4>
    <p>${desc.growthAndCulture}</p>

    <h4>Department</h4>
    <p>${desc.department || "All Departments"}</p>

    <h4>Open Positions</h4>
    <p>${desc.positions || 1}</p>

    <h4>Location</h4>
    <p>${desc.location}</p>

    <h4>Education Qualification</h4>
    <p>${desc.educationQualification || "N/A"}</p>

    <h4>Tags</h4>
    <ul>
      ${(desc.tags || []).map(tag => `<li>${tag}</li>`).join("")}
    </ul>

    <h4>Designation</h4>
    <p>${desc.designation}</p>
  `;
}

searchBtn.addEventListener("click", () => {
  const searchText = searchInput.value.toLowerCase();
  const selectedLocation = locationSelect.value.toLowerCase();
  const selectedType = jobTypeSelect.value.toLowerCase();

  const filteredJobs = allJobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(searchText);
    const companyMatch = job.company.toLowerCase().includes(searchText);
    const locationMatch = !selectedLocation || job.location.toLowerCase() === selectedLocation;
    const typeMatch = !selectedType || job.type.toLowerCase() === selectedType;

    return (titleMatch || companyMatch) && locationMatch && typeMatch;
  });

  renderJobs(filteredJobs);
});

filterBtn.addEventListener("click", () => {
  const selectedLocation = filterLocation.value.trim().toLowerCase();
  const selectedType = filterType.value.trim().toLowerCase();  
  const selectedExperience = filterExperience.value.trim().toLowerCase();

  const filteredJobs = allJobs.filter(job => {
    const location = job.location.toLowerCase().trim();
    const type = job.type.toLowerCase().trim();
    const experience = job.experience.toLowerCase().trim();

    const locationMatch = !selectedLocation || location.includes(selectedLocation);
    const typeMatch = !selectedType || JobType.includes(selectedType);
    const experienceMatch = !selectedExperience || experience.includes(selectedExperience);

    return locationMatch && typeMatch && experienceMatch;
  });

  renderJobs(filteredJobs);
});

