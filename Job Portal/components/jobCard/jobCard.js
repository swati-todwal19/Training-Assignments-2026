
function renderJobCard(job) {

  fetch("components/jobCard/jobCard.html")
    .then(response => response.text())
    .then(template => {
      template = template
        .replace("{{logo}}", job.logo)
        .replace("{{company}}", job.company)
        .replace("{{location}}", job.location)
        .replace("{{title}}", job.title)
        .replace("{{positions}}", job.positions)
        .replace("{{type}}", job.type)
        .replace("{{experience}}", job.experience)
        .replace("{{salary}}", job.salary);

      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = template;

      const viewBtn = card.querySelector(".view-details-btn");
      viewBtn.addEventListener("click", () => {
        jobDescriptionContent.innerHTML = renderJobDescription(job.description);
        jobDescriptionBox.classList.remove("hidden");

        document.body.style.overflow = "hidden";

        const closeDescBtn = document.getElementById("closeDescBtn");
        closeDescBtn.addEventListener("click", () => {
          jobDescriptionBox.classList.add("hidden");
          jobDescriptionContent.innerHTML = "";
          document.body.style.overflow = "auto";
        });
      });

      jobListEl.appendChild(card);
    })
    .catch(error => {
      console.error("Error loading job card template:", error);
    });
}
