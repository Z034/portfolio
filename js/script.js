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


/* nav bar & address bar */
const navLinks = document.querySelectorAll(".nav-tab");
const addressPath = document.querySelector("#address-path");
const basePath = addressPath.textContent.trim();

function setActiveSection(id) {
  let folderName = "";

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
      folderName = link.textContent.trim(); 
    } else {
      link.removeAttribute("aria-current");
    }
  });

  addressPath.textContent =
    id === "home" ? basePath : `${basePath}\\${folderName}`;
}


const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  },
  { rootMargin: "-35% 0px -60% 0px" }
);

document
  .querySelectorAll("main > section[id]")
  .forEach((section) => sectionObserver.observe(section));




/* contact form */
const CONTACT_EMAIL = "az.saci@ensta.edu.dz";

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




const rules = {
  name(value) {
    if (value === "") return "Please enter your name.";
    if (value.length < 2) return "Your name must have at least 2 characters.";
    return "";
  },
  email(value) {
    if (value === "") return "Please enter your email address.";
    if (!emailPattern.test(value)) {
      return "Please enter a valid email, like you@example.com.";
    }
    return "";
  },
  message(value) {
    if (value === "") return "Please write a message.";
    if (value.length < 10) {
      return "Your message must have at least 10 characters.";
    }
    return "";
  },
};



function validateField(input) {
  const errorBox = document.querySelector(`#${input.id}-error`);
  const errorText = rules[input.id](input.value.trim());

  errorBox.textContent = errorText;

  if (errorText) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }

  return errorText === "";
}


contactForm.addEventListener("input", (event) => {
  formStatus.textContent = "";

  if (event.target.matches('[aria-invalid="true"]')) {
    validateField(event.target);
  }
});

// fields check
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputs = [...contactForm.querySelectorAll("input, textarea")];
  const results = inputs.map(validateField);
  const firstInvalid = inputs.find((input, index) => !results[index]);

  if (firstInvalid) {
    firstInvalid.focus(); 
    return;
  }

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  const subject = `Portfolio message from ${name}`;
  const body = `${message}\n\n${name} (${email})`;
  const mailtoUrl =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  formStatus.textContent =
    `Thanks, ${name}! Your email app should open with your message ready ` +
    `to send. If nothing opens, write to ${CONTACT_EMAIL}.`;

  contactForm.reset();
  window.location.href = mailtoUrl;
});