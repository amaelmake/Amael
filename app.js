// =============================
  // 9) ANIMATION SPLITTEXT SUR LE SOUS-TITRE
  // =============================
  function animateSubtitle() {
    if (window.SplitText && document.querySelector('.js-subtitle')) {
      const subtitleEl = document.querySelector('.js-subtitle');
      if (!subtitleEl.dataset.splitDone) {
        subtitleEl.dataset.splitDone = '1';
        const split = new SplitText(subtitleEl, { type: 'chars,words' });
        gsap.from(split.chars, {
          y: 40,
          opacity: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2
        });
      }
    }
  }
  // Pas d'effet SplitText sur le titre principal, séparation fluide des deux calques uniquement (comportement optimal)
// Ce fichier doit être inclus dans le HTML après GSAP, sans balises <script> à l'intérieur.
/* idempotence : empêche les doubles inits (HMR, imports multiples, etc.) */
if (!window.__fxInit) { window.__fxInit = true;

  // Animation d'intro : image plein écran qui disparaît
  const intro = document.querySelector('.intro-overlay');
  if (intro) {
    gsap.set(intro, { opacity: 1 });
    gsap.set('.intro-img', { scale: 1 });
    // Masquer tout sauf l'overlay
    document.body.classList.add('hide-main');
    // Pause visible avant le zoom (plus courte)
    setTimeout(() => {
      // Zoom extrême et très rapide
      gsap.to('.intro-img', { scale: 30, duration: 0.22, ease: 'power2.in' });
      // Faire apparaître le site quasi en même temps que le zoom
      gsap.to(intro, {
        opacity: 0,
        duration: 0.66,
        ease: 'power2.inOut',
        delay: 0.01,
        onComplete: () => {
          intro.classList.add('is-hidden');
          intro.style.display = 'none';
          document.body.classList.remove('hide-main');
          animateSubtitle();
        }
      });
    }, 350);
  // Si pas d'overlay, lancer l'animation du sous-titre tout de suite
  if (!document.querySelector('.intro-overlay')) {
    animateSubtitle();
  }
  }

  // Effet de séparation du titre au scroll (clip-path, blur, translation)
  const once = (selector, fn) => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.dataset.fxDone) return;
      el.dataset.fxDone = "1";
      fn(el);
    });
  };

  once(".js-title", (titleEl) => {
    if (!titleEl.querySelector(".hero__layerTop")) {
      const html = titleEl.innerHTML;
      const top = document.createElement("div");
      top.className = "hero__layer hero__layerTop";
      top.innerHTML = html;
      const bottom = document.createElement("div");
      bottom.className = "hero__layer hero__layerBottom";
      bottom.innerHTML = html;
      titleEl.appendChild(top);
      titleEl.appendChild(bottom);
      titleEl.style.position = titleEl.style.position || "relative";
    }
    function update() {
      const rect = titleEl.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = vh * 0.10, end = vh * 0.90;
      let p = (end - rect.top) / (end - start); // 0..1
      p = Math.max(0, Math.min(1, p));
      const maxOffset = 60; // PX: ouverture plus marquée
      const blurMax = 8;
      const opacityMin = 0.5;
      gsap.to(".hero__layerTop",    { y: -maxOffset * p, filter: "blur(" + (blurMax * p) + "px)", opacity: 1 - (1-opacityMin)*p, duration: 0.5, ease: "power2.out" });
      gsap.to(".hero__layerBottom", { y:  maxOffset * p, filter: "blur(" + (blurMax * p) + "px)", opacity: 1 - (1-opacityMin)*p, duration: 0.5, ease: "power2.out" });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  });

  // Insertion dynamique des projets (image + titre descriptif)
  const projects = [
    {
      url: "https://i.pinimg.com/736x/bf/98/8e/bf988ee0c22cc657d29753187150d09c.jpg",
      title: "UI e‑commerce — Hero visuel immersif"
    },
    {
      url: "https://i.pinimg.com/736x/0e/de/38/0ede38b9a8180475353def51308c72f0.jpg",
      title: "Landing créative — Typographie forte"
    },
    {
      url: "https://i.pinimg.com/1200x/2a/83/b9/2a83b99ba1eae24204013561408fe59d.jpg",
      title: "Portfolio — Mise en scène produit premium"
    },
    {
      url: "https://i.pinimg.com/1200x/49/d6/32/49d6326bdf674be11214b6677b065b1f.jpg",
      title: "Direction artistique — Visuel éditorial"
    },
    {
      url: "https://i.pinimg.com/736x/24/b6/a7/24b6a7e3764083ce8385bbe80ddce15f.jpg",
      title: "Branding — Identité minimaliste"
    },
    {
      url: "https://i.pinimg.com/736x/e3/87/a2/e387a2fc68928665bd6e68eec840af8a.jpg",
      title: "Illustration — Univers vibrant"
    },
    {
      url: "https://i.pinimg.com/1200x/e0/5e/e4/e05ee49e8eab63d52420168b030762de.jpg",
      title: "Concept — Interface expérimentale"
    },
    {
      url: "https://i.pinimg.com/1200x/a6/5e/f3/a65ef3eef96d6c9ff39c3d9f2827e7db.jpg",
      title: "Campagne — Visuel lifestyle"
    }
  ];
  const workGrid = document.querySelector(".work");
  if (workGrid && !workGrid.dataset.fxFilled) {
    workGrid.dataset.fxFilled = "1";
    workGrid.innerHTML = "";
    projects.forEach((project, i) => {
      const card = document.createElement("article");
      card.className = "card";
      const media = document.createElement("div");
      media.className = "card__media";
      if (project.url) media.style.backgroundImage = `url("${project.url}")`;
      media.style.backgroundSize = "cover";
      media.style.backgroundPosition = "center";
      const body = document.createElement("div");
      body.className = "card__body";
      const title = document.createElement("h4");
      title.className = "card__title";
      title.textContent = project.title || `Projet ${i+1}`;
      const tag = document.createElement("span");
      tag.className = "card__tag";
      tag.textContent = "Case study";
      body.appendChild(title);
      body.appendChild(tag);
      card.appendChild(media);
      card.appendChild(body);
      workGrid.appendChild(card);
    });
  }

  // Animation hover sur les cartes
  document.querySelectorAll(".card").forEach(card => {
    const media = card.querySelector(".card__media");
    if (!media) return;
    card.addEventListener("mouseenter", () => gsap.to(media, { scale: 1.03, duration: 0.35, ease: "power2.out" }));
    card.addEventListener("mouseleave", () => gsap.to(media, { scale: 1,    duration: 0.40, ease: "power2.out" }));
  });

  // Scroll fluide GSAP
  if (window.ScrollSmoother) {
    ScrollSmoother.create({
      smooth: 1.2,
      effects: true
    });
  }

  // Animation contact avec scroll natif
  function initContactAnimation() {
    const contactSection = document.querySelector('.contact-anim');
    if (!contactSection) {
      console.log('Section contact non trouvée');
      return;
    }
    
    console.log('Initialisation animation contact...');
    
    // État initial - tout caché
    gsap.set('.contact-badge', {opacity: 0, y: 30});
    gsap.set('.contact-title', {opacity: 0, y: 30});
    gsap.set('.contact-mail', {opacity: 0, y: 30});
    gsap.set('.contact-btn', {opacity: 0, y: 30});
    
    let hasAnimated = false;
    
    // Animation avec scroll natif
    function checkScroll() {
      const rect = contactSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && !hasAnimated) {
        hasAnimated = true;
        console.log('Animation contact déclenchée !');
        
        // Animation des éléments
        gsap.to('.contact-badge', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to('.contact-title', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.1
        });
        
        gsap.to('.contact-mail', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2
        });
        
        gsap.to('.contact-btn', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3
        });
      }
    }
    
    // Écouter le scroll
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Vérifier immédiatement
  }
  
  // Initialiser l'animation contact
  initContactAnimation();

  // Animation néon blanc lettre par lettre au scroll (fluide, sans randomness)
  function initElectricTextAnimation() {
    const electricText = document.querySelector('.electric-text');
    if (!electricText) return;

    // Diviser le texte en lettres
    function splitTextIntoLetters() {
      // Conserver les <br> en \n, puis reconstruire mots (non coupés) et lettres
      const html = electricText.innerHTML;
      const withNewlines = html.replace(/<br\s*\/?>(\n)?/gi, '\n');
      electricText.innerHTML = '';

      const lines = withNewlines.split('\n');
      lines.forEach((line, lineIndex) => {
        // Découper la ligne en mots (en gardant ponctuation attachée)
        const words = line.split(/(\s+)/); // conserve les espaces comme tokens
        words.forEach(token => {
          if (/^\s+$/.test(token)) {
            // espaces: on met un espace normal
            electricText.appendChild(document.createTextNode(token));
          } else if (token.length) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            // pour chaque caractère du mot, créer une lettre
            for (let i = 0; i < token.length; i++) {
              const letterSpan = document.createElement('span');
              letterSpan.className = 'letter';
              letterSpan.textContent = token[i];
              wordSpan.appendChild(letterSpan);
            }
            electricText.appendChild(wordSpan);
          }
        });
        if (lineIndex < lines.length - 1) {
          electricText.appendChild(document.createElement('br'));
        }
      });
    }

    // Initialiser la division du texte
    splitTextIntoLetters();
    const letters = electricText.querySelectorAll('.letter');
    const words = Array.from(electricText.querySelectorAll('.word'));
    // Construire des plages cumulées de lettres par mot pour éviter les coupes
    const wordRanges = [];
    {
      let indexCursor = 0;
      words.forEach(w => {
        const len = w.querySelectorAll('.letter').length;
        wordRanges.push({ start: indexCursor, end: indexCursor + len, el: w });
        indexCursor += len;
      });
    }
    
    // Animation au scroll avec ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    const st = ScrollTrigger.create({
      trigger: '.black-section',
      start: 'top 55%',
      end: 'top -30%',
      scrub: 1,
      onUpdate: (self) => {
        const totalLetters = letters.length;
        const slowed = Math.pow(self.progress, 1.1);
        const lettersToColor = Math.floor(slowed * totalLetters);
        // Apparition par mots entiers: calculer combien de lettres devraient être visibles
        const appearProgress = Math.max(0, slowed - 0.06);
        const lettersThreshold = Math.floor(appearProgress * totalLetters);

        // 1) Appliquer visibilité par mots (pas de mot coupé)
        wordRanges.forEach(range => {
          const lettersInWord = range.el.querySelectorAll('.letter');
          if (range.end <= lettersThreshold) {
            lettersInWord.forEach(l => l.classList.add('visible'));
          } else {
            lettersInWord.forEach(l => { l.classList.remove('visible'); l.classList.remove('colored'); });
          }
        });

        // 2) Colorer lettre par lettre, uniquement si déjà visible
        for (let i = 0; i < totalLetters; i++) {
          if (i < lettersToColor && letters[i].classList.contains('visible')) {
            letters[i].classList.add('colored');
          } else {
            letters[i].classList.remove('colored');
          }
        }

        // 3) À la toute fin du scroll, s'assurer que tout est affiché/coloré
        if (self.progress >= 0.995) {
          for (let i = 0; i < totalLetters; i++) {
            letters[i].classList.add('visible');
            letters[i].classList.add('colored');
          }
        }
      }
    });
  }

  // Initialiser l'animation électrique
  initElectricTextAnimation();

  // Image reveal: zoom au scroll puis texte qui apparaît par-dessus
  (function initImageReveal(){
    const section = document.querySelector('.image-reveal');
    if (!section || !window.ScrollTrigger) return;
    const img = section.querySelector('.image-reveal__media');
    const overlayText = section.querySelector('.image-reveal__text');
    gsap.registerPlugin(ScrollTrigger);

    // Timeline: pin image, scroll text over, then gentle de-zoom at the very end
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        endTrigger: '#work',
        end: 'top 50%', // relâche plus tôt pour laisser place au contact
        scrub: true,
        pin: true, // pinner toute la section pour éviter le chevauchement
        pinSpacing: true, // garder l'espace normal après le pin
        anticipatePin: 1
      }
    });

    // 1) Image reste à l'échelle 1 (pas de zoom initial)
    gsap.set(img, { scale: 1 });
    // 2) Texte apparaît et défile par-dessus pendant le pin
    tl.to(overlayText, { opacity: 1, y: '0%', ease: 'power1.out', duration: 0.35 });
    tl.to(overlayText, { y: '-25%', ease: 'none', duration: 0.45 });
    // 3) Fin: dézoom plus marqué avant "Réalisations" avec texte qui suit le dezoom puis disparaît
    tl.to(img, { scale: 0.75, ease: 'none', duration: 0.25 }); // De-zoom plus important
    tl.to(overlayText, { scale: 0.75, ease: 'none', duration: 0.25 }, '<'); // Texte suit le dezoom
    tl.to(overlayText, { opacity: 0, ease: 'power1.out', duration: 0.15 }); // Texte disparaît complètement
  })();


} // __fxInit