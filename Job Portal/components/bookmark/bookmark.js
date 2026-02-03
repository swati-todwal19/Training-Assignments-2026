import { LOCAL_STORAGE_KEYS } from "../../constantFile.js";
import { bookmarkJob, removeBookmarkForUser } from "../jobAction/jobAction.js";
import { requireAuth } from "../authCheck/authCheck.js";

const bookmarkHeader = document.getElementById("bookmarkHeader");
const bookmarkPanel = document.getElementById("bookmarkPanel");

export function initBookmarkModule(jobCards) {
  let bookmarks = [];

  try {
    bookmarks =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKED_JOBS)) ?? [];
  } catch {
    bookmarks = [];
  }

  if (!Array.isArray(bookmarks)) bookmarks = [];
  if (!jobCards || !jobCards.forEach) return;

  jobCards.forEach(card => {
    const jobId = card.dataset.jobId;
    const jobTitle = card.dataset.jobTitle;
    const company = card.dataset.company;

    if (!jobId) return;

    const star = document.createElement("span");
    star.className = "bookmark-star";
    star.innerText = "★";

    if (bookmarks.some(b => b.jobId == jobId)) {
      star.classList.add("bookmarked");
    }

    card.style.position = "relative";
    card.appendChild(star);

    star.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      requireAuth("bookmark", () => {
        const index = bookmarks.findIndex(b => b.jobId == jobId);

        if (index > -1) {
          bookmarks.splice(index, 1);
          star.classList.remove("bookmarked");
          removeBookmarkForUser(jobId);
        } else {
          bookmarks.push({ jobId, jobTitle, company });
          star.classList.add("bookmarked");
          bookmarkJob(jobId);
        }

        localStorage.setItem(
          LOCAL_STORAGE_KEYS.BOOKMARKED_JOBS,
          JSON.stringify(bookmarks)
        );

        renderBookmarkPanel();
      });
    });
  });

  bookmarkHeader?.addEventListener("click", () => {
    bookmarkPanel?.classList.toggle("open");
    renderBookmarkPanel();
  });

  renderBookmarkPanel();
}

function renderBookmarkPanel() {
  let bookmarks = [];

  try {
    bookmarks =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKED_JOBS)) ?? [];
  } catch {
    bookmarks = [];
  }

  if (!Array.isArray(bookmarks)) bookmarks = [];
  if (!bookmarkPanel) return;

  bookmarkPanel.innerHTML = `
    <div class="bookmark-search">
      <input type="text" id="bookmarkSearchInput" placeholder="Search bookmarks" />
    </div>
    <div class="bookmark-list"></div>
  `;

  const listEl = bookmarkPanel.querySelector(".bookmark-list");
  const searchInput = bookmarkPanel.querySelector("#bookmarkSearchInput");

  function renderList(filter = "") {
    listEl.innerHTML = "";

    const filtered = bookmarks.filter(b =>
      b.jobTitle.toLowerCase().includes(filter.toLowerCase()) ||
      b.company.toLowerCase().includes(filter.toLowerCase())
    );

    if (!filtered.length) {
      listEl.innerHTML = "<p>No bookmarks</p>";
      return;
    }

    filtered.forEach(b => {
      const item = document.createElement("div");
      item.className = "bookmark-item";
      item.innerHTML = `
        <div>${b.jobTitle}</div>
        <span class="remove">✕</span>
      `;

      item.querySelector(".remove").addEventListener("click", e => {
        e.stopPropagation();

        requireAuth("bookmark", () => {
          bookmarks = bookmarks.filter(x => x.jobId != b.jobId);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.BOOKMARKED_JOBS,
            JSON.stringify(bookmarks)
          );

          removeBookmarkForUser(b.jobId);

          const star = document.querySelector(
            `.job-card[data-job-id="${b.jobId}"] .bookmark-star`
          );
          if (star) star.classList.remove("bookmarked");

          renderList(searchInput.value);
        });
      });

      listEl.appendChild(item);
    });
  }

  renderList();

  searchInput?.addEventListener("input", e => {
    renderList(e.target.value);
  });
}
