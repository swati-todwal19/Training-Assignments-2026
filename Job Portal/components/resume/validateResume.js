import { RESUME_GUIDELINES } from "../../constantFile.js";

const successModal = document.getElementById("uploadSuccessModal");
const failureModal = document.getElementById("uploadFailureModal");
const closeSuccess = document.getElementById("closeSuccessModal");
const closeFailure = document.getElementById("closeFailureModal");

const successRoleName = document.getElementById("successRoleName");
const uploadedFileName = document.getElementById("uploadedFileName");
const removeUploadedFile = document.getElementById("removeUploadedFile");
const failureErrors = document.getElementById("failureErrors");

let fileInput = document.getElementById("resumeInput");

export function showTopAlert(message, type = "success") {
  const alert = document.getElementById("topAlert");
  if (!alert) return;

  alert.textContent = message;
  alert.classList.remove("show", "warning");

  if (type === "warning") alert.classList.add("warning");

  void alert.offsetWidth;
  alert.classList.add("show");

  setTimeout(() => {
    alert.classList.remove("show", "warning");
  }, 2500);
}

closeSuccess.addEventListener("click", () => {
  successModal.classList.add("hidden");

  const jobTitle = successRoleName.textContent;
  const jobId = successModal.dataset.jobId;
  const fileName = successModal.dataset.fileName;

  const event = new CustomEvent("resumeUploaded", {
    detail: { jobTitle, jobId, fileName }
  });

  document.dispatchEvent(event);
});

closeFailure.addEventListener("click", () => {
  failureModal.classList.add("hidden");
  if (failureErrors) failureErrors.innerHTML = "";
});

removeUploadedFile.addEventListener("click", (e) => {
  e.preventDefault();

  uploadedFileName.textContent = "";

  showTopAlert("Resume removed. Please upload your resume", "warning");

  if (fileInput) {
    fileInput.value = "";

    const newInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newInput, fileInput);
    fileInput = newInput;

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const jobTitle = fileInput.dataset.jobTitle;
      const jobId = fileInput.dataset.jobId;

      handleFileSelection(file, jobTitle, jobId);
    });
  }
});

export function validateResume(file) {
  const {
    MAX_FILE_SIZE,
    VALID_EXTENSIONS,
    MAX_FILENAME_LENGTH,
    NO_SPACES
  } = RESUME_GUIDELINES;

  const errors = [];

  if (file.size > MAX_FILE_SIZE) {
    errors.push(
      `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`
    );
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (!VALID_EXTENSIONS.includes(ext)) {
    errors.push(`File extension must be one of: ${VALID_EXTENSIONS.join(", ")}`);
  }

  if (file.name.length > MAX_FILENAME_LENGTH) {
    errors.push(
      `File name should be at most ${MAX_FILENAME_LENGTH} characters`
    );
  }

  if (NO_SPACES && file.name.includes(" ")) {
    errors.push("File name should not contain spaces");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function handleFileSelection(file, jobTitle, jobId) {
  if (!file) return;

  const { isValid, errors } = validateResume(file);

  const resumeModal = document.getElementById("resumeModal");
  if (resumeModal) resumeModal.classList.add("hidden");

  if (isValid) {
    successModal.classList.remove("hidden");
    failureModal.classList.add("hidden");

    successRoleName.textContent = jobTitle;
    uploadedFileName.textContent = file.name;
    removeUploadedFile.classList.remove("hidden");

    successModal.dataset.jobId = jobId;
    successModal.dataset.fileName = file.name;

    showTopAlert("Resume uploaded successfully");

    if (failureErrors) failureErrors.innerHTML = "";

  } else {
    failureModal.classList.remove("hidden");
    successModal.classList.add("hidden");

    uploadedFileName.textContent = file.name;
    removeUploadedFile.classList.add("hidden");

    if (failureErrors) {
      failureErrors.innerHTML = errors
        .map(err => `<li>${err}</li>`)
        .join("");
    }

    if (fileInput) fileInput.value = "";
  }
}
