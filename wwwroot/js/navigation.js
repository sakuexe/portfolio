/** @type {HTMLElement | null}*/
const mobileNavigation = document.querySelector('#mobile-navigation');
if (!mobileNavigation) throw new Error("element `#mobile-navigation` not found");

/** @type {HTMLButtonElement | null}*/
const toggleButton = mobileNavigation.querySelector('button');
if (!toggleButton) throw new Error("element `#mobile-navigation button` not found");

/** @type {HTMLDivElement | null}*/
const dropdown = mobileNavigation.querySelector('.dropdown-menu');
if (!dropdown) throw new Error("element `#mobile-navigation .dropdown-menu` not found");

/** @type {NodeListOf<HTMLAnchorElement> | null}*/
const navLinks = mobileNavigation.querySelectorAll('a');
if (navLinks.length <= 0) throw new Error("no link elements found inside `#mobile-navigation`");

toggleButton.addEventListener('click', () => {
  dropdown.classList.toggle('hidden');
  toggleButtonAnimation();
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
    toggleButtonAnimation();
  });
});

function toggleButtonAnimation() {
  // @ts-ignore - toggle button nullability is already checked
  const bars = toggleButton.querySelectorAll('div');
  if (bars.length < 3) throw new Error(`not enough bars found inside toggleButton. Found: ${bars.length}`);

  bars.forEach((bar) => {
    bar.classList.toggle("absolute");
    bar.classList.toggle("inset-0");
    bar.classList.toggle("m-auto");
    bar.classList.toggle("w-3/4");
  });
  // hide the middle bar
  bars[1].classList.toggle("opacity-0");
  bars[1].classList.toggle("delay-100");
  // rotate the other bars 45 degrees
  bars[0].classList.toggle("rotate-45");
  bars[0].classList.toggle("w-full");
  bars[2].classList.toggle("-rotate-45");
}
