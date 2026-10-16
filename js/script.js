"use strict";

/* back to up button */
const toTop = document.querySelector(".to-top");

function updateToTop() {
  toTop.classList.toggle("is-visible", window.scrollY > 400);
}

window.addEventListener("scroll", updateToTop, { passive: true });
updateToTop();

/* sidebar */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const menuClose = document.querySelector(".main-nav__close");
const pageParts = document.querySelectorAll(
  "main, .site-footer, .to-top, .skip-link"
);
const desktopQuery = window.matchMedia("(min-width: 40rem)");

function isMenuOpen() {
  return mainNav.classList.contains("is-open");
}

function openMenu() {
  mainNav.classList.add("is-open");
  document.body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  // "inert" stops keyboard and screen reader access to the page behind
  pageParts.forEach((part) => (part.inert = true));
  menuClose.focus();
}

function closeMenu({ returnFocus = false } = {}) {
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  pageParts.forEach((part) => (part.inert = false));
  if (returnFocus) menuToggle.focus();
}

// Menu button
menuToggle.addEventListener("click", () => {
  if (isMenuOpen()) {
    closeMenu();
  } else {
    openMenu();
  }
});

// × button
menuClose.addEventListener("click", () => closeMenu({ returnFocus: true }));

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("click", (event) => {
  if (!isMenuOpen()) return;
  if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isMenuOpen()) {
    closeMenu({ returnFocus: true });
  }
});

desktopQuery.addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});