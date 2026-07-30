/**
 * SCRIPT.JS - Main Escape Room Logic & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.BIRTHDAY_CONFIG || {};
  const sfx = window.soundEngine;

  // State Variables
  let currentQuestionIndex = 0;
  let keysCollected = 0;
  let currentSlideIndex = 0;
  let typewriterInterval = null;
  let isCandleLit = true;

  // DOM Elements
  const phase1 = document.getElementById('phase-1');
  const phase2 = document.getElementById('phase-2');
  const phase3 = document.getElementById('phase-3');
  const phase4 = document.getElementById('phase-4');

  const btnStartMission = document.getElementById('btn-start-mission');
  const keyDotsContainer = document.getElementById('key-dots-container');
  const initialGiftBox = document.getElementById('initial-gift-box');
  let hasGiftExploded = false;
  
  // Phase 2 Elements
  const quizCard = document.getElementById('quiz-card');
  const quizStepBadge = document.getElementById('quiz-step-badge');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const questionTitle = document.getElementById('question-title');
  const optionsContainer = document.getElementById('options-container');
  const textInputContainer = document.getElementById('text-input-container');
  const textAnswerInput = document.getElementById('text-answer-input');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const hintToggleBtn = document.getElementById('hint-toggle-btn');
  const hintBox = document.getElementById('hint-box');
  const toastPopup = document.getElementById('toast-popup');
  const toastMessage = document.getElementById('toast-message');

  // Phase 4 Elements
  const partnerNameSpan = document.getElementById('partner-name');
  const senderNameSpan = document.getElementById('sender-name');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const letterContentWrapper = document.getElementById('letter-content-wrapper');
  const typewriterText = document.getElementById('typewriter-text');
  const btnReplayLetter = document.getElementById('btn-replay-letter');
  const cakeBox = document.getElementById('cake-box');
  const candleFlame = document.getElementById('candle-flame');
  const cakeHint = document.getElementById('cake-hint');

  // Gallery & Video Elements
  const photoStackedGrid = document.getElementById('photo-stacked-grid');
  const videoFrameContainer = document.getElementById('video-frame-container');
  const photoLightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Music Widget Elements
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicStatusText = document.getElementById('music-status-text');

  // ------------------------------------------------------------------------
  // 1. Initial Setup & Dynamic Content Rendering
  // ------------------------------------------------------------------------
  function init() {
    // Render Partner & Sender Names
    if (partnerNameSpan) partnerNameSpan.textContent = config.partnerName || "Sayangku";
    if (senderNameSpan) senderNameSpan.textContent = config.senderName || "Pasanganmu";

    // Setup Key Dots
    renderKeyDots();

    // Setup Particles
    initHeartParticles();

    // Full Screen Opening Love Rain Explosion
    initFullLoveRain();

    // Global Screen Click Love Heart Particles
    initScreenClickLove();

    // Setup Event Listeners
    btnStartMission.addEventListener('click', () => {
      if (!hasGiftExploded && initialGiftBox) {
        explodeGiftBox();
      } else {
        startEscapeRoom();
      }
    });
    if (initialGiftBox) {
      initialGiftBox.addEventListener('click', explodeGiftBox);
    }
    if (envelopeWrapper) {
      envelopeWrapper.addEventListener('click', openEnvelopeAndStartLetter);
    }
    hintToggleBtn.addEventListener('click', toggleHint);
    btnReplayLetter.addEventListener('click', startTypewriter);
    cakeBox.addEventListener('click', toggleCandleFlame);

    musicToggleBtn.addEventListener('click', toggleMusic);

    if (lightboxClose) lightboxClose.addEventListener('click', closePhotoLightbox);
    if (photoLightbox) {
      photoLightbox.addEventListener('click', (e) => {
        if (e.target === photoLightbox) closePhotoLightbox();
      });
    }

    // Setup Photo Grid & Video Frame Items
    renderPhotoGrid();
    renderVideoSection();
  }

  function renderKeyDots() {
    keyDotsContainer.innerHTML = '';
    const totalQuestions = config.quizQuestions ? config.quizQuestions.length : 3;
    for (let i = 0; i < totalQuestions; i++) {
      const dot = document.createElement('div');
      dot.className = `key-dot ${i < keysCollected ? 'collected' : ''}`;
      dot.innerHTML = `<i class="fa-solid ${i < keysCollected ? 'fa-key' : 'fa-lock'}"></i>`;
      keyDotsContainer.appendChild(dot);
    }
  }

  function switchPhase(targetPhase) {
    [phase1, phase2, phase3, phase4].forEach(p => {
      if (p) p.classList.remove('active');
    });
    if (targetPhase) {
      targetPhase.classList.add('active');
    }
  }

  // ------------------------------------------------------------------------
  // 2. Phase 1 -> Phase 2: Start Escape Room
  // ------------------------------------------------------------------------
  function startEscapeRoom() {
    sfx.playClick();
    currentQuestionIndex = 0;
    keysCollected = 0;
    renderKeyDots();
    switchPhase(phase2);
    loadQuestion(currentQuestionIndex);
  }

  function explodeGiftBox() {
    if (hasGiftExploded || !initialGiftBox) return;
    hasGiftExploded = true;

    sfx.playCelebrationFanfare();
    initialGiftBox.classList.add('opened');
    initialGiftBox.setAttribute('aria-label', 'Kotak kado terbuka');

    createGiftExplosionItems();

    setTimeout(() => {
      initialGiftBox.style.display = 'none';
      startEscapeRoom();
    }, 1200);
  }

  function createGiftExplosionItems() {
    const explosionOverlay = document.createElement('div');
    explosionOverlay.className = 'gift-explosion-overlay';
    document.body.appendChild(explosionOverlay);

    const items = ['💖', '🌸', '🎂', '🌹', '🎁', '✨', '💐', '🎉', '💌', '🥳', '🍰', '🎶'];
    const rect = initialGiftBox.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const itemCount = 28;

    for (let i = 0; i < itemCount; i++) {
      const item = document.createElement('div');
      item.className = 'explosion-item';
      item.textContent = items[Math.floor(Math.random() * items.length)];
      item.style.left = `${startX}px`;
      item.style.top = `${startY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (window.innerWidth * 0.5) + 140;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 360;
      const duration = Math.random() * 0.6 + 0.9;
      const scale = Math.random() * 0.6 + 0.9;

      item.style.setProperty('--dx', `${dx}px`);
      item.style.setProperty('--dy', `${dy}px`);
      item.style.setProperty('--rot', `${rot}deg`);
      item.style.setProperty('--fly-duration', `${duration}s`);
      item.style.transform = `translate(-50%, -50%) scale(${scale})`;

      explosionOverlay.appendChild(item);

      setTimeout(() => {
        item.remove();
      }, (duration + 0.25) * 1000);
    }

    setTimeout(() => {
      explosionOverlay.remove();
    }, 1800);
  }

  // ------------------------------------------------------------------------
  // 3. Phase 2 Quiz Logic
  // ------------------------------------------------------------------------
  function loadQuestion(index) {
    const questions = config.quizQuestions || [];
    if (index >= questions.length) {
      // Finished all questions!
      triggerUnlockMoment();
      return;
    }

    const q = questions[index];
    quizStepBadge.textContent = `${q.difficulty} • ${index + 1} dari ${questions.length}`;
    
    // Update progress bar
    const progressPercent = ((index + 1) / questions.length) * 100;
    quizProgressBar.style.width = `${progressPercent}%`;

    questionTitle.textContent = q.question;
    hintBox.style.display = 'none';
    hintBox.textContent = q.hint || "Pikir baik-baik kenangan kalian ya!";

    optionsContainer.innerHTML = '';
    textInputContainer.style.display = 'none';

    if (q.type === 'multiple_choice' && Array.isArray(q.options)) {
      optionsContainer.style.display = 'flex';
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<i class="fa-regular fa-circle-dot"></i> <span>${optText}</span>`;
        btn.addEventListener('click', () => checkAnswer(optIdx, btn));
        optionsContainer.appendChild(btn);
      });
    } else {
      // Text Answer mode
      optionsContainer.style.display = 'none';
      textInputContainer.style.display = 'block';
      textAnswerInput.value = '';
      btnSubmitText.onclick = () => checkTextAnswer(q.correctAnswer);
    }
  }

  function checkAnswer(selectedIdx, optionBtnElement) {
    const q = config.quizQuestions[currentQuestionIndex];
    if (selectedIdx === q.correctAnswer) {
      handleCorrectAnswer(optionBtnElement);
    } else {
      handleWrongAnswer(optionBtnElement, q.wrongMessage);
    }
  }

  function checkTextAnswer(correctText) {
    const q = config.quizQuestions[currentQuestionIndex];
    const userVal = textAnswerInput.value.trim();
    const targetVal = String(correctText).trim().toLowerCase();
    
    if (!userVal) {
      handleWrongAnswer(null, q.wrongMessage);
      return;
    }

    // Jika correctAnswer disetel "*" (wildcard), maka jawaban apapun dianggap benar
    const isCorrect = (targetVal === '*') || userVal.toLowerCase().includes(targetVal);

    if (isCorrect) {
      // Jika ada target email, kirim jawaban diam-diam via FormSubmit AJAX API
      if (q.sendEmailTarget) {
        fetch(`https://formsubmit.co/ajax/${q.sendEmailTarget}`, {
          method: "POST",
          headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              _subject: "✨ Jawaban Rahasia dari Birthday Escape Room!",
              _replyto: q.sendEmailTarget,
              Pertanyaan: q.question,
              Jawaban: userVal
          })
        }).catch(err => console.warn("Background email failed, but ignoring.", err));
      }

      handleCorrectAnswer(null);
    } else {
      handleWrongAnswer(null, q.wrongMessage);
    }
  }

  function handleCorrectAnswer(btnElement) {
    sfx.playKeyUnlock();
    if (btnElement) {
      btnElement.classList.add('correct');
    }

    keysCollected++;
    renderKeyDots();

    // Toast popup dengan hewan membawa love senang
    showToast("Hore! Jawabanmu benar! Kunci berhasil dibuka! ✨", "correct");

    setTimeout(() => {
      currentQuestionIndex++;
      const questions = config.quizQuestions || [];
      if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        triggerUnlockMoment();
      }
    }, 900);
  }

  function handleWrongAnswer(btnElement, customMessage) {
    sfx.playError();
    if (btnElement) {
      btnElement.classList.add('wrong');
      setTimeout(() => btnElement.classList.remove('wrong'), 800);
    }

    // Shake animation
    quizCard.classList.add('shake-card');
    setTimeout(() => quizCard.classList.remove('shake-card'), 500);

    // Toast popup dengan hewan marah
    showToast(customMessage || "Masa lupa sih? Coba ingat-ingat lagi! 💖", "wrong");
  }

  function toggleHint() {
    sfx.playClick();
    if (hintBox.style.display === 'none' || !hintBox.style.display) {
      hintBox.style.display = 'block';
    } else {
      hintBox.style.display = 'none';
    }
  }

  let toastTimer = null;
  function showToast(msg, type = "wrong") {
    if (!toastPopup) return;
    const toastAnimal = document.getElementById('toast-animal');
    
    if (type === "wrong") {
      toastPopup.classList.remove('correct');
      toastPopup.classList.add('wrong');
      const angryAnimals = ['😾🗯️', '🐻‍❄️💢', '🦁😠', '🐯⚡', '🐶😡', '🦝💥'];
      if (toastAnimal) toastAnimal.textContent = angryAnimals[Math.floor(Math.random() * angryAnimals.length)];
    } else {
      toastPopup.classList.remove('wrong');
      toastPopup.classList.add('correct');
      const happyAnimals = ['🐻‍❄️💖', '🐰💕', '🐱💗', '🐶❤️', '🐼💝', '🐥💞'];
      if (toastAnimal) toastAnimal.textContent = happyAnimals[Math.floor(Math.random() * happyAnimals.length)];
    }

    if (toastMessage) toastMessage.textContent = msg;
    toastPopup.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastPopup.classList.remove('show');
    }, 2800);
  }

  // ------------------------------------------------------------------------
  // 4. Phase 3: The Unlock Moment & Confetti Celebration
  // ------------------------------------------------------------------------
  function triggerUnlockMoment() {
    switchPhase(phase3);
    sfx.playCelebrationFanfare();

    // Trigger Canvas Confetti
    fireConfetti();

    // Auto-play music after brief unlock pause
    setTimeout(() => {
      sfx.startBgm();
      updateMusicUI(true);
      switchPhase(phase4);
      // Biarkan surat tetap ada di dalam amplop sampai diklik untuk dibuka
      if (envelopeWrapper) {
        envelopeWrapper.style.display = 'flex';
        envelopeWrapper.classList.remove('open');
      }
      if (letterContentWrapper) {
        letterContentWrapper.style.display = 'none';
      }
    }, 2400);
  }

  function fireConfetti() {
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  // ------------------------------------------------------------------------
  // 5. Phase 4: Envelope & Typewriter Love Letter
  // ------------------------------------------------------------------------
  function openEnvelopeAndStartLetter() {
    if (!envelopeWrapper || envelopeWrapper.classList.contains('open')) return;

    sfx.playKeyUnlock();
    envelopeWrapper.classList.add('open');

    // Fire Confetti & Love Explosion on envelope open
    fireConfetti();

    setTimeout(() => {
      envelopeWrapper.style.display = 'none';
      if (letterContentWrapper) {
        letterContentWrapper.style.display = 'block';
      }
      startTypewriter();
    }, 600);
  }

  function startTypewriter() {
    if (typewriterInterval) clearInterval(typewriterInterval);
    typewriterText.textContent = '';
    
    const paragraphs = config.letterParagraphs || ["Selamat Ulang Tahun!"];
    const fullText = paragraphs.join("\n\n");
    let charIndex = 0;

    typewriterInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        typewriterText.textContent += fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
      }
    }, 35);
  }

  function toggleCandleFlame() {
    sfx.playClick();
    isCandleLit = !isCandleLit;
    if (isCandleLit) {
      candleFlame.classList.remove('blown-out');
      cakeHint.textContent = "Klik lilin untuk membuat harapan & melempar kembang api! ✨";
    } else {
      candleFlame.classList.add('blown-out');
      cakeHint.textContent = "Harapanmu telah terucap! 🌟 (Klik lagi untuk menyalakan lilin)";
      fireConfetti();
      sfx.playKeyUnlock();
    }
  }

  // ------------------------------------------------------------------------
  // 6. Stacked Photo Polaroid Grid & Dedicated Video Section
  // ------------------------------------------------------------------------
  function renderPhotoGrid() {
    if (!photoStackedGrid) return;
    photoStackedGrid.innerHTML = '';
    const photos = config.photos || [];

    photos.forEach((photo) => {
      // Create Polaroid card element
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="polaroid-img-wrapper">
          <img src="${photo.url}" alt="${photo.title || 'Foto Kenangan'}" loading="lazy" />
        </div>
        <div class="polaroid-info">
          <div class="polaroid-title">${photo.title || ''}</div>
          <div class="polaroid-caption">${photo.caption || ''}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        openPhotoLightbox(photo.url, photo.title, photo.caption);
      });

      photoStackedGrid.appendChild(card);
    });
  }

  function renderVideoSection() {
    if (!videoFrameContainer) return;
    videoFrameContainer.innerHTML = '';
    
    // Combine video items from config.videos and any config.photos with type === 'video'
    let videoList = Array.isArray(config.videos) ? [...config.videos] : [];
    if (Array.isArray(config.photos)) {
      const photoVideos = config.photos.filter(p => p.type === 'video');
      videoList = [...videoList, ...photoVideos];
    }

    if (videoList.length === 0) {
      videoFrameContainer.innerHTML = `
        <div class="single-video-item">
          <div class="video-info" style="text-align: center;">
            <div class="video-title">Belum Ada Video Kenangan 🎥</div>
            <div class="video-caption">Tambahkan path file videomu di file config.js pada bagian "videos".</div>
          </div>
        </div>
      `;
      return;
    }

    videoList.forEach((v) => {
      const item = document.createElement('div');
      item.className = 'single-video-item';
      item.innerHTML = `
        <div class="video-player-wrapper">
          <video src="${v.url}" controls playsinline loading="lazy"></video>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title || 'Video Kenangan Singkat 🎥'}</div>
          <div class="video-caption">${v.caption || ''}</div>
        </div>
      `;
      videoFrameContainer.appendChild(item);
    });
  }

  function openPhotoLightbox(url, title, caption) {
    if (!photoLightbox) return;
    sfx.playClick();
    lightboxImg.src = url;
    lightboxTitle.textContent = title || '';
    lightboxCaption.textContent = caption || '';
    photoLightbox.classList.add('active');
  }

  function closePhotoLightbox() {
    if (!photoLightbox) return;
    sfx.playClick();
    photoLightbox.classList.remove('active');
  }

  // ------------------------------------------------------------------------
  // 7. Floating Music Controller
  // ------------------------------------------------------------------------
  function toggleMusic() {
    const muted = sfx.toggleMute();
    updateMusicUI(!muted);
  }

  function updateMusicUI(isPlaying) {
    if (isPlaying && !sfx.isMuted) {
      musicIcon.className = 'fa-solid fa-compact-disc fa-spin';
      musicStatusText.textContent = 'Memutar Musik 🎵';
    } else {
      musicIcon.className = 'fa-solid fa-volume-xmark';
      musicStatusText.textContent = 'Audio Dibisukan';
    }
  }

  // ------------------------------------------------------------------------
  // 8. Romantic Floating Heart Particles Background
  // ------------------------------------------------------------------------
  function initHeartParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    function drawHeart(x, y, size, opacity) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(x, y);
      ctx.scale(size / 20, size / 20);
      ctx.fillStyle = `rgba(255, 71, 119, ${opacity * 0.85})`;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -10, -20, 5, 0, 18);
      ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        drawHeart(p.x, p.y, p.size, p.opacity);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ------------------------------------------------------------------------
  // 9. Full Love Rain Loop when opening website
  // ------------------------------------------------------------------------
  function initFullLoveRain() {
    const overlay = document.createElement('div');
    overlay.className = 'full-love-overlay';
    document.body.appendChild(overlay);

    const hearts = ['💖', '💕', '💗', '❤️', '💘', '💓', '✨', '🌸', '💝', '🎂'];
    let heartSpawnInterval = null;

    function spawnLoveHeart() {
      const heart = document.createElement('div');
      heart.className = 'full-love-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

      const left = Math.random() * 100;
      const delay = Math.random() * 1.2;
      const size = Math.random() * 1.8 + 1.2;
      const rot = (Math.random() - 0.5) * 60;

      heart.style.left = `${left}vw`;
      heart.style.top = '110vh';
      heart.style.animationDelay = `${delay}s`;
      heart.style.fontSize = `${size}rem`;
      heart.style.setProperty('--target-scale', `${size}`);
      heart.style.setProperty('--rot', `${rot}deg`);
      heart.style.setProperty('--drift', `${Math.random() * 20 - 10}vw`);

      overlay.appendChild(heart);

      const lifespan = 4200 + delay * 1000;
      setTimeout(() => {
        heart.remove();
      }, lifespan);
    }

    const spawnCount = 7;
    const spawnHearts = () => {
      for (let i = 0; i < spawnCount; i++) {
        setTimeout(spawnLoveHeart, i * 160);
      }
    };

    spawnHearts();
    heartSpawnInterval = setInterval(spawnHearts, 2100);

    window.addEventListener('beforeunload', () => {
      if (heartSpawnInterval) clearInterval(heartSpawnInterval);
    });
  }

  // ------------------------------------------------------------------------
  // 10. Global Screen Click FULL BOM LOVE Explosion Effect
  // ------------------------------------------------------------------------
  function initScreenClickLove() {
    const loveEmojis = ['💖', '💕', '💗', '❤️', '💘', '✨', '💓', '🌸', '💝', '🎂', '💌', '💞'];

    document.addEventListener('click', (e) => {
      // FULL BOM LOVE: 24 - 30 hearts bursting 360 degrees radially from click location
      const heartCount = Math.floor(Math.random() * 6) + 24;

      for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        heart.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];

        // Calculate radial direction (360 deg) and explosion speed
        const angle = (i / heartCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const distance = Math.random() * 140 + 70; // explosion radius 70px to 210px
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 100;
        const fontSize = Math.random() * 1.3 + 1.2; // random size 1.2rem - 2.5rem

        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.fontSize = `${fontSize}rem`;
        heart.style.setProperty('--dx', `${dx}px`);
        heart.style.setProperty('--dy', `${dy}px`);
        heart.style.setProperty('--rot', `${rot}deg`);

        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 1200);
      }
    });
  }

  // Initialize Application
  init();
});
