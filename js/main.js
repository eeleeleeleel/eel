// Contact modal
const contactOverlay = document.getElementById('contactOverlay');
document.getElementById('contactBtn').addEventListener('click', (e) => {
  e.preventDefault();
  contactOverlay.classList.add('open');
});
document.getElementById('contactModalClose').addEventListener('click', () => {
  contactOverlay.classList.remove('open');
});
contactOverlay.addEventListener('click', (e) => {
  if (e.target === contactOverlay) contactOverlay.classList.remove('open');
});

// Dropdown menu
const navDropdown = document.querySelector('.nav-dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');
let hideTimeout;

navDropdown.addEventListener('mouseenter', () => {
  clearTimeout(hideTimeout);
  navDropdown.classList.add('active');
});

navDropdown.addEventListener('mouseleave', () => {
  hideTimeout = setTimeout(() => {
    navDropdown.classList.remove('active');
  }, 700);
});

dropdownMenu.addEventListener('mouseenter', () => {
  clearTimeout(hideTimeout);
});

dropdownMenu.addEventListener('mouseleave', () => {
  hideTimeout = setTimeout(() => {
    navDropdown.classList.remove('active');
  }, 700);
});

// Works page
const worksPage = document.getElementById('worksPage');
const worksClose = document.getElementById('worksClose');

document.querySelectorAll('.dropdown-item').forEach(item => {
  if (item.textContent.trim() === 'Furniture') {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      worksPage.classList.add('open');
      history.pushState({ page: 'works' }, '', '#works');
    });
  }
});

worksClose.addEventListener('click', () => {
  history.back();
});

document.getElementById('worksHome').addEventListener('click', (e) => {
  e.preventDefault();
  worksPage.classList.remove('open');
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Cabinet detail
const cabinetDetail = document.getElementById('cabinetDetail');
const cabinetClose = document.getElementById('cabinetClose');

document.getElementById('cabinetThumb').addEventListener('click', () => {
  cabinetDetail.classList.add('open');
  history.pushState({ page: 'cabinet' }, '', '#cabinet');
});

cabinetClose.addEventListener('click', () => {
  history.back();
});

// Green table detail
const greentableDetail = document.getElementById('greentableDetail');
const greentableClose = document.getElementById('greentableClose');

document.getElementById('greentableThumb').addEventListener('click', () => {
  greentableDetail.classList.add('open');
  history.pushState({ page: 'greentable' }, '', '#greentable');
});

greentableClose.addEventListener('click', () => {
  history.back();
});

// Table detail
const tableDetail = document.getElementById('tableDetail');
const tableClose = document.getElementById('tableClose');

document.getElementById('tableThumb').addEventListener('click', () => {
  tableDetail.classList.add('open');
  history.pushState({ page: 'table' }, '', '#table');
});

tableClose.addEventListener('click', () => {
  history.back();
});

// Acrylic table detail
const acrylicDetail = document.getElementById('acrylicDetail');
const acrylicClose = document.getElementById('acrylicClose');

document.getElementById('acrylicThumb').addEventListener('click', () => {
  acrylicDetail.classList.add('open');
  history.pushState({ page: 'acrylic' }, '', '#acrylic');
});

acrylicClose.addEventListener('click', () => {
  history.back();
});

// Tile table detail
const tiletableDetail = document.getElementById('tiletableDetail');
const tiletableClose = document.getElementById('tiletableClose');

document.getElementById('tiletableThumb').addEventListener('click', () => {
  tiletableDetail.classList.add('open');
  history.pushState({ page: 'tiletable' }, '', '#tiletable');
});

tiletableClose.addEventListener('click', () => {
  history.back();
});

// Back button handling
window.addEventListener('popstate', (e) => {
  if (cabinetDetail.classList.contains('open')) {
    cabinetDetail.classList.remove('open');
  } else if (tiletableDetail.classList.contains('open')) {
    tiletableDetail.classList.remove('open');
  } else if (acrylicDetail.classList.contains('open')) {
    acrylicDetail.classList.remove('open');
  } else if (tableDetail.classList.contains('open')) {
    tableDetail.classList.remove('open');
  } else if (greentableDetail.classList.contains('open')) {
    greentableDetail.classList.remove('open');
  } else if (worksPage.classList.contains('open')) {
    worksPage.classList.remove('open');
  }
});

// Intro overlay
window.addEventListener('load', () => {
  const overlay = document.getElementById('introOverlay');
  setTimeout(() => {
    overlay.classList.add('fade-out');
  }, 700);
});


// Scroll hint
const scrollHint = document.getElementById('scrollHint');
let prevScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (nav.classList.contains('visible')) {
    scrollHint.classList.add('hidden');
  } else {
    scrollHint.classList.remove('hidden');
  }
  prevScrollY = currentScrollY;
});

// Nav scroll effect
const nav = document.getElementById('nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;
  if (delta < -6) {
    nav.classList.add('visible');
    scrollHint.classList.add('hidden');
  } else if (delta > 6) {
    nav.classList.remove('visible');
    scrollHint.classList.remove('hidden');
  }
  lastScrollY = currentScrollY;
});

// Circle button toggles nav
document.getElementById('navToggle').addEventListener('click', () => {
  nav.classList.toggle('visible');
  if (nav.classList.contains('visible')) {
    scrollHint.classList.add('hidden');
  } else {
    scrollHint.classList.remove('hidden');
  }
});

