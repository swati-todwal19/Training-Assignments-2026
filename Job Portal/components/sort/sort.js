import { SESSION_STORAGE_KEYS } from "../../constantFile.js";

export function initSort(jobs, handleSortedJobs) {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput || !Array.isArray(jobs)) return;

  let wrapper = searchInput.parentElement;
  if (!wrapper.classList.contains("search-wrapper")) {
    wrapper = document.createElement("div");
    wrapper.className = "search-wrapper";
    searchInput.parentNode.insertBefore(wrapper, searchInput);
    wrapper.appendChild(searchInput);
  }

  let sortIcon = wrapper.querySelector(".sort-icon");
  if (!sortIcon) {
    sortIcon = document.createElement("i");
    sortIcon.className = "fas fa-sort sort-icon";
    sortIcon.title = "Sort by Company";
    wrapper.appendChild(sortIcon);
  }

  let dropdown = wrapper.querySelector(".sort-dropdown");
  if (!dropdown) {
    dropdown = document.createElement("select");
    dropdown.className = "sort-dropdown";

    dropdown.innerHTML = `
      <option value="">Sort By</option>
      <option value="company-asc">Company (A-Z)</option>
      <option value="company-desc">Company (Z-A)</option>
    `;
    wrapper.appendChild(dropdown);
  }

  const savedSort = sessionStorage.getItem(SESSION_STORAGE_KEYS.SORT) || "";
  if (savedSort) {
    dropdown.value = savedSort;
  }

  function applySort(value, currentJobs) {
    const [key, order] = value.split("-");
    if (!key) {
      handleSortedJobs(currentJobs); 
      return;
    }

    const sortedJobs = [...currentJobs].sort((a, b) => {
      return order === "asc"
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    });

    handleSortedJobs(sortedJobs);
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SORT, value);
  }

  sortIcon.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  };

  dropdown.onchange = () => {
    const currentJobs = document.querySelectorAll(".job-card"); 
    applySort(dropdown.value, jobs);
  };

  if (savedSort) {
    applySort(savedSort, jobs);
  }
}



