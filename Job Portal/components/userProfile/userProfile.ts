import { getSession } from "../utils/storage.js";
import { STORAGE_KEYS, USER_PROFILE_IDS, CLASS_NAMES } from "../../constant.js";
import type { IUser } from "../jobAction/jobAction.js";

let isProfileInitialized = false;

export function initUserProfile() {
  const user = getSession<IUser>(STORAGE_KEYS.TOKEN);
  if (!user) return;

  user.appliedJobs ??= [];
  user.bookmarkedJobs ??= [];

  const wrapper = document.getElementById(USER_PROFILE_IDS.wrapper);
  const navName = document.getElementById(USER_PROFILE_IDS.navName);
  if (!wrapper) return;

  if (!isProfileInitialized) {
    wrapper.innerHTML = "";

    if (navName) navName.textContent = user.name;

    const header = document.createElement("div");
    header.className = CLASS_NAMES.profileHeader;
    header.innerHTML = `
      <div class="avatar">👤</div>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    `;
    wrapper.appendChild(header);

    const status = document.createElement("div");
    status.className = CLASS_NAMES.profileStatus;
    status.innerHTML = `Status: <span>${user.isVerified ? "Verified" : "Not Verified"}</span>`;
    wrapper.appendChild(status);

    const counts = document.createElement("div");
    counts.className = CLASS_NAMES.jobCounts;
    counts.innerHTML = `
      <div>Applied: <span id="appliedCount">0</span></div>
      <div>Bookmarked: <span id="bookmarkCount">0</span></div>
    `;
    wrapper.appendChild(counts);

    refreshProfileCounts(user);

    const logout = document.createElement("span");
    logout.textContent = "Logout";
    logout.className = CLASS_NAMES.logoutBtn;
    logout.style.cursor = "pointer";
    wrapper.appendChild(logout);

    logout.onclick = () => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.replace(STORAGE_KEYS.LOGIN_PAGE_PATH);
    };

    isProfileInitialized = true;
  }

  wrapper.classList.toggle("hidden");
}

export function refreshProfileCounts(user: IUser) {
  document.getElementById("appliedCount")!.textContent =
    String(user.appliedJobs.length);

  document.getElementById("bookmarkCount")!.textContent =
    String(user.bookmarkedJobs.length);
}

document.addEventListener("userUpdated", (e: any) => {
  refreshProfileCounts(e.detail);
});
