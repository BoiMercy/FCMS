const dialog = document.querySelector("#request-dialog");
const form = document.querySelector("#request-form");
const rows = document.querySelector("#request-rows");
const search = document.querySelector("#search");
const toast = document.querySelector("#toast");
let selectedFilter = "all";
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function filterRequests() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const row of rows.rows) {
    const matches =
      (selectedFilter === "all" || row.dataset.status === selectedFilter) &&
      row.textContent.toLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) count += 1;
  }
  document.querySelector("#empty").hidden = count > 0;
  document.querySelector("#showing-count").textContent = count;
}

document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    selectedFilter = tab.dataset.filter;
    document
      .querySelectorAll(".tab")
      .forEach((item) => item.classList.toggle("selected", item === tab));
    filterRequests();
  }),
);
search.addEventListener("input", filterRequests);

document
  .querySelector("#new-request")
  .addEventListener("click", () => dialog.showModal());
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
document
  .querySelector("#cancel-dialog")
  .addEventListener("click", () => dialog.close());
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(form);
  const type = String(values.get("type"));
  const department = String(values.get("department"));
  const id = `FC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
  const row = document.createElement("tr");
  row.dataset.status = "pending";
  row.innerHTML =
    '<td><b></b><small></small></td><td></td><td></td><td><span class="status pending">● Pending</span></td><td><button class="row-open">↗</button></td>';
  row.querySelector("td:first-child b").textContent = type;
  row.querySelector("td:first-child small").textContent = id;
  row.children[1].textContent = department;
  row.children[2].textContent = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());
  row.querySelector(".row-open").setAttribute("aria-label", `View ${id}`);
  rows.prepend(row);

  const total = Number(document.querySelector("#total-count").textContent) + 1;
  const pending =
    Number(document.querySelector("#pending-count").textContent) + 1;
  document.querySelector("#total-count").textContent = total;
  document.querySelector("#request-total").textContent = total;
  document.querySelector("#pending-count").textContent = String(
    pending,
  ).padStart(2, "0");
  document.querySelector("#pending-nav").textContent = pending;
  document.querySelector('[data-filter="all"] span').textContent = total;
  document.querySelector('[data-filter="pending"] span').textContent = pending;
  form.reset();
  dialog.close();
  selectedFilter = "all";
  document
    .querySelectorAll(".tab")
    .forEach((tab) =>
      tab.classList.toggle("selected", tab.dataset.filter === "all"),
    );
  filterRequests();
  notify(`${type} submitted to ${department}.`);
});

document.querySelectorAll("[data-page]").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document
      .querySelectorAll(".nav-link")
      .forEach((item) => item.classList.toggle("active", item === link));
    document.querySelector("#page-title").textContent = link.dataset.page;
    document.querySelector("#sidebar").classList.remove("open");
    if (link.dataset.page !== "Overview")
      notify(`${link.dataset.page} selected.`);
  }),
);
document.querySelector("#view-all").addEventListener("click", () => {
  selectedFilter = "all";
  search.value = "";
  document
    .querySelectorAll(".tab")
    .forEach((tab) =>
      tab.classList.toggle("selected", tab.dataset.filter === "all"),
    );
  filterRequests();
  notify("Showing all clearance requests.");
});
document
  .querySelector("#dismiss-deadline")
  .addEventListener("click", () =>
    document.querySelector("#deadline").remove(),
  );
document
  .querySelector("#notifications")
  .addEventListener("click", () =>
    notify("You have 3 clearance requests that need attention."),
  );
document
  .querySelector("#help-button")
  .addEventListener("click", () =>
    notify("Contact the academic services help desk for assistance."),
  );
document
  .querySelector("#directory")
  .addEventListener("click", () => notify("Department directory opened."));
document
  .querySelector("#department-more")
  .addEventListener("click", () =>
    notify("Department approval summary is up to date."),
  );
document
  .querySelector("#profile-button")
  .addEventListener("click", () =>
    notify("Signed in as Jordan Davis, faculty administrator."),
  );
document
  .querySelector("#menu-button")
  .addEventListener("click", () =>
    document.querySelector("#sidebar").classList.toggle("open"),
  );
document
  .querySelectorAll(".row-open")
  .forEach((button) =>
    button.addEventListener("click", () =>
      notify(
        `Opening ${button.getAttribute("aria-label") || "clearance request"}.`,
      ),
    ),
  );

filterRequests();
