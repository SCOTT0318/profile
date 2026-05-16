document.addEventListener("DOMContentLoaded", function () {
  // 비디오 설정: 모든 비디오를 자동재생(시도), 음소거. loop는 사용하지 않음 (ended 이벤트로 다음 슬라이드로 넘김).
  const videos = document.querySelectorAll('.video-slide video');
  videos.forEach(video => {
    video.muted = true;
    video.loop = false;
    video.autoplay = true;
    video.playsInline = true;
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

  // 메인 페이지의 아바타·자기소개 이미지도 클릭하면 모달로 크게 보기
  const standaloneImages = document.querySelectorAll('.profile-card .avatar img, .panel.spot .image img');
  standaloneImages.forEach(img => {
    img.addEventListener('click', function() {
      openModal(this.src);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', function(event) { if (event.target === modal) closeModal(); });
  window.addEventListener('keydown', function(event) { if (event.key === 'Escape') closeModal(); });

  // 비디오 슬라이드 기능: 영상이 끝나면(ended) 자동으로 다음 슬라이드로 이동.
  let currentSlide = 0;
  const slides = document.querySelectorAll('.video-slide');
  const progressBar = document.querySelector('.video-progress-bar');

  function setProgress(pct) {
    if (progressBar) progressBar.style.width = pct + '%';
  }

  function showSlide(index) {
    if (!slides.length) return;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      const v = slide.querySelector('video');
      if (v) {
        if (i === index) {
          try { v.currentTime = 0; } catch(e){}
          v.play().catch(()=>{});
        } else {
          try { v.pause(); v.currentTime = 0; } catch(e){}
        }
      }
    });
    currentSlide = index;
    setProgress(0);
  }

  function moveSlide(step) { showSlide(currentSlide + step); }

  // 각 비디오 끝나면 다음 슬라이드로 전환
  videos.forEach((video, i) => {
    video.addEventListener('ended', () => {
      if (i === currentSlide) moveSlide(1);
    });
  });

  // requestAnimationFrame으로 진행률을 매 프레임 부드럽게 갱신 (timeupdate는 250ms 간격이라 끊김)
  function tickProgress() {
    const v = slides[currentSlide] && slides[currentSlide].querySelector('video');
    if (v && v.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
    requestAnimationFrame(tickProgress);
  }
  requestAnimationFrame(tickProgress);

  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  if (prevButton) prevButton.addEventListener('click', () => moveSlide(-1));
  if (nextButton) nextButton.addEventListener('click', () => moveSlide(1));

  showSlide(currentSlide);

  // hover 시 현재 영상 일시정지, 벗어나면 재개
  const sliderContainer = document.querySelector('.video-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      const v = slides[currentSlide] && slides[currentSlide].querySelector('video');
      if (v) { try { v.pause(); } catch(e){} }
    });
    sliderContainer.addEventListener('mouseleave', () => {
      const v = slides[currentSlide] && slides[currentSlide].querySelector('video');
      if (v) { v.play().catch(()=>{}); }
    });
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
