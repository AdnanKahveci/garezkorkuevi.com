import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, isMobile, isLiteMode } from '../scare-engine/ExperienceState';
import { setHorrorSceneActive, setInReservation } from '../scare-engine/JumpscareEngine';
import { audioManager } from '../audio/AudioManager';

gsap.registerPlugin(ScrollTrigger);

export function initScrollScenes(): void {
  if (isReducedMotion()) {
    initReducedMotionScenes();
    return;
  }

  if (isLiteMode()) {
    initLiteScenes();
    return;
  }

  initHeroScene();
  initRevealSlides();
  initFrankensteinScene();
  initSideShadowPasses();
  initWebReveals();
  initStoryRevealScene();
  initFeaturesScene();
  initGalleryScene();
  initTestimonialsScene();
  initFinalCTAScene();
  initFogParallax();
}

function initReducedMotionScenes(): void {
  gsap.utils.toArray<HTMLElement>('.reveal-fade, .reveal-from-left, .reveal-from-right').forEach((el) => {
    gsap.set(el, { opacity: 1, x: 0, y: 0 });
  });
  gsap.utils.toArray<HTMLElement>('.gallery__item').forEach((el) => {
    gsap.set(el, { opacity: 1, scale: 1 });
  });
}

/** Mobil / düşük performans — hafif scroll animasyonları */
function initLiteScenes(): void {
  gsap.utils.toArray<HTMLElement>('.reveal-fade, .reveal-from-left, .reveal-from-right').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('.gallery__item, .feature__card, .testimonial__card, .frankenstein__stat').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        once: true,
      },
    });
  });

  initSideShadowPasses();
}

