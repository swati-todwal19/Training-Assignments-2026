import { handleFileSelection } from "./validateResume.js";

const modal = document.getElementById("resumeModal");
const closeBtn = document.getElementById("closeModal");
const uploadBtn = document.getElementById("uploadBtn");
let resumeInput = document.getElementById("resumeInput");
const uploadedFileName = document.getElementById("uploadedFileName");

export function openResumePopup(jobTitle, jobId) {
  modal.classList.remove("hidden");
  resumeInput.dataset.jobTitle = jobTitle;
  resumeInput.dataset.jobId = jobId;
  resumeInput.value = "";
  uploadedFileName.textContent = "";
}

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  resumeInput.value = "";
  uploadedFileName.textContent = "";
});

uploadBtn.addEventListener("click", () => resumeInput.click());

resumeInput.addEventListener("change", onFileChange);

function onFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const jobTitle = resumeInput.dataset.jobTitle;
  const jobId = resumeInput.dataset.jobId;

  handleFileSelection(file, jobTitle, jobId);

  const newInput = resumeInput.cloneNode(true);
  resumeInput.parentNode.replaceChild(newInput, resumeInput);
  resumeInput = newInput;
  resumeInput.addEventListener("change", onFileChange);
}
