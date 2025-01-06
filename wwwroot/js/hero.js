/** @type {HTMLPictureElement | null} */
const heroPicture = document.querySelector('#hero > picture');
if (!heroPicture) throw new Error("No picture element was found within `#hero`");

/** @type {HTMLImageElement | null} */
const heroImage = heroPicture.querySelector('img');
if (!heroImage) throw new Error("No img element was found within `#hero > picture`");

const startTime = performance.now();

// Add a simple parallax effect to the hero section
window.addEventListener('scroll', () => {
  const parallaxStrength = 0.25;
  heroPicture.style.transform = `translateY(${window.scrollY * parallaxStrength}px)`;
});

// Adding a nice fade-in effect to the hero image
heroImage.onload = () => {
  const thresholdInMs = 500;
  // if the time it has taken to load the image is less than the threshold,
  // transition with a short animation (200ms)
  if (performance.now() - startTime < thresholdInMs) {
    heroPicture.classList.add('opacity-100');
    return
  };
  // otherwise transition with a longer animation (1000ms)
  heroPicture.classList.add('opacity-100', 'duration-1000');
};

heroImage.onerror = () => {
  console.error('No image found with the src path: ', heroImage.currentSrc);
};
