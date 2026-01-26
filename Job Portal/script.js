import { initSearchBox } from "./components/searchBox/searchBox.js";
import { initFilters } from "./components/filters/filters.js";
import { renderJobsForPagination, renderDefaultJobs } from "./components/jobCard/jobCard.js";
import { initPagination } from "./components/pagination/pagination.js";

let allJobs = [];

fetch("data/jobs.json")
  .then(res => res.json())
  .then(data => {
    allJobs = data;

    initPagination(allJobs, renderJobsForPagination, 6);

    initFilters(allJobs, jobs => initPagination(jobs, renderJobsForPagination, 6));

    initSearchBox(allJobs, jobs => initPagination(jobs, renderJobsForPagination, 6), renderDefaultJobs);

  })
  .catch(err => console.error("Error loading jobs:", err));
