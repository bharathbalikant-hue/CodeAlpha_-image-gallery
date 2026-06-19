'use strict';

const PHOTOS = [
  { index: 0, src: 'images/mountains.png',    alt: 'Golden sunset over dramatic mountain peaks',                category: 'nature',       title: 'Golden Peaks',         meta: 'Mountain Landscape · Sunset'    },
  { index: 1, src: 'images/beach.png',        alt: 'Aerial view of tropical beach with turquoise water',        category: 'nature',       title: 'Turquoise Dreams',     meta: 'Tropical Beach · Aerial'        },
  { index: 2, src: 'images/city.png',         alt: 'Futuristic city skyline glowing with neon at night',        category: 'city',         title: 'Neon Nights',          meta: 'Cityscape · Night'              },
  { index: 3, src: 'images/forest.png',       alt: 'Enchanted misty forest with sunbeams through ancient trees',category: 'nature',       title: 'Enchanted Forest',     meta: 'Forest · Mist & Light'         },
  { index: 4, src: 'images/architecture.png', alt: 'Modern glass skyscraper with geometric patterns',           category: 'architecture', title: 'Glass & Steel',        meta: 'Modern Architecture · Geometry' },
  { index: 5, src: 'images/wildlife.png',     alt: 'Majestic lion portrait in golden savanna light',            category: 'wildlife',     title: 'King of the Savanna',  meta: 'Wildlife · Africa'             },
  { index: 6, src: 'images/aurora.png',       alt: 'Northern Lights aurora reflecting over snowy mountain lake',category: 'nature',       title: 'Aurora Borealis',      meta: 'Northern Lights · Iceland'      },
  { index: 7, src: 'images/desert.png',       alt: 'Vast Sahara desert sand dunes with dramatic sunrise shadows',category: 'nature',      title: 'Desert Dawn',          meta: 'Sahara Desert · Sunrise'        },
  { index: 8, src: 'images/waterfall.png',    alt: 'Spectacular waterfall in tropical rainforest',              category: 'nature',       title: 'Cascade Falls',        meta: 'Waterfall · Rainforest'         },
];

let activeFilter   = 'all';
let activeSearch   = '';
let lightboxOpen   = false;
let currentIndex   = 0;
let visiblePhotos  = [...PHOTOS];
let currentFilter  = 'none';

const galleryGrid  = document.getElementById('galleryGrid');
const emptyState   = document.getElementById('emptyState');
const photoCount   = document.getElementById('photoCount');
const searchInput  = document.getElementById('searchInput');
const filterBtns   = document.querySelectorAll('.filter-btn');

const lightbox     = document.getElementById('lightbox');
const lbBackdrop   = document.getElementById('lbBackdrop');
const lbClose      = document.getElementById('lbClose');
const lbPrev       = document.getElementById('lbPrev');
const lbNext       = document.getElementById('lbNext');
const lbImg        = document.getElementById('lbImg');
const lbLoader     = document.getElementById('lbLoader');
const lbTitle      = document.getElementById('lbTitle');
const lbCategory   = document.getElementById('lbCategory');
const lbCounter    = document.getElementById('lbCounter');
const lbStrip      = document.getElementById('lbStrip');
const lbFilterPills= document.querySelectorAll('.lb-filter-pill');

function getVisiblePhotos() {
  return PHOTOS.filter(p => {
    const matchCat    = activeFilter === 'all' || p.category === activeFilter;
    const searchLower = activeSearch.toLowerCase();
    const matchSearch = !searchLower ||
      p.title.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      p.meta.toLowerCase().includes(searchLower);
    return matchCat && matchSearch;
  });
}

function applyFilter() {
  visiblePhotos = getVisiblePhotos();
  const visibleIds = new Set(visiblePhotos.map(p => p.index));

  document.querySelectorAll('.gallery-card').forEach(card => {
    const idx = parseInt(card.dataset.index, 10);
    if (visibleIds.has(idx)) {
      card.classList.remove('hidden');
      card.style.position = '';
      card.style.visibility = '';
    } else {
      card.classList.add('hidden');
    }
  });

  const n = visiblePhotos.length;
  photoCount.textContent = `${n} Photo${n !== 1 ? 's' : ''}`;

  if (n === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilter();
  });
});

searchInput.addEventListener('input', () => {
  activeSearch = searchInput.value;
  applyFilter();
});

function openLightbox(photoIndex) {
  let pos = visiblePhotos.findIndex(p => p.index === photoIndex);
  if (pos === -1) {
    visiblePhotos = PHOTOS;
    pos = PHOTOS.findIndex(p => p.index === photoIndex);
  }
  currentIndex = pos;
  lightboxOpen = true;

  buildStrip();

  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';

  loadLbImage(currentIndex);

  lbClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxOpen = false;
  document.body.style.overflow = '';
  currentFilter = 'none';
  lbFilterPills.forEach(p => p.classList.remove('active'));
  document.getElementById('lbFilterNone').classList.add('active');
  lbImg.removeAttribute('data-filter');
}

