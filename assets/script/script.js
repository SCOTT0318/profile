document.addEventListener("DOMContentLoaded", function () {
  // 비디오 설정: 모든 비디오를 자동재생(시도), 음소거, 반복
  const videos = document.querySelectorAll('.video-slide video');
  videos.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.play().catch(()=>{});
  });

  // 모달 관련 기능 (애니메이션 포함)
  const images = document.querySelectorAll('.gallery .image-container a');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.close-btn');

  function openModal(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.style.display = 'flex';
    // allow CSS repaint before adding class
    setTimeout(() => modal.classList.add('open'), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.style.display = 'none'; if (modalImg) modalImg.src = ''; }, 220);
  }

  images.forEach(image => {
    image.addEventListener('click', function(event) {
      event.preventDefault();
      openModal(this.href);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', function(event) { if (event.target === modal) closeModal(); });
  window.addEventListener('keydown', function(event) { if (event.key === 'Escape') closeModal(); });

  // 비디오 슬라이드 기능 (자동 재생 + 일시정지 on hover)
  let currentSlide = 0;
  const slides = document.querySelectorAll('.video-slide');

  function showSlide(index) {
    if (!slides.length) return;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      const v = slide.querySelector('video');
      if (v) {
        if (i === index) { v.play().catch(()=>{}); }
        else { try { v.pause(); v.currentTime = 0; } catch(e){} }
      }
    });
    currentSlide = index;
  }

  function moveSlide(step) { showSlide(currentSlide + step); }

  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  if (prevButton) prevButton.addEventListener('click', () => moveSlide(-1));
  if (nextButton) nextButton.addEventListener('click', () => moveSlide(1));

  showSlide(currentSlide);

  let autoPlayInterval = setInterval(() => moveSlide(1), 6000);
  const sliderContainer = document.querySelector('.video-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    sliderContainer.addEventListener('mouseleave', () => { clearInterval(autoPlayInterval); autoPlayInterval = setInterval(() => moveSlide(1), 6000); });
  }

  // 프로필 카드 마우스 틸트 효과
  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.addEventListener('mousemove', e => {
      const rect = profileCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      profileCard.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${ -y * 6}deg)`;
    });
    profileCard.addEventListener('mouseleave', () => { profileCard.style.transform = ''; });
  }
});