function initHeroScene(): void {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const title = hero.querySelector('.hero__title');
  const subtitle = hero.querySelector('.hero__subtitle');
  const cta = hero.querySelector('.hero__cta');
  const scrollHint = hero.querySelector('.hero__scroll-hint');

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  if (title) {
    tl.from(title, { opacity: 0, y: 50, duration: 1.2 }, 0.3);
  }
  if (subtitle) {
    tl.from(subtitle, { opacity: 0, y: 30, duration: 0.9 }, 0.7);
  }
  if (cta) {
    tl.from(cta, { opacity: 0, scale: 0.9, duration: 0.7 }, 1);
  }
  if (scrollHint) {
    tl.from(scrollHint, { opacity: 0, y: 10, duration: 0.6 }, 1.3);
    gsap.to(scrollHint, {
      y: 8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  const heroBg = hero.querySelector('.hero__bg');
  if (heroBg) {
    gsap.to(heroBg, {
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }
}

function initRevealSlides(): void {
  gsap.utils.toArray<HTMLElement>('.reveal-from-left').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: -80,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('.reveal-from-right').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: 80,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('.reveal-fade').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initFrankensteinScene(): void {
  const section = document.querySelector('#oyun');
  if (!section) return;

  const stats = section.querySelectorAll('.frankenstein__stat');
  stats.forEach((stat, i) => {
    gsap.from(stat, {
      opacity: 0,
      y: 40,
      scale: 0.9,
      duration: 0.7,
      delay: i * 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initSideShadowPasses(): void {
  const shadows = document.querySelectorAll<HTMLElement>('[data-side-shadow]');
  shadows.forEach((shadow) => {
    const direction = shadow.dataset.direction || 'left';
    const trigger = shadow.dataset.trigger;
    const triggerEl = trigger ? document.querySelector(trigger) : document.querySelector('#oyun');

    if (!triggerEl) return;

    const fromX = direction === 'left' ? '-30vw' : '30vw';
    const toX = direction === 'left' ? '115vw' : '-115vw';

    gsap.set(shadow, { x: fromX, opacity: 0, visibility: 'hidden' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          shadow.classList.add('side-shadow--visible');
          shadow.style.visibility = 'visible';
        },
      },
    });

    tl.to(shadow, {
      x: direction === 'left' ? '40vw' : '60vw',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }).to(shadow, {
      x: toX,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    });
  });

  const fastShadow = document.querySelector('.fast-shadow');
  if (fastShadow) {
    gsap.set(fastShadow, { x: '-40vw', opacity: 0 });
    gsap.to(fastShadow, {
      x: '120vw',
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '#oyun',
        start: 'top 60%',
        once: true,
      },
    });
  }
}

/** Hemen görünür gölge geçişi — deneyim başladıktan sonra */
function initWelcomeShadowPasses(): void {
  if (isMobile()) return;

  setTimeout(() => playSideShadowPass('left', '30%'), 2000);
  setTimeout(() => playSideShadowPass('right', '55%'), 4500);
}

export function playSideShadowPass(direction: 'left' | 'right', top = '40%'): void {
  if (isReducedMotion()) return;

  const src = '/images/jumpscare/garez-yuz.png';
  const width = 260;
  const height = 320;

  const el = document.createElement('div');
  el.className = `side-shadow side-shadow--${direction} side-shadow--md side-shadow--visible`;
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `position:fixed;left:0;z-index:45;pointer-events:none;top:${top};width:${width}px;height:${height}px;visibility:visible;opacity:1;`;

  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.className = 'side-shadow__img';
  img.style.cssText = 'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 22px rgba(180,0,0,0.85)) contrast(1.2) brightness(1.05);opacity:1;';
  el.appendChild(img);
  document.body.appendChild(el);

  const fromX = direction === 'left' ? '-40vw' : '40vw';
  const toX = direction === 'left' ? '120vw' : '-120vw';
  const duration = 0.7 + Math.random() * 0.35;

  gsap.set(el, { x: fromX, opacity: 0, scale: 0.75, rotate: direction === 'left' ? -8 : 8 });
  gsap.timeline({ onComplete: () => el.remove() })
    .to(el, {
      x: direction === 'left' ? '35vw' : '65vw',
      opacity: 1,
      scale: 1.15,
      rotate: 0,
      duration: duration * 0.4,
      ease: 'power2.out',
    })
    .to(el, {
      x: toX,
      opacity: 0,
      scale: 0.85,
      rotate: direction === 'left' ? 6 : -6,
      duration: duration * 0.6,
      ease: 'power2.in',
    });
}

function initPeriodicShadowPasses(): void {
  if (isReducedMotion()) return;

  const pass = () => {
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    const top = `${15 + Math.random() * 55}%`;
    playSideShadowPass(direction, top);
  };

  const schedule = () => {
    const delay = 6000 + Math.random() * 8000;
    setTimeout(() => {
      if (!document.hidden && !isReducedMotion()) pass();
      schedule();
    }, delay);
  };

  setTimeout(schedule, 7000);
}

function initWebReveals(): void {
  document.querySelectorAll<HTMLElement>('[data-web-reveal]').forEach((web) => {
    const side = web.classList.contains('web-reveal--right') ? 'right' : 'left';
    const trigger = web.dataset.trigger;
    const triggerEl = trigger ? document.getElementById(trigger) || document.querySelector(trigger) : web.parentElement;

    if (!triggerEl) return;

    const fromX = side === 'left' ? -220 : 220;
    gsap.set(web, { x: fromX, opacity: 0 });

    gsap.to(web, {
      x: 0,
      opacity: 0.85,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initStoryRevealScene(): void {
  const stories = document.querySelectorAll('.story__entry');
  stories.forEach((entry, i) => {
    gsap.from(entry, {
      opacity: 0,
      x: i % 2 === 0 ? -50 : 50,
      rotateZ: i % 2 === 0 ? -1.5 : 1.5,
      duration: 0.8,
      scrollTrigger: {
        trigger: entry,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initFeaturesScene(): void {
  const cards = document.querySelectorAll('.feature__card');
  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      x: i % 2 === 0 ? -60 : 60,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initGalleryScene(): void {
  const items = document.querySelectorAll('.gallery__item');
  items.forEach((item, i) => {
    const fromX = i % 2 === 0 ? -40 : 40;
    gsap.from(item, {
      opacity: 0,
      x: fromX,
      scale: 0.95,
      duration: 0.9,
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initTestimonialsScene(): void {
  const items = document.querySelectorAll('.testimonial__card');
  items.forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      x: i % 2 === 0 ? -30 : 30,
      duration: 0.7,
      stagger: 0.1,
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initFinalCTAScene(): void {
  const cta = document.querySelector('.final-cta');
  if (!cta) return;

  const doorLeft = cta.querySelector('.final-cta__door--left');
  const doorRight = cta.querySelector('.final-cta__door--right');
  const btn = cta.querySelector('.final-cta__btn');
  const redGlow = cta.querySelector('.final-cta__red-glow');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cta,
      start: 'top 65%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        setInReservation(true);
        audioManager.setReservationDuck(true);
      },
      onLeaveBack: () => {
        setInReservation(false);
        audioManager.setReservationDuck(false);
      },
    },
  });

  if (doorLeft && doorRight) {
    tl.to(doorLeft, { x: '-100%', duration: 1.2, ease: 'power2.inOut' }, 0)
      .to(doorRight, { x: '100%', duration: 1.2, ease: 'power2.inOut' }, 0);
  }
  if (redGlow) {
    tl.from(redGlow, { opacity: 0, scale: 0.8, duration: 1 }, 0.3);
  }
  if (btn) {
    tl.from(btn, { opacity: 0, scale: 0.85, duration: 0.7 }, 0.6);
  }
}

function initFogParallax(): void {
  document.querySelectorAll('.fog-system').forEach((fog) => {
    const section = fog.closest('section');
    if (!section) return;

    const layers = fog.querySelectorAll('.fog-layer');
    layers.forEach((layer, i) => {
      gsap.to(layer, {
        y: (i + 1) * -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  });
}

export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

export function killScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
