import { getSession } from "../utils/storage.js";
import { STORAGE_KEYS, USER_PROFILE_IDS, CLASS_NAMES } from "../../constant.js";

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  appliedJobs: string[];
  bookmarkedJobs: string[];
}

let isProfileInitialized = false;

function getAllUsers(): Record<string, User> {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveAllUsers(users: Record<string, User>) {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveUser(user: User) {
  const users = getAllUsers();
  users[user.email] = user;
  saveAllUsers(users);
}

export function initUserProfile() {
  const sessionUser = getSession<{ email: string }>(STORAGE_KEYS.TOKEN);
  if (!sessionUser) return;

  const users = getAllUsers();
  let user = users[sessionUser.email];

  if (!user) {
    user = {
      id: sessionUser.email,
      name: sessionUser.email.split("@")[0],
      email: sessionUser.email,
      isVerified: false,
      appliedJobs: [],
      bookmarkedJobs: [],
    };
    saveUser(user);
  } else {
    let updated = false;

    if (!Array.isArray(user.appliedJobs)) {
      user.appliedJobs = [];
      updated = true;
    }
    if (!Array.isArray(user.bookmarkedJobs)) {
      user.bookmarkedJobs = [];
      updated = true;
    }

    if (updated) saveUser(user);
  }

  const wrapper = document.getElementById(USER_PROFILE_IDS.wrapper);
  const navName = document.getElementById(USER_PROFILE_IDS.navName);
  if (!wrapper) return;

  if (!isProfileInitialized) {
    wrapper.innerHTML = "";

    if (navName) navName.textContent = user.name;

    const profileHeader = document.createElement("div");
    profileHeader.className = CLASS_NAMES.profileHeader;
    profileHeader.innerHTML = `
      <div class="avatar">👤</div>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    `;
    wrapper.appendChild(profileHeader);

    const statusEl = document.createElement("div");
    statusEl.className = CLASS_NAMES.profileStatus;
    statusEl.innerHTML = `Status: <span>${user.isVerified ? "Verified ✅" : "Not Verified ❌"}</span>`;
    wrapper.appendChild(statusEl);

    if (!user.isVerified) {
      const verifyBtn = document.createElement("button");
      verifyBtn.id = USER_PROFILE_IDS.verifyBtn;
      verifyBtn.className = CLASS_NAMES.verifyBtn;
      verifyBtn.textContent = "Verify Email";
      wrapper.appendChild(verifyBtn);

      verifyBtn.addEventListener("click", () => {
        alert("Verification successful (dummy)");
        user.isVerified = true;
        saveUser(user);
        statusEl.innerHTML = `Status: <span>Verified ✅</span>`;
        verifyBtn.style.display = "none";
      });
    }

    const jobCounts = document.createElement("div");
    jobCounts.className = CLASS_NAMES.jobCounts;
    jobCounts.innerHTML = `
      <div>Applied: <span id="appliedCount">${user.appliedJobs.length}</span></div>
      <div>Bookmarked: <span id="bookmarkCount">${user.bookmarkedJobs.length}</span></div>
    `;
    wrapper.appendChild(jobCounts);

    const logoutText = document.createElement("span");
    logoutText.id = USER_PROFILE_IDS.logoutBtn;
    logoutText.className = CLASS_NAMES.logoutBtn;
    logoutText.textContent = "Logout";
    logoutText.style.cursor = "pointer";
    wrapper.appendChild(logoutText);

    logoutText.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = STORAGE_KEYS.LOGIN_PAGE_PATH;
    });

    isProfileInitialized = true;
  }

  if (wrapper.classList.contains("hidden")) {
    wrapper.classList.remove("hidden");
    wrapper.style.transform = "translateX(0)";
  } else {
    wrapper.classList.add("hidden");
    wrapper.style.transform = "translateX(100%)";
  }
}

export function refreshProfileCounts(user: User) {
  const appliedCount = document.getElementById("appliedCount");
  const bookmarkCount = document.getElementById("bookmarkCount");

  if (appliedCount) appliedCount.textContent = user.appliedJobs.length.toString();
  if (bookmarkCount) bookmarkCount.textContent = user.bookmarkedJobs.length.toString();
}
