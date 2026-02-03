import { initSearchBox } from "./components/searchBox/searchBox.js";
import { initFilters } from "./components/filters/filters.js";
import { renderJobsForPagination, renderDefaultJobs } from "./components/jobCard/jobCard.js";
import { initPagination } from "./components/pagination/pagination.js";
import { initSort } from "./components/sort/sort.js";
import { getSession } from "./components/utils/storage.js";
import { STORAGE_KEYS, USER_PROFILE_IDS } from "./constant.js";
import { initUserProfile } from "./components/userProfile/userProfile.js";

let allJobs = [];

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const userIcon = document.getElementById("userProfileIcon");
const userProfileWrapper = document.getElementById(USER_PROFILE_IDS.wrapper);

const loggedInUser = getSession(STORAGE_KEYS.TOKEN);

if (loggedInUser) {
  registerBtn && (registerBtn.style.display = "none");
  loginBtn && (loginBtn.style.display = "none");

  if (userIcon) userIcon.classList.remove("hidden");

  initUserProfile();

  userProfileWrapper?.classList.remove("hidden");

  userIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    userProfileWrapper?.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (
      userProfileWrapper &&
      !userProfileWrapper.contains(e.target) &&
      !userIcon.contains(e.target)
    ) {
      userProfileWrapper.classList.remove("show");
    }
  });

} else {
  registerBtn?.addEventListener("click", () => {
    window.location.href = STORAGE_KEYS.REGISTER_PAGE_PATH;
  });

  loginBtn?.addEventListener("click", () => {
    window.location.href = STORAGE_KEYS.LOGIN_PAGE_PATH;
  });
}

fetch("data/jobs.json")
  .then((res) => res.json())
  .then((data) => {
    allJobs = data;

    initPagination(allJobs, renderJobsForPagination, 6);

    initFilters(allJobs, (jobs) =>
      initPagination(jobs, renderJobsForPagination, 6)
    );

    initSearchBox(
      allJobs,
      (jobs) => initPagination(jobs, renderJobsForPagination, 6),
      renderDefaultJobs
    );

    initSort(allJobs, (sortedJobs) =>
      initPagination(sortedJobs, renderJobsForPagination, 6)
    );
  })
  .catch((err) => console.error("Error loading jobs:", err));
