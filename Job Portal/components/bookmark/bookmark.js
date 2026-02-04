import {
  bookmarkJob,
  removeBookmarkForUser,
  getCurrentUser
} from "../jobAction/jobAction.js";
import { requireAuth } from "../authCheck/authCheck.js";

const bookmarkHeader = document.getElementById("bookmarkHeader");
const bookmarkPanel = document.getElementById("bookmarkPanel");

let allJobs = [];

async function loadJobs() {
  if (allJobs.length) return;
  try {
    const res = await fetch("data/jobs.json");
    allJobs = await res.json();
  } catch (e) {
    console.error("Failed to load jobs", e);
  }
}

export async function initBookmarkModule(jobCards) {
  if (!jobCards || !jobCards.forEach) return;

  await loadJobs();

  jobCards.forEach(card => {
    const jobId = card.dataset.jobId;
    if (!jobId) return;

    const star = document.createElement("span");
    star.className = "bookmark-star";
    star.innerText = "★";

    const user = getCurrentUser();
    if (user?.bookmarkedJobs?.includes(jobId)) {
      star.classList.add("bookmarked");
    }

    card.style.position = "relative";
    card.appendChild(star);

    star.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      requireAuth("bookmark", () => {
        const user = getCurrentUser();
        if (!user) return;

        user.bookmarkedJobs ??= [];

        if (user.bookmarkedJobs.includes(jobId)) {
          removeBookmarkForUser(jobId);
          star.classList.remove("bookmarked");
        } else {
          bookmarkJob(jobId);
          star.classList.add("bookmarked");
        }

        renderBookmarkPanel();
      });
    });
  });

  bookmarkHeader?.addEventListener("click", async () => {
    bookmarkPanel?.classList.toggle("open");
    await renderBookmarkPanel();
  });
}

async function renderBookmarkPanel() {
  if (!bookmarkPanel) return;

  await loadJobs();

  const listEl = bookmarkPanel.querySelector(".bookmark-list");
  const searchInput = bookmarkPanel.querySelector("#bookmarkSearchInput");

  if (!listEl || !searchInput) return;

  function renderList(filter = "") {
    listEl.innerHTML = "";

    const user = getCurrentUser();
    const bookmarkedIds = user?.bookmarkedJobs ?? [];

    const filteredJobs = allJobs.filter(job =>
      bookmarkedIds.includes(String(job.id)) &&
      (
        job.title.toLowerCase().includes(filter) ||
        job.company.toLowerCase().includes(filter)
      )
    );

    if (!filteredJobs.length) {
      listEl.innerHTML = "<p>No bookmarks</p>";
      return;
    }

    filteredJobs.forEach(job => {
      const item = document.createElement("div");
      item.className = "bookmark-item";

      item.innerHTML = `
        <div>
          <strong>${job.title}</strong>
          <p>${job.company}</p>
        </div>
        <span class="remove">✕</span>
      `;

      item.addEventListener("click", () => {
        window.location.href = `/Job%20Portal/jobDetails.html?id=${job.id}`;
      });

      item.querySelector(".remove").addEventListener("click", e => {
        e.stopPropagation();

        requireAuth("bookmark", () => {
          removeBookmarkForUser(String(job.id));

          const star = document.querySelector(
            `.job-card[data-job-id="${job.id}"] .bookmark-star`
          );
          if (star) star.classList.remove("bookmarked");

          renderList(searchInput.value.toLowerCase());
        });
      });

      listEl.appendChild(item);
    });
  }

  renderList();

  searchInput.oninput = e => {
    renderList(e.target.value.toLowerCase());
  };
}
