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

  filterBtn.addEventListener("click", () => {
    const selectedLocations = Array.from(filterLocation.selectedOptions).map(opt => opt.value);
    const selectedType = filterType.value;
    const selectedExperience = filterExperience.value;

    const filteredJobs = allJobs.filter(job => 
      (selectedLocations.length === 0 || selectedLocations.includes(job.location)) &&
      (!selectedType || job.type === selectedType) &&
      (!selectedExperience || job.experience === selectedExperience)
    );

    renderJobs(filteredJobs);
  });
}
