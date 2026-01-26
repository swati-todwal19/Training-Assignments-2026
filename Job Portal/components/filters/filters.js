import { SESSION_STORAGE_KEYS } from "../../constantFile.js";

export function initFilters(allJobs, renderJobs) {
  const filterLocation = document.getElementById("filterLocation");
  const filterType = document.getElementById("filterType");
  const filterExperience = document.getElementById("filterExperience");
  const filterBtn = document.getElementById("filterBtn");

  function getUnique(data, key) {
    return [...new Set(data.map(item => item[key].trim()))];
  }

  function getUniqueSortedExperience(jobs, key) {
    const unique = [...new Set(jobs.map(job => job[key].trim()))];
    unique.sort((a, b) => parseInt(a) - parseInt(b));
    return unique;
  }

  function populateDropdowns(jobs) {
    filterLocation.innerHTML = "";
    getUnique(jobs, "location").forEach(loc => {
      filterLocation.innerHTML += `<option value="${loc}">${loc}</option>`;
    });

    filterType.innerHTML = `<option value="">All</option>`;
    getUnique(jobs, "type").forEach(type => {
      filterType.innerHTML += `<option value="${type}">${type}</option>`;
    });

    filterExperience.innerHTML = `<option value="">All</option>`;
    getUniqueSortedExperience(jobs, "experience").forEach(exp => {
      filterExperience.innerHTML += `<option value="${exp}">${exp}</option>`;
    });
  }

  populateDropdowns(allJobs);

  const savedFilters = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.FILTERS)) || {};

  if (savedFilters.locations) {
    Array.from(filterLocation.options).forEach(opt => {
      opt.selected = savedFilters.locations.includes(opt.value);
    });
  }
  if (savedFilters.type) filterType.value = savedFilters.type;
  if (savedFilters.experience) filterExperience.value = savedFilters.experience;

  function applyFilters() {
    const selectedLocations = Array.from(filterLocation.selectedOptions).map(opt => opt.value);
    const selectedType = filterType.value;
    const selectedExperience = filterExperience.value;

    const filteredJobs = allJobs.filter(job => 
      (selectedLocations.length === 0 || selectedLocations.includes(job.location)) &&
      (!selectedType || job.type === selectedType) &&
      (!selectedExperience || job.experience === selectedExperience)
    );

    renderJobs(filteredJobs);

    const filtersToSave = {
      locations: selectedLocations,
      type: selectedType,
      experience: selectedExperience
    };
    sessionStorage.setItem(SESSION_STORAGE_KEYS.FILTERS, JSON.stringify(filtersToSave));
  }

  filterBtn.addEventListener("click", applyFilters);

  if (Object.keys(savedFilters).length > 0) {
    applyFilters();
  }
}
