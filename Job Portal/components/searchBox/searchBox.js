fetch("components/searchBox/searchBox.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("searchBox").innerHTML = html;

const searchInput = document.querySelector(".search-box input");
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

  renderJobs(filteredJobs);
  });

})