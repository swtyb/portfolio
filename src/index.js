// Require images so webpack knows to include them
const saitama1 = require('../public/saitama1.png');
const saitama2 = require('../public/saitama2.png');
const saitama3 = require('../public/saitama3.png');

// ===== IMAGE CAROUSEL JS =====
const imageUrls = [
  saitama1,
  saitama2,
  saitama3
  // Add more image filenames here if needed
];

let currentImageIndex = 0;
const heroImg = document.getElementById('hero-img');
const carouselNav = document.getElementById('carousel-nav');

// Fallback image if none load
const fallbackImage = 'https://placehold.co/300x400/ff9a9e/white?text=Saitama';

if (imageUrls.length === 0) {
  heroImg.src = fallbackImage;
} else if (imageUrls.length === 1) {
  heroImg.src = imageUrls[0];
} else {
  // Create navigation dots
  imageUrls.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to image ${index + 1}`);
    dot.addEventListener('click', () => showImage(index));
    carouselNav.appendChild(dot);
  });

  // Show first image
  showImage(0);
}

function showImage(index) {
  currentImageIndex = index;
  const img = new Image();
  img.onload = () => {
    heroImg.src = img.src;
  };
  img.onerror = () => {
    heroImg.src = fallbackImage;
  };
  img.src = imageUrls[index];

  // Update active dot
  const dots = carouselNav.querySelectorAll('button');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// ===== CONTACT MODAL =====
document.getElementById('contact-btn').addEventListener('click', () => {
  document.getElementById('contact-modal').style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('contact-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('contact-modal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});