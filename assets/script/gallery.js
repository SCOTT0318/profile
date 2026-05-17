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
    screen: 'Screen'
  };

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
      if (!galleryImage) return;
      event.preventDefault();
      openModal(galleryImage.href);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    window.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
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
          <span class="gallery-section-count">${Array.isArray(section.items) ? section.items.length : 0} cuts</span>
        </div>
        <div class="gallery-masonry">
          ${(section.items || []).map((item, itemIndex) => `
            <a class="image gallery-card ${item.size ? `is-${escapeHtml(item.size)}` : ''}" href="${escapeHtml(item.src)}" data-gallery-image>
              <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" />
              <span class="gallery-card-meta">
                <span>${escapeHtml(section.kicker)}</span>
                <strong>${String(itemIndex + 1).padStart(2, '0')}</strong>
              </span>
            </a>
          `).join('')}
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
