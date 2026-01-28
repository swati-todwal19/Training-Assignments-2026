export function initSort(allJobs, renderJobs) {
  const searchContainer = document.querySelector(".search-container");

  const wrapper = document.createElement("div");
  wrapper.className = "search-sort-wrapper";

  searchContainer.parentNode.insertBefore(wrapper, searchContainer);
  wrapper.appendChild(searchContainer);

  const sortSelect = document.createElement("select");
  sortSelect.className = "sort-dropdown";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Sort By";
  sortSelect.appendChild(defaultOption);

  const sortTypes = [
    { value: "company-asc", label: "Company (A - Z)" },
    { value: "company-desc", label: "Company (Z - A)" },
    { value: "exp-asc", label: "Experience (Low → High)" },
    { value: "exp-desc", label: "Experience (High → Low)" }
  ];

  sortTypes.forEach(item => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    sortSelect.appendChild(option);
  });

  sortSelect.addEventListener("change", () => {
    let sortedJobs = [...allJobs];

    if (sortSelect.value === "company-asc") {
      sortedJobs.sort((a, b) =>
        a.company.localeCompare(b.company)
      );
    }

    if (sortSelect.value === "company-desc") {
      sortedJobs.sort((a, b) =>
        b.company.localeCompare(a.company)
      );
    }

    if (sortSelect.value === "exp-asc") {
      sortedJobs.sort((a, b) =>
        parseInt(a.experience) - parseInt(b.experience)
      );
    }

    if (sortSelect.value === "exp-desc") {
      sortedJobs.sort((a, b) =>
        parseInt(b.experience) - parseInt(a.experience)
      );
    }

    renderJobs(sortedJobs);
  });

  wrapper.appendChild(sortSelect);
}
