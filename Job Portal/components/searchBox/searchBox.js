import { SESSION_STORAGE_KEYS } from "../../constantFile.js";

export function initSearchBox(allJobs, renderJobsCallback, renderDefaultJobs) {
  const searchInput = document.querySelector("#globalSearchInput");
  const searchBtn = document.getElementById("search-btn");

  const savedSearch = sessionStorage.getItem(SESSION_STORAGE_KEYS.SEARCH) || "";
  if (savedSearch) {
    searchInput.value = savedSearch;

    applySearch(savedSearch);
  }

  function applySearch(searchText) {
    const trimmedText = searchText.trim().toLowerCase();

    if (!trimmedText) {
      renderDefaultJobs(allJobs);
      return;
    }

    const filteredJobs = allJobs.filter(job => {
      const { title, location, type } = job;
      return (
        title.toLowerCase().includes(trimmedText) ||
        location.toLowerCase().includes(trimmedText) ||
        type.toLowerCase().includes(trimmedText)
      );
    });

    renderJobsCallback(filteredJobs);
  }

  searchBtn.addEventListener("click", () => {
    const searchText = searchInput.value;
    
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SEARCH, searchText);

    applySearch(searchText);
  });
}
