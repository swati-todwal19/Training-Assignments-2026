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
  const { title, location, type } = job;   

  return (
    title.toLowerCase().includes(searchText) ||
    location.toLowerCase().includes(searchText) ||
    type.toLowerCase().includes(searchText)
  );
});

  renderJobsCallback(filteredJobs);

  });
}
