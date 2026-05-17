document.addEventListener('DOMContentLoaded', function () {
  const getValue = (data, path) => path.split('.').reduce((value, key) => value && value[key], data);
  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  function renderProfile(data) {
    if (data.pageTitle) document.title = data.pageTitle;

    document.querySelectorAll('[data-profile]').forEach(element => {
      const value = getValue(data, element.dataset.profile);
      if (typeof value === 'string') element.textContent = value;
    });

    document.querySelectorAll('[data-profile-html]').forEach(element => {
      const value = getValue(data, element.dataset.profileHtml);
      if (typeof value === 'string') element.innerHTML = value;
    });

    document.querySelectorAll('[data-profile-src]').forEach(element => {
      const value = getValue(data, element.dataset.profileSrc);
      if (typeof value === 'string') element.setAttribute('src', value);
    });

    const experienceList = document.querySelector('[data-profile-list="experiences"]');
    if (experienceList && Array.isArray(data.experiences)) {
      experienceList.innerHTML = data.experiences.map(item => `
        <li>
          <span class="ex-year">${escapeHtml(item.year)}</span>
          <span class="ex-type">${escapeHtml(item.type)}</span>
          <span class="ex-title">${escapeHtml(item.title)}</span>
          <span class="ex-role">${escapeHtml(item.role)}</span>
        </li>
      `).join('');
    }

    const factsList = document.querySelector('[data-profile-list="facts"]');
    if (factsList && Array.isArray(data.facts)) {
      factsList.innerHTML = data.facts
        .filter(item => item.value)
        .map(item => `
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        `).join('');
    }

    const skillGroups = document.querySelector('[data-profile-list="skills"]');
    if (skillGroups && Array.isArray(data.skills)) {
      skillGroups.innerHTML = data.skills
        .filter(group => Array.isArray(group.items) && group.items.length)
        .map(group => `
          <div class="skill-group">
            <h3>${escapeHtml(group.category)}</h3>
            <ul class="chips">
              ${group.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>
        `).join('');
    }

    document.querySelectorAll('[data-link]').forEach(element => {
      let href = getValue(data, `links.${element.dataset.link}`);

      if (!href && element.dataset.link === 'email') {
        const email = getValue(data, 'contact.email');
        if (email && !email.includes('[')) href = `mailto:${email}`;
      }

      if (href) {
        element.setAttribute('href', href);
        element.removeAttribute('aria-disabled');
      } else {
        element.removeAttribute('href');
        element.setAttribute('aria-disabled', 'true');
      }
    });
  }

  function renderGalleryPreview(data) {
    const previewRoot = document.querySelector('[data-gallery-preview]');
    if (!previewRoot || !Array.isArray(data.sections)) return;

    const preferred = [
      'images/editorial/editorial-05.webp',
      'images/editorial/editorial-02.webp',
      'images/editorial/editorial-11.webp',
      'images/stills/still-09.webp',
      'images/editorial/editorial-14.webp',
      'images/stills/still-01.webp'
    ];
    const excluded = new Set(['images/profile/profile-intense-01.webp', 'images/profile/profile-smile-02.webp']);
    const allItems = data.sections.flatMap(section => section.items || []);
    const selected = preferred
      .map(src => allItems.find(item => item.src === src))
      .filter(Boolean)
      .concat(allItems)
      .filter(item => !excluded.has(item.src))
      .filter((item, index, items) => items.findIndex(candidate => candidate.src === item.src) === index)
      .slice(0, 6);

    previewRoot.innerHTML = selected.map((item, index) => `
      <a class="gallery-preview-card is-${index + 1}" href="${escapeHtml(item.src)}" data-gallery-image>
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
      </a>
    `).join('');
  }

  function setupModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-btn');

    function openModal(src) {
      if (!modal || !modalImg) return;
      modalImg.src = src;
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('open'), 10);
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        modal.style.display = 'none';
        if (modalImg) modalImg.src = '';
      }, 220);
    }

    document.addEventListener('click', event => {
      const galleryImage = event.target.closest('[data-gallery-image]');
      if (galleryImage) {
        event.preventDefault();
        openModal(galleryImage.href);
        return;
      }

      const standaloneImage = event.target.closest('.profile-card .avatar img, .panel.spot .image img');
      if (standaloneImage) openModal(standaloneImage.currentSrc || standaloneImage.src);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    window.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  }

  function setupVideoSlider() {
    const slides = document.querySelectorAll('.video-slide');
    const videos = document.querySelectorAll('.video-slide video');
    const progressBar = document.querySelector('.video-progress-bar');
    if (!slides.length) return;

    let currentSlide = 0;

    videos.forEach(video => {
      video.muted = true;
      video.loop = false;
      video.autoplay = true;
      video.playsInline = true;
      video.play().catch(() => {});
    });

    function setProgress(pct) {
      if (progressBar) progressBar.style.width = `${pct}%`;
    }

    function showSlide(index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        const video = slide.querySelector('video');
        if (!video) return;

        if (i === index) {
          try { video.currentTime = 0; } catch (error) {}
          video.play().catch(() => {});
        } else {
          try {
            video.pause();
            video.currentTime = 0;
          } catch (error) {}
        }
      });

      currentSlide = index;
      setProgress(0);
    }

    function moveSlide(step) {
      showSlide(currentSlide + step);
    }

    videos.forEach((video, index) => {
      video.addEventListener('ended', () => {
        if (index === currentSlide) moveSlide(1);
      });
    });

    function tickProgress() {
      const video = slides[currentSlide] && slides[currentSlide].querySelector('video');
      if (video && video.duration) setProgress((video.currentTime / video.duration) * 100);
      requestAnimationFrame(tickProgress);
    }

    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    if (prevButton) prevButton.addEventListener('click', () => moveSlide(-1));
    if (nextButton) nextButton.addEventListener('click', () => moveSlide(1));

    showSlide(currentSlide);
    requestAnimationFrame(tickProgress);
  }

  function setupProfileTilt() {
    const profileCard = document.querySelector('.profile-card');
    if (!profileCard) return;

    profileCard.addEventListener('mousemove', event => {
      const rect = profileCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      profileCard.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    profileCard.addEventListener('mouseleave', () => { profileCard.style.transform = ''; });
  }

  fetch('data/profile.json')
    .then(response => {
      if (!response.ok) throw new Error('Profile data could not be loaded.');
      return response.json();
    })
    .then(renderProfile)
    .catch(() => {});

  fetch('data/gallery.json')
    .then(response => {
      if (!response.ok) throw new Error('Gallery data could not be loaded.');
      return response.json();
    })
    .then(renderGalleryPreview)
    .catch(() => {});

  setupModal();
  setupVideoSlider();
  setupProfileTilt();
});
