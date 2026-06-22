/* ═══════════════════════════════════════════
   Common JS — Mega menu, Scroll reveal, GSAP Vibe
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── GNB (lvnav) 모바일 토글 ───
  const lvnav = document.querySelector('.lvnav');
  const lvToggle = document.querySelector('.lvnav-toggle');
  if (lvnav && lvToggle) {
    lvToggle.addEventListener('click', () => {
      const open = lvnav.classList.toggle('is-open');
      lvToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    lvnav.querySelectorAll('.lvnav-mobile a').forEach(a => {
      a.addEventListener('click', () => {
        lvnav.classList.remove('is-open');
        lvToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── Mega menu toggle ───
  const toggle = document.querySelector('.gnb-toggle');
  const megaMenu = document.getElementById('megaMenu');
  const megaClose = document.querySelector('.mega-menu-close');

  function openMenu() {
    megaMenu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    megaMenu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && megaMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = megaMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    if (megaClose) {
      megaClose.addEventListener('click', closeMenu);
    }

    megaMenu.querySelectorAll('a:not(.gnb-logo)').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaMenu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // ─── Scroll reveal animation ───
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ─── GNB scroll shadow ───
  const gnb = document.querySelector('.gnb');
  if (gnb) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        gnb.classList.add('gnb--scrolled');
      } else {
        gnb.classList.remove('gnb--scrolled');
      }
    }, { passive: true });
  }

  // ─── GSAP + ScrollTrigger ───
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ─── Hero scramble text (ScrambleTextPlugin 대체) ───
  const scrambleEl = document.querySelector('.hero-rotating');
  if (scrambleEl) {
    const words = [
      '골목길 풍경으로', '야르맛집으로', '감성투어로', '바닷가 별보기로',
      '터프캠핑으로', '부산으로', '페이커로', '레트로로', '떡볶이로'
    ];
    const colors = ['#EA3E4A', '#43AAFA', '#FDF45B', '#B0AFCF', '#88C2EE'];
    const scrambleChars = '가나다라마바사아자차카타파하!@#&*';
    let wordIndex = 0;

    function randomColor() {
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function scrambleTo(target, callback) {
      const current = scrambleEl.textContent;
      const maxLen = Math.max(current.length, target.length);
      const totalFrames = 20;
      let frame = 0;

      const color = randomColor();
      scrambleEl.style.color = color;

      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        let display = '';

        for (let i = 0; i < maxLen; i++) {
          if (i < target.length && progress > (i / maxLen) * 0.8 + 0.2) {
            display += target[i];
          } else if (i < maxLen) {
            display += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }

        scrambleEl.textContent = display;

        if (frame >= totalFrames) {
          clearInterval(interval);
          scrambleEl.textContent = target;
          if (callback) callback();
        }
      }, 40);
    }

    // 초기 색상
    scrambleEl.style.color = randomColor();

    setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      scrambleTo(words[wordIndex]);
    }, 2800);
  }

  // ─── 컨셉 제목 한 줄 자동 맞춤 (가장 긴 단어 기준) ───
  const conceptTitle = document.querySelector('.lv-concept-title');
  const conceptWordEl = conceptTitle && conceptTitle.querySelector('.lv-bracket-word');
  function fitConceptTitle() {
    if (!conceptTitle || !conceptWordEl) return;
    const orig = conceptWordEl.textContent;
    conceptWordEl.textContent = '커뮤니티'; // 최장 단어 기준
    conceptTitle.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(conceptTitle).fontSize);
    let guard = 80;
    while (conceptTitle.scrollWidth > conceptTitle.clientWidth && fs > 9 && guard-- > 0) {
      fs -= 1;
      conceptTitle.style.fontSize = fs + 'px';
    }
    conceptWordEl.textContent = orig;
  }
  if (conceptTitle) {
    fitConceptTitle();
    window.addEventListener('resize', fitConceptTitle, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitConceptTitle);
  }

  // ─── 컨셉 브래킷 회전 텍스트 ([ 여행 ] 이다) ───
  const bracketEl = document.querySelector('.lv-bracket-word[data-rotate]');
  if (bracketEl) {
    const bracketWords = ['여행', '음식', '체험', '콘텐츠', '커뮤니티', '취향', '로컬'];
    let bi = 0;
    setInterval(() => {
      bi = (bi + 1) % bracketWords.length;
      bracketEl.style.opacity = '0';
      bracketEl.style.transform = 'translateY(6px)';
      bracketEl.style.transition = 'opacity .25s ease, transform .25s ease';
      setTimeout(() => {
        bracketEl.textContent = bracketWords[bi];
        bracketEl.style.opacity = '1';
        bracketEl.style.transform = 'translateY(0)';
      }, 260);
    }, 2200);
  }

  // ─── GSAP: Button flair effect (마우스 위치에서 원형 확장) ───
  if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.btn').forEach(btn => {
      // Wrap text content in span for z-index layering
      if (!btn.querySelector('.btn__label')) {
        const label = document.createElement('span');
        label.className = 'btn__label';
        while (btn.firstChild) label.appendChild(btn.firstChild);
        btn.appendChild(label);
      }

      const flair = document.createElement('span');
      flair.className = 'btn__flair';
      btn.prepend(flair);

      btn.addEventListener('mouseenter', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.killTweensOf(flair);
        gsap.set(flair, {
          transformOrigin: `${x}px ${y}px`,
          scale: 0
        });
        gsap.to(flair, {
          scale: 1,
          duration: 0.6,
          ease: 'power3.out'
        });
      });

      btn.addEventListener('mouseleave', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.killTweensOf(flair);
        gsap.set(flair, {
          transformOrigin: `${x}px ${y}px`
        });
        gsap.to(flair, {
          scale: 0,
          duration: 0.5,
          ease: 'power3.in'
        });
      });
    });
  }

});