function loadLbImage(pos) {
  const photo = visiblePhotos[pos];
  if (!photo) return;

  lbLoader.classList.add('loading');
  lbImg.style.opacity = '0';

  const tmp = new Image();
  tmp.onload = () => {
    lbImg.src        = photo.src;
    lbImg.alt        = photo.alt;
    lbImg.dataset.filter = currentFilter === 'none' ? '' : currentFilter;
    if (currentFilter !== 'none') {
      lbImg.setAttribute('data-filter', currentFilter);
    } else {
      lbImg.removeAttribute('data-filter');
    }

    lbLoader.classList.remove('loading');
    lbImg.style.opacity = '1';

    lbTitle.textContent    = photo.title;
    lbCategory.textContent = photo.category.charAt(0).toUpperCase() + photo.category.slice(1);
    lbCounter.textContent  = `${pos + 1} / ${visiblePhotos.length}`;

    lbPrev.disabled = pos === 0;
    lbNext.disabled = pos === visiblePhotos.length - 1;

    document.querySelectorAll('.lb-thumb').forEach((th, i) => {
      th.classList.toggle('active', i === pos);
    });

    const activeTh = lbStrip.querySelector('.lb-thumb.active');
    if (activeTh) activeTh.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };
  tmp.onerror = () => {
    lbLoader.classList.remove('loading');
    lbImg.style.opacity = '1';
  };
  tmp.src = photo.src;
}

function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= visiblePhotos.length) return;
  currentIndex = next;
  loadLbImage(currentIndex);
}

function buildStrip() {
  lbStrip.innerHTML = '';
  visiblePhotos.forEach((photo, i) => {
    const img = document.createElement('img');
    img.src       = photo.src;
    img.alt       = photo.title;
    img.className = 'lb-thumb';
    img.id        = `lbThumb${i}`;
    img.loading   = 'lazy';
    img.addEventListener('click', () => {
      currentIndex = i;
      loadLbImage(currentIndex);
    });
    lbStrip.appendChild(img);
  });
}

galleryGrid.addEventListener('click', e => {
  const btn  = e.target.closest('.btn-expand');
  const card = e.target.closest('.gallery-card');

  if (btn) {
    e.stopPropagation();
    openLightbox(parseInt(btn.dataset.index, 10));
    return;
  }
  if (card) {
    openLightbox(parseInt(card.dataset.index, 10));
  }
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigate(-1));
lbNext.addEventListener('click', () => navigate(1));

lbFilterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    lbFilterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentFilter = pill.dataset.lbFilter;

    if (currentFilter === 'none') {
      lbImg.removeAttribute('data-filter');
    } else {
      lbImg.setAttribute('data-filter', currentFilter);
    }
  });
});

document.addEventListener('keydown', e => {
  if (!lightboxOpen) return;
  switch (e.key) {
    case 'ArrowLeft':  navigate(-1);      break;
    case 'ArrowRight': navigate(1);       break;
    case 'Escape':     closeLightbox();   break;
    case 'f': case 'F':
      const filters = ['none','grayscale','sepia','warm','cool','vivid','fade'];
      let i = filters.indexOf(currentFilter);
      currentFilter = filters[(i + 1) % filters.length];
      lbFilterPills.forEach(p => {
        p.classList.toggle('active', p.dataset.lbFilter === currentFilter);
      });
      if (currentFilter === 'none') {
        lbImg.removeAttribute('data-filter');
      } else {
        lbImg.setAttribute('data-filter', currentFilter);
      }
      break;
  }
});

let touchStartX = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    navigate(dx < 0 ? 1 : -1);
  }
}, { passive: true });

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.gallery-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 500ms ease ${i * 60}ms, transform 500ms cubic-bezier(.34,1.56,.64,1) ${i * 60}ms`;
  observer.observe(card);
});

applyFilter();

// --- Dynamic UI Enhancements ---

// 1. Cursor Glow & Scroll Progress
const cursorGlow = document.getElementById('cursorGlow');
const progressBar = document.getElementById('progressBar');

document.addEventListener('mousemove', e => {
  if (cursorGlow) {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }
});

document.addEventListener('scroll', () => {
  if (progressBar) {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollLen = `${(scrollPx / winHeightPx) * 100}%`;
    progressBar.style.width = scrollLen;
  }
});

// 2. Interactive Elements Hover State
const interactiveElements = document.querySelectorAll('button, input, .gallery-card, .lb-thumb, .lb-nav, .lb-close');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorGlow) cursorGlow.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    if (cursorGlow) cursorGlow.classList.remove('active');
  });
});

// 3. Parallax Effect on Gallery Cards
const allCards = document.querySelectorAll('.gallery-card');
allCards.forEach(card => {
  const img = card.querySelector('.card-img');
  
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) / 12;
    const moveY = (y - centerY) / 12;
    
    if(img) {
      img.style.transform = `scale(1.15) translate(${moveX}px, ${moveY}px)`;
    }
  });
  
  card.addEventListener('mouseleave', () => {
    if(img) {
      img.style.transform = `scale(1)`;
    }
  });
});
