(function () {
  const loader = document.querySelector("[data-loader]");
  if (!loader) return;

  const minVisibleTime = 0;
  const maxVisibleTime = 800;
  const start = performance.now();

  function hideLoader() {
    if (loader.classList.contains("is-hidden")) return;
    
    const elapsed = performance.now() - start;
    const delay = Math.max(0, minVisibleTime - elapsed);

    window.setTimeout(() => {
      loader.classList.add("is-hidden");

      window.setTimeout(() => {
        if (loader.parentNode) {
          loader.remove();
        }
        document.documentElement.classList.add("is-loaded");
      }, 700); // Wait for CSS transition to finish before removing
    }, delay);
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
    // Also bind to DOMContentLoaded as fallback if resources take too long
    document.addEventListener("DOMContentLoaded", () => {
      window.setTimeout(hideLoader, maxVisibleTime);
    }, { once: true });
  }

  // Absolute fallback in case events fail
  window.setTimeout(hideLoader, maxVisibleTime + 500);
})();
