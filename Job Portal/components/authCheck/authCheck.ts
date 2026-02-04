import { STORAGE_KEYS } from "../../constant.js";

export function isUserLoggedIn(): boolean {
  const sessionUser = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  return !!sessionUser; 
}

export function showGuestPopup(actionType: "bookmark" | "apply") {
  if (document.querySelector(".guest-popup")) return;

  const popup = document.createElement("div");
  popup.className = "guest-popup";

  let message = "";
  let btnText = "";
  let redirectPath = "";

  if (actionType === "bookmark" || actionType === "apply") {
    message = `Please register or login first to ${actionType} a job.`;
    btnText = "Register / Login";
    redirectPath = "components/authorization/register/register.html"; 
  }

  popup.innerHTML = `
    <div class="popup-content">
      <p>${message}</p>
      <button id="authActionBtn">${btnText}</button>
      <button id="closePopupBtn">Close</button>
    </div>
  `;

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector("#closePopupBtn") as HTMLButtonElement;
  closeBtn.addEventListener("click", () => popup.remove());

  const authBtn = popup.querySelector("#authActionBtn") as HTMLButtonElement;
  authBtn.addEventListener("click", () => {
    window.location.href = redirectPath;
  });
}

export function requireAuth(actionType: "bookmark" | "apply", callback: () => void) {
  if (isUserLoggedIn()) {
    callback();
  } else {
    showGuestPopup(actionType);
  }
}
