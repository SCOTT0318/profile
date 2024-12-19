document.addEventListener("DOMContentLoaded", function () {
  // 비디오 자동 재생 및 음소거 처리
  var video = document.querySelector('video');
  if (video) {
      video.autoplay = true;
      video.muted = true; // 자동 재생시 소리 끄기
      video.loop = true; // 반복 재생
  }

  // 모달 관련 기능
  const images = document.querySelectorAll('.gallery .image-container a');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.close-btn');

  // 이미지 클릭 시 모달 열기
  images.forEach(image => {
      image.addEventListener('click', function(event) {
          event.preventDefault(); // 링크 기본 동작 방지
          const imageSrc = this.href; // 클릭한 이미지 경로
          modal.style.display = "flex"; // 모달 열기
          modalImg.src = imageSrc; // 모달에 큰 이미지 표시
      });
  });

  // 모달 닫기 버튼 클릭 시
  closeBtn.addEventListener('click', function() {
      modal.style.display = "none"; // 모달 닫기
  });

  // 모달 바깥 영역 클릭 시 모달 닫기
  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          modal.style.display = "none"; // 모달 닫기
      }
  });

  // ESC 키로 모달 닫기
  window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
          modal.style.display = "none";
      }
  });
  
  // 비디오 음소거 해제 버튼 (예시로 추가)
  const muteButton = document.getElementById('mute-button'); // 음소거 버튼
  if (muteButton && video) {
      muteButton.addEventListener('click', function() {
          video.muted = !video.muted; // 음소거 토글
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // 비디오 자동 재생 및 음소거 처리
  var video = document.querySelector('video');
  if (video) {
      video.autoplay = true;
      video.muted = true; // 자동 재생시 소리 끄기
      video.loop = true; // 반복 재생
  }

  // 모달 관련 기능
  const images = document.querySelectorAll('.gallery .image-container a');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.close-btn');

  // 이미지 클릭 시 모달 열기
  images.forEach(image => {
      image.addEventListener('click', function(event) {
          event.preventDefault(); // 링크 기본 동작 방지
          const imageSrc = this.href; // 클릭한 이미지 경로
          modal.style.display = "flex"; // 모달 열기
          modalImg.src = imageSrc; // 모달에 큰 이미지 표시
      });
  });

  // 모달 닫기 버튼 클릭 시
  closeBtn.addEventListener('click', function() {
      modal.style.display = "none"; // 모달 닫기
  });

  // 모달 바깥 영역 클릭 시 모달 닫기
  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          modal.style.display = "none"; // 모달 닫기
      }
  });

  // ESC 키로 모달 닫기
  window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
          modal.style.display = "none";
      }
  });
  
  // 비디오 음소거 해제 버튼 (예시로 추가)
  const muteButton = document.getElementById('mute-button'); // 음소거 버튼
  if (muteButton && video) {
      muteButton.addEventListener('click', function() {
          video.muted = !video.muted; // 음소거 토글
      });
  }

  // 비디오 슬라이드 기능
  let currentSlide = 0;
  const slides = document.querySelectorAll('.video-slide');

  function showSlide(index) {
      if (index >= slides.length) {
          currentSlide = 0;
      } else if (index < 0) {
          currentSlide = slides.length - 1;
      } else {
          currentSlide = index;
      }

      // 모든 슬라이드를 숨기고 현재 슬라이드만 보이게 설정
      slides.forEach(slide => slide.classList.remove('active'));
      slides[currentSlide].classList.add('active');
  }

  function moveSlide(step) {
      currentSlide += step;
      showSlide(currentSlide);  // 이동 후 바로 showSlide 호출
  }

  // 좌측, 우측 버튼 클릭 시 슬라이드 이동
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');

  prevButton.addEventListener('click', function() {
      moveSlide(-1);  // 이전 슬라이드로 이동
  });

  nextButton.addEventListener('click', function() {
      moveSlide(1);  // 다음 슬라이드로 이동
  });

  // 처음 슬라이드를 표시
  showSlide(currentSlide);
});
