/**
 * Reveals <img> elements only once their content has loaded, so images
 * fade in instead of popping in after an empty placeholder.
 *
 * Pairs with the `img:not(.img-loaded)` rules in styles.css.
 */
const reveal = (event: Event) => {
  if (event.target instanceof HTMLImageElement) {
    event.target.classList.add("img-loaded");
  }
};

// `load`/`error` events do not bubble, but they can be captured at the
// document level - one listener covers every <img> ever added to the page.
document.addEventListener("load", reveal, true);
// Reveal broken images too so they don't stay invisible forever
document.addEventListener("error", reveal, true);

// Images that finished loading before these listeners attached (e.g. from
// index.html) will never fire `load` again - reveal them now.
document.querySelectorAll("img").forEach((img) => {
  if (img.complete) img.classList.add("img-loaded");
});

export {};
