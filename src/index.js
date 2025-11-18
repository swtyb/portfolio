// ========= DEBUG =========
console.log('index.js loaded');

// ========= IMAGE SOURCES (centralized) =========

// Intro images (these use actual files in /public you already have hooked up)
const INTRO_IMAGES = [
  require('../public/SZN_logo.png'),
  require('../public/bryanbabyphoto.png'),
  require('../public/bryankidphoto.png')
];

// Achievements images (from /public folder — change filenames to match yours)
const ACHIEVEMENTS_IMAGES = [
  '/achievements1.png',
  '/achievements2.png',
  '/achievements3.png'
];

// Hobby images (from /public folder — change filenames to match yours)
const HOBBY_IMAGES = [
  '/hobby1.png',
  '/hobby2.png',
  '/hobby3.png'
];

// Extra image for the spinning 3D carousel (PUT YOUR EXTRA IMAGE NAME HERE)
const EXTRA_SPINNER_IMAGE = '/achievements4.png';

// Spinner will reuse all of the above
const SPINNER_IMAGES = [
  ...INTRO_IMAGES,
  ...ACHIEVEMENTS_IMAGES,
  ...HOBBY_IMAGES,
  EXTRA_SPINNER_IMAGE
].slice(0, 10); // make sure we only take 10 images max


// ========= SMALL GENERIC CAROUSEL HELPER =========

