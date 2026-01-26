// const jobListEl = document.getElementById("jobList");

// export function renderJobCard(job) {
//   const card = document.createElement("div");
//   card.className = "job-card";

//   card.innerHTML = `
//     <div class="card-header">
//       <div class="company-section">
//         <img src="${job.logo}" class="company-logo" alt="${job.company}" />
//         <div class="company-text">
//           <div class="company-name">${job.company}</div>
//           <div class="company-location">${job.location}</div>
//         </div>
//       </div>
//     </div>

//     <div class="job-title">${job.title}</div>

//     <div class="job-meta">
//       <span class="tag">${job.positions} Positions</span>
//       <span class="tag">${job.type}</span>
//       <span class="tag">${job.experience}</span>
//       <span class="job-salary">${job.salary}</span>
//     </div>

//     <div class="job-actions">
//       <button class="click" data-id="${job.id}">Click View Details</button>
//     </div>
//   `;

//   //navigation
//   card.querySelector(".click").onclick = () => {
//     window.location.href = `jobDetails.html?id=${job.id}`;
//   };

//   return card; 
// }

// export function renderDefaultJobs(jobs) {
//   jobListEl.innerHTML = "";

//   const uniqueRoles = [...new Set(jobs.map(job => job.title))];

//   uniqueRoles.forEach(role => {
//     const job = jobs.find(job => job.title === role);
//     jobListEl.appendChild(renderJobCard(job));
//   });
// }

// export function renderJobs(jobs) {
//   jobListEl.innerHTML = "";

//   if (jobs.length === 0) {
//     jobListEl.innerHTML = "<p>No jobs found.</p>";
//     return;
//   }

//   jobs.forEach(job => {
//     jobListEl.appendChild(renderJobCard(job));
//   });

// }

// //for pagination
// export function renderJobsForPagination(jobsSlice) {
//   const jobListEl = document.getElementById("jobList");
//   jobListEl.innerHTML = "";

//   if (jobsSlice.length === 0) {
//     jobListEl.innerHTML = "<p>No jobs found.</p>";
//     return;
//   }

//   jobsSlice.forEach(job => {
//     jobListEl.appendChild(renderJobCard(job));
//   });
// }






// const jobListEl = document.getElementById("jobList");
// import { initBookmarkModule } from "../bookmark/bookmark.js"; // ✅ Import bookmark module

// export function renderJobCard(job) {
//   const card = document.createElement("div");
//   card.className = "job-card";

//   // ✅ Attach job data for bookmark module
//   card.dataset.jobId = job.id;
//   card.dataset.jobTitle = job.title;
//   card.dataset.company = job.company;

//   card.innerHTML = `
//     <div class="card-header">
//       <div class="company-section">
//         <img src="${job.logo}" class="company-logo" alt="${job.company}" />
//         <div class="company-text">
//           <div class="company-name">${job.company}</div>
//           <div class="company-location">${job.location}</div>
//         </div>
//       </div>
//     </div>

//     <div class="job-title">${job.title}</div>

//     <div class="job-meta">
//       <span class="tag">${job.positions} Positions</span>
//       <span class="tag">${job.type}</span>
//       <span class="tag">${job.experience}</span>
//       <span class="job-salary">${job.salary}</span>
//     </div>

//     <div class="job-actions">
//       <button class="click" data-id="${job.id}">Click View Details</button>
//     </div>
//   `;

//   //navigation
//   card.querySelector(".click").onclick = () => {
//     window.location.href = `jobDetails.html?id=${job.id}`;
//   };

//   return card; 
// }

// export function renderDefaultJobs(jobs) {
//   jobListEl.innerHTML = "";

//   const uniqueRoles = [...new Set(jobs.map(job => job.title))];

//   uniqueRoles.forEach(role => {
//     const job = jobs.find(job => job.title === role);
//     jobListEl.appendChild(renderJobCard(job));
//   });

//   // ✅ Initialize bookmark after cards rendered
//   const jobCards = document.querySelectorAll(".job-card");
//   initBookmarkModule(jobCards);
// }

// export function renderJobs(jobs) {
//   jobListEl.innerHTML = "";

//   if (jobs.length === 0) {
//     jobListEl.innerHTML = "<p>No jobs found.</p>";
//     return;
//   }

//   jobs.forEach(job => {
//     jobListEl.appendChild(renderJobCard(job));
//   });

//   // ✅ Initialize bookmark after cards rendered
//   const jobCards = document.querySelectorAll(".job-card");
//   initBookmarkModule(jobCards);
// }

// //for pagination
// export function renderJobsForPagination(jobsSlice) {
//   const jobListEl = document.getElementById("jobList");
//   jobListEl.innerHTML = "";

//   if (jobsSlice.length === 0) {
//     jobListEl.innerHTML = "<p>No jobs found.</p>";
//     return;
//   }

//   jobsSlice.forEach(job => {
//     jobListEl.appendChild(renderJobCard(job));
//   });

//   // ✅ Initialize bookmark after cards rendered
//   const jobCards = document.querySelectorAll(".job-card");
//   initBookmarkModule(jobCards);
// }

const jobListEl = document.getElementById("jobList");
import { initBookmarkModule } from "../bookmark/bookmark.js"; 
import { initSavedJobsIcon } from "../savedJobs/savedJobsIcon.js";

export function renderJobCard(job) {
  const card = document.createElement("div");
  card.className = "job-card";

  // ✅ Attach job data for bookmark module
  card.dataset.jobId = job.id;
  card.dataset.jobTitle = job.title;
  card.dataset.company = job.company;

  card.innerHTML = `
    <div class="card-header">
      <div class="company-section">
        <img src="${job.logo}" class="company-logo" alt="${job.company}" />
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
      <button class="click" data-id="${job.id}">Click View Details</button>
    </div>
  `;

  //navigation
  card.querySelector(".click").onclick = () => {
    window.location.href = `jobDetails.html?id=${job.id}`;
  };

  return card; 
}

export function renderDefaultJobs(jobs) {
  jobListEl.innerHTML = "";

  const uniqueRoles = [...new Set(jobs.map(job => job.title))];

  uniqueRoles.forEach(role => {
    const job = jobs.find(job => job.title === role);
    jobListEl.appendChild(renderJobCard(job));
  });

  // ✅ Initialize bookmark after cards rendered
  const jobCards = document.querySelectorAll(".job-card");
  initBookmarkModule(jobCards);
  initSavedJobsIcon(jobCards);
}

export function renderJobs(jobs) {
  jobListEl.innerHTML = "";

  if (jobs.length === 0) {
    jobListEl.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobs.forEach(job => {
    jobListEl.appendChild(renderJobCard(job));
  });

  // ✅ Initialize bookmark after cards rendered
  const jobCards = document.querySelectorAll(".job-card");
  initBookmarkModule(jobCards);
  initSavedJobsIcon(jobCards);
}

// for pagination
export function renderJobsForPagination(jobsSlice) {
  const jobListEl = document.getElementById("jobList");
  jobListEl.innerHTML = "";

  if (jobsSlice.length === 0) {
    jobListEl.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobsSlice.forEach(job => {
    jobListEl.appendChild(renderJobCard(job));
  });

  // ✅ Initialize bookmark after cards rendered
  const jobCards = document.querySelectorAll(".job-card");
  initBookmarkModule(jobCards);
  initSavedJobsIcon(jobCards);
}


