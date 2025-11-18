// ========= DEBUG =========
console.log('index.js loaded');

// ========= IMAGE SOURCES (must exist in /public folder) =========

const INTRO_IMAGES = [
  '/SZN_logo.png',
  '/bryanbabyphoto.png',
  '/bryankidphoto.png'
];

const ACHIEVEMENTS_IMAGES = [
  '/achievements1.png',
  '/achievements2.png',
  '/achievements3.png'
];

const HOBBY_IMAGES = [
  '/hobby1.png',
  '/hobby2.png',
  '/hobby3.png'
];

const EXTRA_SPINNER_IMAGE = '/achievements4.png';

// Maximum of 10 spinner images
const SPINNER_IMAGES = [
  ...INTRO_IMAGES,
  ...ACHIEVEMENTS_IMAGES,
  ...HOBBY_IMAGES,
  EXTRA_SPINNER_IMAGE
].filter(Boolean).slice(0, 10);


// ========= SMALL GENERIC CAROUSEL HELPER =========

function initCarousel(imgElement, navElement, imagesArray, fallbackUrl) {
  if (!imgElement || !navElement) return;

  if (!imagesArray.length) {
    imgElement.src = fallbackUrl;
    return;
  }

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;

    const src = imagesArray[index];
    const temp = new Image();

    temp.onload = () => (imgElement.src = temp.src);
    temp.onerror = () => {
      console.warn("Failed image:", src);
      imgElement.src = fallbackUrl;
    };

    temp.src = src;

    navElement.querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  navElement.innerHTML = "";
  imagesArray.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => showImage(i));
    navElement.appendChild(dot);
  });

  showImage(0);
}


// ========= MAIN DOCUMENT LOGIC =========

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // ===== LANDING =====
  const LANDING_KEY = "portfolio-landing-shown";
  const landing = document.getElementById("landing");
  const enterBtn = document.getElementById("enter-btn");

  let landingSeen = false;
  try {
    landingSeen = sessionStorage.getItem(LANDING_KEY) === "1";
  } catch {}

  if (landingSeen) {
    body.classList.remove("landing-active");
    if (landing) landing.style.display = "none";
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      body.classList.remove("landing-active");
      setTimeout(() => {
        if (landing) landing.style.display = "none";
      }, 550);

      try {
        sessionStorage.setItem(LANDING_KEY, "1");
      } catch {}
    });
  }

  // ===== RETURN BUTTON =====
  const returnBtn = document.getElementById("return-btn");

  if (returnBtn) {
    if (!body.classList.contains("landing-active"))
      returnBtn.classList.add("visible");

    returnBtn.addEventListener("click", () => {
      sessionStorage.removeItem(LANDING_KEY);
      body.classList.add("landing-active");

      landing.style.display = "flex";
      landing.style.opacity = "0";
      setTimeout(() => (landing.style.opacity = "1"), 20);

      returnBtn.classList.remove("visible");
    });

    if (enterBtn) {
      enterBtn.addEventListener("click", () =>
        setTimeout(() => returnBtn.classList.add("visible"), 600)
      );
    }
  }

  // ===== 3D SPINNER CAROUSEL =====
  const spinner = document.getElementById("spinner-slider");

  if (spinner) {
    const imgs = SPINNER_IMAGES;
    spinner.style.setProperty("--quantity", imgs.length.toString());

    imgs.forEach((src, index) => {
      const div = document.createElement("div");
      div.className = "item";
      div.style.setProperty("--position", index + 1);

      const img = document.createElement("img");
      img.src = src;
      img.alt = "spinner image";

      div.appendChild(img);
      spinner.appendChild(div);
    });
  }

  // ===== INTRO CAROUSEL =====
  initCarousel(
    document.getElementById("hero-img"),
    document.getElementById("carousel-nav"),
    INTRO_IMAGES,
    "https://placehold.co/300x400/ff9a9e/white?text=Bryan"
  );

  // ===== OTHER CAROUSELS =====
  initCarousel(
    document.getElementById("achievements-img"),
    document.getElementById("achievements-nav"),
    ACHIEVEMENTS_IMAGES,
    "https://placehold.co/300x400/f3f4f6/999?text=Achievements"
  );

  initCarousel(
    document.getElementById("hobby-img"),
    document.getElementById("hobby-nav"),
    HOBBY_IMAGES,
    "https://placehold.co/300x400/e0f2fe/555?text=Hobbies"
  );

  // ===== CONTACT MODAL =====
  const modal = document.getElementById("contact-modal");
  const contactBtn = document.getElementById("contact-btn");
  const closeModal = document.getElementById("close-modal");

  if (modal && contactBtn && closeModal) {
    contactBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  // ===== SECTION SWITCHER =====
  const links = document.querySelectorAll(".footer-link");
  const sections = document.querySelectorAll(".section");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.dataset.section;

      sections.forEach((s) => s.classList.toggle("active", s.id === id));
      links.forEach((l) => l.classList.toggle("active", l === link));
    });
  });

  // ===== THEME SWITCHER =====
  const THEME_KEY = "portfolio-theme";
  const themeToggle = document.getElementById("theme-toggle");
  const panel = document.getElementById("theme-panel");
  const options = document.querySelectorAll(".theme-option");

  function applyTheme(theme) {
    body.classList.remove("theme-ocean", "theme-forest", "theme-midnight");

    if (theme === "ocean") body.classList.add("theme-ocean");
    if (theme === "forest") body.classList.add("theme-forest");
    if (theme === "midnight") body.classList.add("theme-midnight");

    options.forEach((o) => o.classList.toggle("active", o.dataset.theme === theme));

    localStorage.setItem(THEME_KEY, theme);
  }

  if (themeToggle && panel) {
    themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });

    window.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && e.target !== themeToggle) {
        panel.classList.remove("open");
      }
    });
  }

  options.forEach((o) =>
    o.addEventListener("click", () => {
      applyTheme(o.dataset.theme);
      panel.classList.remove("open");
    })
  );

  applyTheme(localStorage.getItem(THEME_KEY) || "sunset");
});
