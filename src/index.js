// ========= DEBUG =========
console.log('index.js loaded');

// ========= IMAGE SOURCES (webpack will process these) =========

// Intro images
const INTRO_IMAGES = [
  require('../public/SZN_logo.png'),
  require('../public/bryanbabyphoto.png'),
  require('../public/bryankidphoto.png')
];

// Achievements images
const ACHIEVEMENTS_IMAGES = [
  require('../public/achievements1.png'),
  require('../public/achievements2.png'),
  require('../public/achievements3.png')
];

// Hobby images
const HOBBY_IMAGES = [
  require('../public/hobby1.png'),
  require('../public/hobby2.png'),
  require('../public/hobby3.png')
];

// Extra image for spinner
const EXTRA_SPINNER_IMAGE = require('../public/achievements4.png');

// Spinner uses all of the above
const SPINNER_IMAGES = [
  ...INTRO_IMAGES,
  ...ACHIEVEMENTS_IMAGES,
  ...HOBBY_IMAGES,
  EXTRA_SPINNER_IMAGE
].slice(0, 10);

// ========= SMALL GENERIC CAROUSEL HELPER =========

function initCarousel(imgElement, navElement, imagesArray, fallbackUrl) {
  if (!imgElement || !navElement) return;

  if (!imagesArray || !imagesArray.length) {
    imgElement.src = fallbackUrl;
    return;
  }

  let currentIndex = 0;
  let isChanging = false;

  function showImage(index) {
    if (isChanging) return;
    isChanging = true;
    currentIndex = index;

    const src = imagesArray[index];
    const temp = new Image();

    // start fade-out
    imgElement.classList.add('img-transition-out');

    temp.onload = () => {
      setTimeout(() => {
        imgElement.src = temp.src;

        void imgElement.offsetHeight; // force reflow

        imgElement.classList.remove('img-transition-out');

        setTimeout(() => {
          isChanging = false;
        }, 350);
      }, 120);
    };

    temp.onerror = () => {
      console.warn('Image failed to load:', src);
      imgElement.src = fallbackUrl;
      imgElement.classList.remove('img-transition-out');
      isChanging = false;
    };

    temp.src = src;

    navElement.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  navElement.innerHTML = '';
  imagesArray.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.addEventListener('click', () => showImage(i));
    navElement.appendChild(dot);
  });

  showImage(0);
}