function initCarousel(imgElement, navElement, imagesArray, fallbackUrl) {
  if (!imgElement || !navElement) return;
  if (!imagesArray || imagesArray.length === 0) {
    imgElement.src = fallbackUrl;
    return;
  }

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;
    const src = imagesArray[index];
    const tempImg = new Image();
    tempImg.onload = () => {
      imgElement.src = tempImg.src;
    };
    tempImg.onerror = () => {
      imgElement.src = fallbackUrl;
    };
    tempImg.src = src;

    const dots = navElement.querySelectorAll('button');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // build dots
  navElement.innerHTML = '';
  imagesArray.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to image ${index + 1}`);
    dot.addEventListener('click', () => showImage(index));
    navElement.appendChild(dot);
  });

  showImage(0);
}


// ========= MAIN DOM LOGIC =========

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // ========= LANDING / TITLE PAGE =========
  const LANDING_KEY = 'portfolio-landing-shown';
  const landing = document.getElementById('landing');
  const enterBtn = document.getElementById('enter-btn');
  const landingPhoto = document.getElementById('landing-photo');
  const landingFallback = document.getElementById('landing-avatar-fallback');

  if (!landing || !enterBtn) {
    console.warn('Landing elements not found.');
  } else {
    // Hide emoji if a real photo src is set
    if (landingPhoto && landingFallback && landingPhoto.getAttribute('src')) {
      landingFallback.style.display = 'none';
    }

    let landingSeen = false;
    try {
      landingSeen = sessionStorage.getItem(LANDING_KEY) === '1';
    } catch (err) {
      // ignore
    }

    if (landingSeen) {
      body.classList.remove('landing-active');
      landing.style.display = 'none';
    } else {
      body.classList.add('landing-active');
    }

    enterBtn.addEventListener('click', () => {
      console.log('Enter clicked');
      body.classList.remove('landing-active');

      setTimeout(() => {
        landing.style.display = 'none';
      }, 550);

      try {
        sessionStorage.setItem(LANDING_KEY, '1');
      } catch (err) {
        // ignore
      }
    });
  }

  const returnBtn = document.getElementById('return-btn');

  if (returnBtn) {
    // Show button once we've left the landing page
    if (!document.body.classList.contains('landing-active')) {
      returnBtn.classList.add('visible');
    }

    returnBtn.addEventListener('click', () => {
      // Go back to landing screen
      sessionStorage.removeItem('portfolio-landing-shown');
      document.body.classList.add('landing-active');

      const landing = document.getElementById('landing');
      landing.style.display = 'flex';
      setTimeout(() => {
        landing.style.opacity = '1';
      }, 10);

      // Hide button while on landing
      returnBtn.classList.remove('visible');
    });
  }

  // When clicking "Enter", hide the return button
  const enterButn = document.getElementById('enter-btn');
  enterButn.addEventListener('click', () => {
    setTimeout(() => {
      returnBtn.classList.add('visible');
    }, 600);
  });


  // ========= 3D SPINNING CAROUSEL (FRONT PAGE) =========
  // HTML: <div class="slider" id="spinner-slider"></div> inside .banner

  const spinnerSlider = document.getElementById('spinner-slider');
  if (!spinnerSlider) {
    console.warn('Spinner slider (#spinner-slider) not found in DOM.');
  } else {
    const validSpinnerImages = SPINNER_IMAGES.filter(Boolean);
    const count = validSpinnerImages.length;

    if (count === 0) {
      console.warn('No images provided for spinner; skipping.');
    } else {
      // Let CSS know how many items
      spinnerSlider.style.setProperty('--quantity', count.toString());

      // Build the 3D items
      validSpinnerImages.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.style.setProperty('--position', (index + 1).toString());

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Spinner image ${index + 1}`;
        item.appendChild(img);

        spinnerSlider.appendChild(item);
      });
    }
  }

  // ========= INTRO HERO CAROUSEL (main page) =========
  const heroImg = document.getElementById('hero-img');
  const heroNav = document.getElementById('carousel-nav');
  const fallbackIntro =
    'https://placehold.co/300x400/ff9a9e/white?text=Bryan';

  initCarousel(heroImg, heroNav, INTRO_IMAGES, fallbackIntro);

  // ========= OPTIONAL: Achievements & Hobby carousels =========
  // Only runs if you add the corresponding elements in HTML later.
  const achievementsImg = document.getElementById('achievements-img');
  const achievementsNav = document.getElementById('achievements-nav');
  const hobbyImg = document.getElementById('hobby-img');
  const hobbyNav = document.getElementById('hobby-nav');

  const fallbackAchievements =
    'https://placehold.co/300x400/f3f4f6/999?text=Achievements';
  const fallbackHobby =
    'https://placehold.co/300x400/e0f2fe/555?text=Hobbies';

  if (achievementsImg && achievementsNav) {
    initCarousel(achievementsImg, achievementsNav, ACHIEVEMENTS_IMAGES, fallbackAchievements);
  }

  if (hobbyImg && hobbyNav) {
    initCarousel(hobbyImg, hobbyNav, HOBBY_IMAGES, fallbackHobby);
  }

  // ========= CONTACT MODAL =========
  const contactBtn = document.getElementById('contact-btn');
  const contactModal = document.getElementById('contact-modal');
  const closeModal = document.getElementById('close-modal');

  if (contactBtn && contactModal && closeModal) {
    contactBtn.addEventListener('click', () => {
      contactModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
      contactModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  } else {
    console.warn('Contact modal elements not found.');
  }

  // ========= SECTION SWITCHER (FOOTER TABS) =========
  const footerLinks = document.querySelectorAll('.footer-link');
  const sections = document.querySelectorAll('.section');

  if (footerLinks.length && sections.length) {
    footerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const targetId = link.dataset.section;

        sections.forEach((sec) => {
          sec.classList.toggle('active', sec.id === targetId);
        });

        footerLinks.forEach((btn) =>
          btn.classList.toggle('active', btn === link)
        );
      });
    });
  } else {
    console.warn('Footer links or sections not found for section switcher.');
  }

  // ========= THEME SWITCHER =========
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
    // sunset = default

    themeOptions.forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.theme === themeName);
    });

    try {
      localStorage.setItem(THEME_KEY, themeName);
    } catch (err) {
      // ignore
    }
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
  } catch (err) {
    // ignore
  }
  applyTheme(initialTheme);
});
