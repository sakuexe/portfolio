/** @type {NodeListOf<HTMLLIElement>} */
const filters = document.querySelectorAll('#portfolio-filter > li');
/** @type {NodeListOf<HTMLAnchorElement>} */
const portfolioItems = document.querySelectorAll('#portfolio-items > a');
const activeClasses = ['text-secondary-400', 'no-underline'];

filters?.forEach(filter => {
  filter.addEventListener('click', () => {
    clearFilters();
    setActiveFilter(filter);
    filterItems(filter.dataset.category ?? "");
  });
});

/** @param {HTMLLIElement} filter */
function setActiveFilter(filter) {
  const currentActiveFilter = document.querySelector('#portfolio-filter > li > span.text-secondary-400');
  currentActiveFilter?.classList.remove(...activeClasses);
  currentActiveFilter?.classList.add('underline');
  filter.querySelector("span")?.classList.add(...activeClasses);
}

function clearFilters() {
  portfolioItems.forEach(item => {
    item.classList.remove('hidden');
  });
}

/** @param {string} category */
function filterItems(category) {
  if (category === 'all' || category === '') {
    return;
  }
  portfolioItems.forEach(item => {
    if (item.dataset.category !== category) {
      item.classList.add('hidden');
    }
  });
}
