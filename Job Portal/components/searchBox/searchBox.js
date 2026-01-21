export function initSearchBox(allJobs, renderJobsCallback, renderDefaultJobs) {
  const searchInput = document.querySelector("#globalSearchInput");
  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  
  if (!searchText) {
    renderDefaultJobs(allJobs);
    return;
  }

  const filteredJobs = allJobs.filter(job => {
    const title = job.title.toLowerCase();
    const location = job.location.toLowerCase();
    const type = job.type.toLowerCase();

    return (
      title.includes(searchText) ||
      location.includes(searchText) ||
      type.includes(searchText)
    );
  });

  renderJobsCallback(filteredJobs);

  });
}
