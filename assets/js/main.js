/* =====================================================================
   VESPER · main.js
   Site interactions: nav, reveals, portfolio filter, lightbox, booking.
   ===================================================================== */

(function () {
  'use strict';

  /* ---------- sticky nav state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navDrawer = document.querySelector('.nav__drawer');
  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const open = navDrawer.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navDrawer.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------- portfolio filter ---------- */
  const pills = document.querySelectorAll('.filter-pill');
  const frames = document.querySelectorAll('[data-cat]');
  if (pills.length && frames.length) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        const cat = pill.dataset.filter;
        frames.forEach(f => {
          const match = cat === 'all' || f.dataset.cat.split(' ').includes(cat);
          f.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('img');
  const lightboxClose = lightbox && lightbox.querySelector('.lightbox__close');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.frame img').forEach(img => {
      img.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        const src = img.src.replace('/thumb/', '/full/');
        lightboxImg.src = src;
        lightboxImg.alt = img.alt || '';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ---------- contact form stub ---------- */
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = contactForm.querySelector('[data-form-status]');
      if (status) {
        status.textContent = 'Thank you. I will be in touch within 24 hours.';
        status.style.color = 'var(--copper)';
      }
      contactForm.reset();
    });
  }

  /* ---------- booking flow ---------- */
  initBooking();

  function initBooking() {
    const root = document.querySelector('[data-booking]');
    if (!root) return;

    const state = {
      step: 1,
      session: null,
      sessionTitle: null,
      date: null,
      time: null,
      details: {},
      calMonth: null
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    state.calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 4, 1);

    /* ---- step navigation ---- */
    const setStep = (n) => {
      state.step = n;
      root.querySelectorAll('.book-panel').forEach((p, i) => {
        p.classList.toggle('is-active', i + 1 === n);
      });
      root.querySelectorAll('.book-progress__step').forEach((s, i) => {
        s.classList.remove('is-active', 'is-done');
        if (i + 1 < n) s.classList.add('is-done');
        else if (i + 1 === n) s.classList.add('is-active');
      });
      window.scrollTo({ top: root.offsetTop - 80, behavior: 'smooth' });
    };

    /* ---- session selection ---- */
    const sessionCards = root.querySelectorAll('[data-session]');
    sessionCards.forEach(card => {
      card.addEventListener('click', () => {
        sessionCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        state.session = card.dataset.session;
        state.sessionTitle = card.querySelector('.session-card__title').textContent;
        updateSummary();
        setTimeout(() => setStep(2), 480);
      });
    });

    /* ---- calendar render ---- */
    const calGrid = root.querySelector('[data-calendar-grid]');
    const calTitle = root.querySelector('[data-calendar-title]');
    const calPrev = root.querySelector('[data-cal-prev]');
    const calNext = root.querySelector('[data-cal-next]');

    function renderCalendar() {
      const y = state.calMonth.getFullYear();
      const m = state.calMonth.getMonth();
      const monthName = state.calMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (calTitle) calTitle.textContent = monthName;
      if (calPrev) calPrev.disabled = state.calMonth <= minMonth;
      if (calNext) calNext.disabled = state.calMonth >= maxMonth;

      const firstDay = new Date(y, m, 1).getDay();
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const daysInPrev = new Date(y, m, 0).getDate();
      const cells = [];

      // leading empties from previous month
      for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({ d: daysInPrev - i, other: true });
      }
      for (let d = 1; d <= daysInMonth; d++) cells.push({ d, other: false });
      while (cells.length < 42) cells.push({ d: cells.length - daysInMonth - firstDay + 1, other: true });

      calGrid.innerHTML = '';
      cells.forEach(cell => {
        const btn = document.createElement('button');
        btn.className = 'calendar__day';
        btn.type = 'button';
        btn.textContent = cell.d;
        if (cell.other) {
          btn.classList.add('is-other');
          btn.disabled = true;
        } else {
          const date = new Date(y, m, cell.d);
          date.setHours(0, 0, 0, 0);
          const dow = date.getDay();
          // disable past
          if (date < today) { btn.disabled = true; btn.classList.add('is-other'); }
          // disable Sundays
          if (dow === 0) { btn.disabled = true; }
          // mark today
          if (date.getTime() === today.getTime()) btn.classList.add('is-today');
          // mock booked dates (deterministic seed: certain weekday + day combinations)
          const seed = (date.getTime() / 86400000) % 23;
          if (!btn.disabled && (dow === 1 || dow === 5) && seed % 13 < 3) {
            btn.classList.add('is-booked');
            btn.disabled = true;
          }
          // selected state
          if (state.date && date.toDateString() === state.date.toDateString()) {
            btn.classList.add('is-selected');
          }
          btn.addEventListener('click', () => {
            state.date = date;
            state.time = null;
            renderCalendar();
            renderTimeSlots();
            updateSummary();
          });
        }
        calGrid.appendChild(btn);
      });
    }

    calPrev && calPrev.addEventListener('click', () => {
      if (state.calMonth > minMonth) {
        state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
        renderCalendar();
      }
    });
    calNext && calNext.addEventListener('click', () => {
      if (state.calMonth < maxMonth) {
        state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
        renderCalendar();
      }
    });

    /* ---- time slots ---- */
    const timePanel = root.querySelector('[data-time-panel]');
    const timeSlots = root.querySelector('[data-time-slots]');
    const timeEmpty = root.querySelector('[data-time-empty]');
    const timeDate = root.querySelector('[data-time-date]');

    function renderTimeSlots() {
      if (!state.date) {
        if (timeEmpty) timeEmpty.style.display = '';
        if (timeSlots) timeSlots.style.display = 'none';
        if (timeDate) timeDate.textContent = '';
        return;
      }
      if (timeEmpty) timeEmpty.style.display = 'none';
      if (timeSlots) timeSlots.style.display = '';
      if (timeDate) {
        timeDate.textContent = state.date.toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric'
        });
      }
      // Generate 5 time slots with deterministic availability
      const slots = ['9:00 AM', '11:00 AM', '1:30 PM', '3:30 PM', '5:00 PM'];
      const seed = state.date.getDate() + state.date.getMonth();
      const labels = ['Open', 'Open', 'Few left', 'Open', 'Open'];
      labels[seed % 5] = 'Few left';
      labels[(seed + 2) % 5] = 'Open';
      timeSlots.innerHTML = '';
      slots.forEach((slot, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot';
        if (state.time === slot) btn.classList.add('is-selected');
        const avail = labels[i];
        const availCls = avail === 'Few left' ? 'avail--few' : 'avail--open';
        btn.innerHTML = `
          <span class="time-slot__time">${slot}</span>
          <span class="time-slot__avail ${availCls}">${avail}</span>
        `;
        btn.addEventListener('click', () => {
          state.time = slot;
          renderTimeSlots();
          updateSummary();
        });
        timeSlots.appendChild(btn);
      });
    }

    /* ---- summary ---- */
    function updateSummary() {
      root.querySelectorAll('[data-summary]').forEach(panel => {
        const fields = {
          session: state.sessionTitle || '',
          date: state.date ? state.date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
          }) : '',
          time: state.time || '',
          name: state.details.name || '',
          email: state.details.email || '',
          phone: state.details.phone || '',
          location: state.details.location || ''
        };
        Object.entries(fields).forEach(([key, val]) => {
          const el = panel.querySelector(`[data-field="${key}"]`);
          if (el) el.textContent = val;
        });
      });
    }

    /* ---- step nav buttons ---- */
    root.querySelectorAll('[data-step-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.dataset.stepNext, 10);
        // validation
        if (target === 3 && (!state.date || !state.time)) {
          alert('Please choose a date and a time.');
          return;
        }
        if (target === 4) {
          // gather details from form
          const form = root.querySelector('[data-details-form]');
          if (form && !form.reportValidity()) return;
          const fd = new FormData(form);
          state.details = {
            name: fd.get('name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            location: fd.get('location'),
            notes: fd.get('notes')
          };
          updateSummary();
          // populate confirm card
          const conf = root.querySelector('[data-confirm]');
          if (conf) {
            conf.querySelector('[data-conf-session]').textContent = state.sessionTitle;
            conf.querySelector('[data-conf-date]').textContent = state.date.toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
            conf.querySelector('[data-conf-time]').textContent = state.time;
            conf.querySelector('[data-conf-name]').textContent = state.details.name;
            conf.querySelector('[data-conf-email]').textContent = state.details.email;
            // generate fake reservation number
            const ref = 'AP-' + Math.random().toString(36).slice(2, 7).toUpperCase();
            const refEl = conf.querySelector('[data-conf-ref]');
            if (refEl) refEl.textContent = ref;
          }
        }
        setStep(target);
      });
    });
    root.querySelectorAll('[data-step-back]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.dataset.stepBack, 10);
        setStep(target);
      });
    });

    /* ---- form live binding to summary ---- */
    const detailsForm = root.querySelector('[data-details-form]');
    if (detailsForm) {
      detailsForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
          state.details[input.name] = input.value;
          updateSummary();
        });
      });
    }

    // initial paint
    renderCalendar();
    renderTimeSlots();
    updateSummary();
  }
})();
