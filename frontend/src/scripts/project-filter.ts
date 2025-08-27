const filters: NodeListOf<HTMLLIElement> = document.querySelectorAll("#portfolio-filter > li");
const portfolioItems: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("#portfolio-items > a");

filters?.forEach(filter => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter);
    filterItems(filter.dataset.category ?? "");
  });
});

function setActiveFilter(filter: HTMLLIElement) {
  const currentActiveFilter = document.querySelector("#portfolio-filter > li.active");
  currentActiveFilter?.classList.remove("active");
  filter.classList.add("active");
}

function filterItems(category: string) {
  if (category === "all" || category === "") {
    portfolioItems.forEach(item => item.classList.remove("hidden"))
    return;
  }

  portfolioItems.forEach(item => {
    if (!item.dataset.categories?.split(";").includes(category) || category == "") {
      item.classList.add("hidden");
      return;
    }

    item.classList.remove("hidden");
  });
}
