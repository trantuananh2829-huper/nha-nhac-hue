/* Nhã nhạc cung đình Huế — scroll slideshow, auto-advance, background music */
(() => {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const autoBtn = document.querySelector('.auto');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const STEP_MS = 7000;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ————— zoom + drift while a slide crosses the viewport ————— */
  const frames = slides.map((slide) => ({ slide, img: slide.querySelector('.slide__img') }));
  let queued = 0;

  function paint() {
    queued = 0;
    const vh = window.innerHeight;

    for (const { slide, img } of frames) {
      const rect = slide.getBoundingClientRect();
      if (rect.bottom < -vh * 0.3 || rect.top > vh * 1.3) continue;

      // 0 → entering from below, 1 → leaving above
      const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      const drift = (p - 0.5) * 2;
      const scale = 1.015 + 0.045 * (1 - Math.abs(drift));

      img.style.transform = `translate3d(0,${(drift * -26).toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    }
  }

  const schedulePaint = () => {
    if (!queued) queued = requestAnimationFrame(paint);
  };

  if (!reduceMotion.matches) {
    window.addEventListener('scroll', schedulePaint, { passive: true });
    window.addEventListener('resize', schedulePaint);
    paint();
  }

  /* ————— fade captions in while a slide owns the screen ————— */
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-active', entry.isIntersecting);
    },
    { threshold: 0.42 }
  );
  slides.forEach((slide) => observer.observe(slide));

  /* ————— auto-advance, one slide at a time ————— */
  let timer = null;

  function currentIndex() {
    const line = window.innerHeight * 0.45;
    let index = 0;
    slides.forEach((slide, i) => {
      if (slide.getBoundingClientRect().top <= line) index = i;
    });
    return index;
  }

  function goTo(index) {
    slides[clamp(index, 0, slides.length - 1)].scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    autoBtn.setAttribute('aria-pressed', 'false');
  }

  function step() {
    const here = currentIndex();
    if (here >= slides.length - 1) {
      stop();
      return;
    }
    goTo(here + 1);
  }

  function start() {
    if (timer) return;
    autoBtn.setAttribute('aria-pressed', 'true');

    // pressing the button on the last slide rewinds to the opening image
    if (currentIndex() >= slides.length - 1) goTo(0);
    else step();

    timer = setInterval(step, STEP_MS);
  }

  autoBtn.addEventListener('click', () => (timer ? stop() : start()));

  // any manual navigation takes over from the autoplay
  ['wheel', 'touchstart'].forEach((type) => window.addEventListener(type, stop, { passive: true }));
  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stop();
  });
  window.addEventListener('blur', stop);

  /* ————— background music: one toggle per track, faded in and out ————— */
  const VOLUME = 0.55;
  const FADE_MS = reduceMotion.matches ? 0 : 900;
  const players = [];

  function createPlayer(button) {
    const audio = document.getElementById(button.dataset.audio);
    const holder = button.closest('.player');
    const timeEl = holder.querySelector('.player__time');
    const barEl = holder.querySelector('.player__bar i');
    let fadeTimer = 0;

    const clock = (seconds) => {
      if (!Number.isFinite(seconds)) return '0:00';
      return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    };

    const renderTime = () => {
      timeEl.textContent = `${clock(audio.currentTime)} / ${clock(audio.duration)}`;
      barEl.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100}%` : '0%';
    };

    audio.addEventListener('timeupdate', renderTime);
    audio.addEventListener('loadedmetadata', renderTime);

    // timer, not requestAnimationFrame: browsers throttle rAF in background tabs,
    // which would leave the volume stuck at zero while the music plays
    const fadeTo = (target) => new Promise((resolve) => {
      clearInterval(fadeTimer);

      if (!FADE_MS) {
        audio.volume = target;
        resolve();
        return;
      }

      const from = audio.volume;
      const startedAt = performance.now();

      fadeTimer = setInterval(() => {
        const k = Math.min(1, (performance.now() - startedAt) / FADE_MS);
        audio.volume = from + (target - from) * k;
        if (k === 1) {
          clearInterval(fadeTimer);
          fadeTimer = 0;
          resolve();
        }
      }, 40);
    });

    const setState = (playing) => {
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? button.dataset.labelOn : button.dataset.labelOff);
      holder.classList.toggle('is-playing', playing);
    };

    const noTrack = () => {
      audio.volume = VOLUME;
      button.classList.add('is-missing');
      button.title = `Chưa có tệp nhạc — thêm ${audio.getAttribute('src')}`;
      setState(false);
    };

    audio.volume = VOLUME;
    audio.addEventListener('error', noTrack);

    const player = {
      async stop() {
        if (audio.paused) return;
        setState(false);
        await fadeTo(0);
        audio.pause();
      },

      async play() {
        // only one track at a time: the others fade out while this one fades in
        const fading = players.filter((other) => other !== player).map((other) => other.stop());

        audio.volume = 0;
        try {
          await audio.play();
          setState(true);
          button.classList.remove('is-missing');
          button.removeAttribute('title');
          await fadeTo(VOLUME);
        } catch (err) {
          noTrack();
        }
        await Promise.all(fading);
      }
    };

    button.addEventListener('click', () => (audio.paused ? player.play() : player.stop()));
    return player;
  }

  document.querySelectorAll('[data-audio]').forEach((button) => players.push(createPlayer(button)));
})();