// ========= MAIN DOCUMENT LOGIC =========

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // ===== SCROLL HINT =====
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }
  });

  // ===== LANDING =====
  const LANDING_KEY = 'portfolio-landing-shown';
  const landing = document.getElementById('landing');
  const enterBtn = document.getElementById('enter-btn');

  let landingSeen = false;
  try {
    landingSeen = sessionStorage.getItem(LANDING_KEY) === '1';
  } catch {}

  if (landingSeen) {
    body.classList.remove('landing-active');
    if (landing) landing.style.display = 'none';
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      body.classList.remove('landing-active');
      setTimeout(() => {
        if (landing) landing.style.display = 'none';
      }, 550);

      try {
        sessionStorage.setItem(LANDING_KEY, '1');
      } catch {}
    });
  }

  // ===== RETURN BUTTON =====
  const returnBtn = document.getElementById('return-btn');

  if (returnBtn) {
    if (!body.classList.contains('landing-active')) {
      returnBtn.classList.add('visible');
    }

    returnBtn.addEventListener('click', () => {
      try {
        sessionStorage.removeItem(LANDING_KEY);
      } catch {}
      body.classList.add('landing-active');

      if (landing) {
        landing.style.display = 'flex';
        landing.style.opacity = '0';
        setTimeout(() => {
          landing.style.opacity = '1';
        }, 20);
      }

      returnBtn.classList.remove('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        setTimeout(() => {
          returnBtn.classList.add('visible');
        }, 600);
      });
    }
  }

  // ===== 3D SPINNER CAROUSEL =====
  const spinner = document.getElementById('spinner-slider');
  if (spinner && SPINNER_IMAGES && SPINNER_IMAGES.length) {
    const imgs = SPINNER_IMAGES.filter(Boolean);
    if (imgs.length) {
      spinner.style.setProperty('--quantity', imgs.length.toString());

      imgs.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.style.setProperty('--position', (index + 1).toString());

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Spinner image ${index + 1}`;

        item.appendChild(img);
        spinner.appendChild(item);
      });
    }
  }

  // ===== INTRO CAROUSEL =====
  const fallbackIntro =
    'https://placehold.co/300x400/ff9a9e/white?text=Bryan';

  initCarousel(
    document.getElementById('hero-img'),
    document.getElementById('carousel-nav'),
    INTRO_IMAGES,
    fallbackIntro
  );

  // ===== OTHER CAROUSELS =====
  const fallbackAchievements =
    'https://placehold.co/300x400/f3f4f6/999?text=Achievements';
  const fallbackHobby =
    'https://placehold.co/300x400/e0f2fe/555?text=Hobbies';

  initCarousel(
    document.getElementById('achievements-img'),
    document.getElementById('achievements-nav'),
    ACHIEVEMENTS_IMAGES,
    fallbackAchievements
  );

  initCarousel(
    document.getElementById('hobby-img'),
    document.getElementById('hobby-nav'),
    HOBBY_IMAGES,
    fallbackHobby
  );

  // ===== CONTACT MODAL =====
  const modal = document.getElementById('contact-modal');
  const contactBtn = document.getElementById('contact-btn');
  const closeModal = document.getElementById('close-modal');

  if (modal && contactBtn && closeModal) {
    contactBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // ===== SECTION SWITCHER WITH RANDOM ANIMATIONS =====
  const footerLinks = document.querySelectorAll('.footer-link');
  const sections = document.querySelectorAll('.section');

  if (footerLinks.length && sections.length) {
    const ANIM_CLASSES = ['anim-fade', 'anim-slide', 'anim-zoom'];

    function clearAnimClasses(el) {
      el.classList.remove('anim-fade', 'anim-slide', 'anim-zoom', 'showing');
    }

    footerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const targetId = link.dataset.section;

        sections.forEach((sec) => {
          clearAnimClasses(sec);
          sec.classList.remove('active');
        });

        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('active');

          const anim =
            ANIM_CLASSES[Math.floor(Math.random() * ANIM_CLASSES.length)];
          target.classList.add(anim);

          requestAnimationFrame(() => {
            target.classList.add('showing');
          });

          // just scroll to top of page when switching sections
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        footerLinks.forEach((btn) =>
          btn.classList.toggle('active', btn === link)
        );
      });
    });

    const initialActive = document.querySelector('.section.active');
    if (initialActive) {
      initialActive.classList.add('showing');
    }
  } else {
    console.warn('Footer links or sections not found for section switcher.');
  }

  // ===== THEME SWITCHER =====
  const THEME_KEY = 'portfolio-theme';
  const themeToggle = document.getElementById('theme-toggle');
  const themePanel = document.getElementById('theme-panel');
  const themeOptions = document.querySelectorAll('.theme-option');
  const themeClassNames = ['theme-ocean', 'theme-forest', 'theme-midnight'];

  function applyTheme(themeName) {
    themeClassNames.forEach((cls) => document.body.classList.remove(cls));

    if (themeName === 'ocean') {
      document.body.classList.add('theme-ocean');
    } else if (themeName === 'forest') {
      document.body.classList.add('theme-forest');
    } else if (themeName === 'midnight') {
      document.body.classList.add('theme-midnight');
    }

    themeOptions.forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.theme === themeName);
    });

    try {
      localStorage.setItem(THEME_KEY, themeName);
    } catch {}
    console.log('Applied theme:', themeName);
  }

  if (themeToggle && themePanel) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themePanel.classList.toggle('open');
    });

    window.addEventListener('click', (e) => {
      if (!themePanel.contains(e.target) && e.target !== themeToggle) {
        themePanel.classList.remove('open');
      }
    });
  } else {
    console.warn('Theme toggle or panel not found.');
  }

  if (themeOptions.length) {
    themeOptions.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = opt.dataset.theme || 'sunset';
        applyTheme(theme);
        themePanel.classList.remove('open');
      });
    });
  } else {
    console.warn('No .theme-option elements found.');
  }

  let initialTheme = 'sunset';
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      initialTheme = savedTheme;
    }
  } catch {}
  applyTheme(initialTheme);
});
