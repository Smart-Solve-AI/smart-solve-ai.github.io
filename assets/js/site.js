/* SmartSolveAI — site-wide behaviour, shared by every page.
   Every block guards on the elements it needs, so one file serves all pages. */
// BibTeX
  const bibtex = {
    carrica2026nextlai: `@inproceedings{carrica2026nextlai,
  title     = {{NextL(A)I: Agentic AI Augmentation for the Next Generation of Recursive Mixed-Precision Linear Solvers}},
  author    = {Carrica, Vicki and Alomairy, Rabab and Valero-Lara, Pedro and Edelman, Alan},
  booktitle = {ACM/IEEE Supercomputing Conference (SC) Workshops},
  year      = {2026}
}`,
    tome2026qromega: `@misc{tome2026qromega,
  title   = {{QR-Omega: Communication Avoiding 2.5D Householder QR}},
  author  = {Tom{\\'{e}}, Felipe de Alc{\\^{a}}ntara},
  school  = {ACM Student Research Competition (Graduate), SC26, Chicago, Illinois},
  year    = {2026},
  month   = nov,
  note    = {Advisors: Rabab Alomairy, Alan Edelman, Hermes Senger}
}`,
    pados2026learning: `@inproceedings{pados2026learning,
  title     = {Learning to Select Sparse Linear Solvers with Convolutional Neural Networks},
  author    = {Pados, Artemis and Edelman, Alan and Lujan, Emmanuel and Pickard, Daniel and Tom{\\'{e}}, Felipe and Rackauckas, Christopher},
  booktitle = {IEEE High Performance Extreme Computing Conference (HPEC)},
  year      = {2026},
  url       = {https://ieee-hpec.org/ieee-hpec-2026-agenda/}
}`,
    lujan2026accelerating: `@misc{lujan2026accelerating,
  title  = {Accelerating Linear Solves in Finite Element Simulations with Julia \\& AI},
  author = {Lujan, Emmanuel and Tom{\\'{e}}, Felipe and Alomairy, Rabab and Samaroo, Julian and Pickard, Daniel and Rulko, Theo and Ringoot, Evelyne and Otuzbir, Yaman and Pados, Artemis and Carrica, Victoria and Nguyen, Ngoc and Radovitzky, Raul and Edelman, Alan},
  school = {MIT Center for Exascale Simulation of Coupled High-Enthalpy Fluid--Solid Interactions (CHEFSI) TST Meeting},
  year   = {2026},
  month  = apr,
  url    = {https://dspace.mit.edu/handle/1721.1/166195}
}`,
    pados2026neural: `@misc{pados2026neural,
  title  = {Neural Sparse Linear Solver Selection},
  author = {Pados, Artemis and Rackauckas, Christopher and Edelman, Alan and Lujan, Emmanuel and Pickard, Daniel and Tom{\\'{e}}, Felipe},
  school = {MIT Center for Exascale Simulation of Coupled High-Enthalpy Fluid--Solid Interactions (CHEFSI) TST Meeting},
  year   = {2026},
  month  = apr,
  url    = {https://dspace.mit.edu/handle/1721.1/166196}
}`,
    shah2025data: `@inproceedings{shah2025data,
  title     = {Data-Driven Dynamic Algorithm Dispatch with Large Language Models},
  author    = {Shah, Rushil and Lujan, Emmanuel and Alomairy, Rabab and Edelman, Alan},
  booktitle = {IEEE High Performance Extreme Computing Conference (HPEC)},
  year      = {2025},
  note      = {Outstanding Short Paper Award}
}`,
    lujan2025structure: `@inproceedings{lujan2025structure,
  title     = {When Structure is Silent: Opportunities for Algorithmic Dispatch in Linear Algebra},
  author    = {Lujan, Emmanuel and Edelman, Alan},
  booktitle = {IEEE High Performance Extreme Computing Conference (HPEC)},
  year      = {2025}
}`,
    lujan2025smartsolve: `@software{lujan2025smartsolve,
  title     = {SmartSolve.jl: AI for Algorithmic Discovery},
  author    = {Lujan, Emmanuel and Shah, Rushil N. and Alomairy, Rabab and Edelman, Alan},
  year      = {2025},
  version   = {v0.1.0-alpha},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.15784217},
  url       = {https://doi.org/10.5281/zenodo.15784217},
  note      = {Deprecated; superseded by SmartSolve Designer. Concept DOI: 10.5281/zenodo.15784216}
}`
  };

  function downloadBib(key) {
    const blob = new Blob([bibtex[key]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = key + '.bib';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadAllBib() {
    const all = Object.values(bibtex).join('\n\n');
    const blob = new Blob([all], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartsolve.bib';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Subtle scroll-reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });

  document.querySelectorAll('.section-head, .pipeline, .stage-wrap, .designer-actions, .pub, .talk-card, .ack-card, .product-block')
    .forEach(el => {
      el.classList.add('reveal');
      // Reveal whatever is already on the first screen so there's no blank gap on load;
      // observe the rest so they animate in as they're scrolled into view.
      if (el.getBoundingClientRect().top < window.innerHeight) {
        requestAnimationFrame(() => el.classList.add('in'));
      } else {
        io.observe(el);
      }
    });

  // SmartSolve Designer — one stage for every screenshot: each form step, the run, the result
  (function () {
    const wrap = document.querySelector('.stage-wrap');
    if (!wrap) return;

    const slides = Array.from(wrap.querySelectorAll('.stage img'));
    const ticks  = Array.from(wrap.querySelectorAll('.stage-tick'));
    const rail   = Array.from(wrap.querySelectorAll('.rail-btn'));
    const label  = wrap.querySelector('.cap-label');
    const quest  = wrap.querySelector('.cap-q');
    const open   = wrap.querySelector('.stage-open');
    const toggle = wrap.querySelector('.stage-toggle');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let i = 0, timer = null, hovered = false, onScreen = false, stopped = reduce;

    const dur = (n) => parseInt(slides[n].dataset.dur, 10) || 3800;

    function render() {
      slides.forEach((s, k) => {
        s.classList.toggle('is-on', k === i);
        if (k === i) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      rail.forEach((r, k) => {
        r.classList.toggle('is-active', k === i);
        if (k === i) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current');
      });
      ticks.forEach((t, k) => {
        t.classList.remove('is-active', 'is-done');
        if (k < i) t.classList.add('is-done');
      });
      const t = ticks[i];
      if (t) {
        t.style.setProperty('--slide-dur', dur(i) + 'ms');
        void t.offsetWidth;                 // restart the fill animation
        t.classList.add('is-active');
      }
      label.textContent = slides[i].dataset.label;
      quest.innerHTML   = slides[i].dataset.q;
      open.href         = slides[i].getAttribute('src');
    }

    function go(n, manual) {
      i = (n + slides.length) % slides.length;
      render();
      if (manual) play();
    }

    function play() {
      stop();
      if (stopped || hovered || !onScreen) return;
      wrap.classList.remove('is-paused');
      timer = setTimeout(() => go(i + 1), dur(i));   // each slide holds for its own duration
    }

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
      wrap.classList.add('is-paused');
    }

    toggle.addEventListener('click', () => {
      stopped = !stopped;
      wrap.classList.toggle('is-stopped', stopped);
      toggle.setAttribute('aria-label', stopped ? 'Play slideshow' : 'Pause slideshow');
      stopped ? stop() : play();
    });
    if (reduce) {                            // honour reduced motion: start parked on slide one
      wrap.classList.add('is-stopped');
      toggle.setAttribute('aria-label', 'Play slideshow');
    }

    wrap.addEventListener('mouseenter', () => { hovered = true;  stop(); });
    wrap.addEventListener('mouseleave', () => { hovered = false; play(); });
    wrap.addEventListener('focusin',    () => { hovered = true;  stop(); });
    wrap.addEventListener('focusout',   () => { hovered = false; play(); });

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
    });

    wrap.querySelector('.stage-prev').addEventListener('click', () => go(i - 1, true));
    wrap.querySelector('.stage-next').addEventListener('click', () => go(i + 1, true));
    ticks.forEach((t, k) => t.addEventListener('click', () => go(k, true)));
    rail.forEach((r, k) => r.addEventListener('click', () => go(k, true)));

    document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());

    new IntersectionObserver((entries) => {
      entries.forEach(e => { onScreen = e.isIntersecting; onScreen ? play() : stop(); });
    }, { threshold: 0.25 }).observe(wrap);

    render();
  })();

  // Inbound links from the single-page era point at anchors that now live on
  // other pages (e.g. /#publications). Forward them rather than landing people
  // on the home page with a hash that matches nothing.
  (function () {
    if (!/(^|\/)index\.html$|\/$/.test(location.pathname)) return;
    const moved = {
      methodology:      'methodology.html',
      publications:     'research.html#publications',
      talks:            'research.html#talks',
      software:         'software.html',
      team:             'team.html#team',
      acknowledgements: 'team.html#acknowledgements'
    };
    const target = moved[location.hash.slice(1)];
    if (target) location.replace(target);
  })();
