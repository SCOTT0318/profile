document.addEventListener('DOMContentLoaded', function () {
  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const filterLabels = {
    all: 'All',
    profile: 'Profile',
    romance: 'Romance',
    screen: 'Screen',
    videos: 'Videos'
  };

  function setupModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const modalPlayer = document.querySelector('[data-media-player]');
    const modalVideoTitle = document.getElementById('modal-video-title');
    const modalVideoCount = document.getElementById('modal-video-count');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.media-prev');
    const nextBtn = document.querySelector('.media-next');
    let currentVideoIndex = -1;

    function showModal() {
      if (!modal) return;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(() => modal.classList.add('open'), 10);
      document.body.style.overflow = 'hidden';
    }

    function openImage(src, alt) {
      if (!modal || !modalImg || !modalVideo || !modalPlayer) return;
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load();
      modal.classList.remove('is-video');
      modalPlayer.hidden = true;
      modalImg.hidden = false;
      modalImg.src = src;
      modalImg.alt = alt || '';
      currentVideoIndex = -1;
      showModal();
    }

    function getVideoLinks() {
      return Array.from(document.querySelectorAll('[data-gallery-video]'));
    }

    function openVideoByIndex(index) {
      if (!modal || !modalImg || !modalVideo || !modalPlayer) return;
      const links = getVideoLinks();
      if (!links.length) return;

      currentVideoIndex = (index + links.length) % links.length;
      const videoLink = links[currentVideoIndex];

      modalImg.src = '';
      modalImg.hidden = true;
      modal.classList.add('is-video');
      modalPlayer.hidden = false;
      modalVideo.src = videoLink.href;
      modalVideo.setAttribute('controlsList', 'nodownload noplaybackrate');
      modalVideo.disablePictureInPicture = true;
      if (videoLink.dataset.poster) modalVideo.poster = videoLink.dataset.poster;
      else modalVideo.removeAttribute('poster');
      if (modalVideoTitle) modalVideoTitle.textContent = videoLink.dataset.title || '';
      if (modalVideoCount) modalVideoCount.textContent = `${currentVideoIndex + 1} / ${links.length}`;
      showModal();
      modalVideo.play().catch(() => {});
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      modal.classList.remove('is-video');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (modalVideo) modalVideo.pause();
      setTimeout(() => {
        modal.style.display = 'none';
        if (modalImg) modalImg.src = '';
        if (modalPlayer) modalPlayer.hidden = true;
        if (modalVideo) {
          modalVideo.removeAttribute('src');
          modalVideo.removeAttribute('poster');
          modalVideo.load();
        }
        currentVideoIndex = -1;
      }, 220);
    }

    function moveVideo(step) {
      if (currentVideoIndex < 0) return;
      openVideoByIndex(currentVideoIndex + step);
    }

    document.addEventListener('click', event => {
      const galleryVideo = event.target.closest('[data-gallery-video]');
      if (galleryVideo) {
        event.preventDefault();
        openVideoByIndex(getVideoLinks().indexOf(galleryVideo));
        return;
      }

      const galleryImage = event.target.closest('[data-gallery-image]');
      if (!galleryImage) return;
      event.preventDefault();
      openImage(galleryImage.href, galleryImage.querySelector('img')?.alt);
    });

    document.addEventListener('contextmenu', event => {
      if (event.target.closest('video, [data-gallery-video]')) event.preventDefault();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', () => moveVideo(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveVideo(1));
    window.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') moveVideo(-1);
      if (event.key === 'ArrowRight') moveVideo(1);
    });
  }

  function renderFilterButton(id, label, count, active) {
    return `
      <button
        type="button"
        class="${active ? 'active' : ''}"
        data-gallery-filter="${escapeHtml(id)}"
        aria-pressed="${active ? 'true' : 'false'}"
      >
        ${escapeHtml(label)} <span>${count}</span>
      </button>
    `;
  }

  function renderGalleryCard(item, section, itemIndex) {
    const index = String(itemIndex + 1).padStart(2, '0');
    const sizeClass = item.size ? ` is-${escapeHtml(item.size)}` : '';

    if (item.type === 'video') {
      return `
        <a
          class="gallery-card gallery-video-card${sizeClass}"
          href="${escapeHtml(item.src)}"
          data-gallery-video
          data-poster="${escapeHtml(item.poster)}"
          data-title="${escapeHtml(item.title || item.alt || `영상 ${index}`)}"
          aria-label="${escapeHtml(item.title || item.alt || `영상 ${index}`)} 재생"
        >
          <span class="gallery-video-thumb">
            <img src="${escapeHtml(item.poster)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
            <span class="gallery-play-button" aria-hidden="true"></span>
            ${item.duration ? `<span class="gallery-video-duration">${escapeHtml(item.duration)}</span>` : ''}
          </span>
          <span class="gallery-video-info">
            <span>${escapeHtml(section.kicker)}</span>
            <strong>${escapeHtml(item.title || `Video Clip ${index}`)}</strong>
          </span>
        </a>
      `;
    }

    return `
      <a class="image gallery-card${sizeClass}" href="${escapeHtml(item.src)}" data-gallery-image>
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
        <span class="gallery-card-meta">
          <span>${escapeHtml(section.kicker)}</span>
          <strong>${index}</strong>
        </span>
      </a>
    `;
  }

  function renderGallery(data) {
    const galleryRoot = document.querySelector('[data-gallery]');
    const filterRoot = document.querySelector('[data-gallery-filters]');
    if (!galleryRoot || !Array.isArray(data.sections)) return;

    const totalCount = data.sections.reduce((sum, section) => sum + ((section.items || []).length), 0);

    if (filterRoot) {
      filterRoot.innerHTML = [
        renderFilterButton('all', filterLabels.all, totalCount, true),
        ...data.sections.map(section => renderFilterButton(
          section.id,
          filterLabels[section.id] || section.kicker || section.title,
          (section.items || []).length,
          false
        ))
      ].join('');
    }

    galleryRoot.innerHTML = data.sections.map((section, sectionIndex) => `
      <section class="gallery-section" data-gallery-section="${escapeHtml(section.id)}">
        <div class="gallery-section-header">
          <span class="gallery-section-kicker">${escapeHtml(section.kicker)}</span>
          <div>
            <span class="gallery-section-number">${String(sectionIndex + 1).padStart(2, '0')}</span>
            <h2>${escapeHtml(section.title)}</h2>
            <p>${escapeHtml(section.description)}</p>
          </div>
          <span class="gallery-section-count">${Array.isArray(section.items) ? section.items.length : 0} ${section.id === 'videos' ? 'clips' : 'cuts'}</span>
        </div>
        <div class="gallery-masonry">
          ${(section.items || []).map((item, itemIndex) => renderGalleryCard(item, section, itemIndex)).join('')}
        </div>
      </section>
    `).join('');

    bindFilters(filterRoot, galleryRoot);
  }

  function bindFilters(filterRoot, galleryRoot) {
    if (!filterRoot || !galleryRoot) return;

    filterRoot.addEventListener('click', event => {
      const button = event.target.closest('[data-gallery-filter]');
      if (!button) return;

      const filter = button.dataset.galleryFilter;

      filterRoot.querySelectorAll('[data-gallery-filter]').forEach(item => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      galleryRoot.querySelectorAll('[data-gallery-section]').forEach(section => {
        const isVisible = filter === 'all' || section.dataset.gallerySection === filter;
        section.hidden = !isVisible;
        section.classList.toggle('is-hidden', !isVisible);
      });
    });
  }

  fetch('data/gallery.json')
    .then(response => {
      if (!response.ok) throw new Error('Gallery data could not be loaded.');
      return response.json();
    })
    .then(renderGallery)
    .catch(() => {});

  setupModal();
});
