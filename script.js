/* =====================================================
   GIULIA & MATTEO · Wedding website
   Vanilla JS — no dependencies
   ===================================================== */

(function () {
  "use strict";

  /* ===== 1. Header sticky / scrolled ===== */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ===== 2. Mobile menu ===== */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const body = document.body;

  function closeMenu() {
    mainNav.classList.remove("open");
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    mainNav.classList.add("open");
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  navToggle.addEventListener("click", () => {
    if (mainNav.classList.contains("open")) closeMenu();
    else openMenu();
  });

  // Chiude il menu al click su un link
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeMenu)
  );

  /* ===== 3. Countdown ===== */
  // Data del matrimonio: 26 settembre 2026, ore 17:30 (Sicilia, CEST = UTC+2)
  const weddingDate = new Date("2026-09-26T17:30:00+02:00");

  const cdEls = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };

  function pad(n) { return String(n).padStart(2, "0"); }

  function updateCountdown() {
    const now = new Date();
    let diff = weddingDate - now;

    if (diff <= 0) {
      cdEls.days.textContent = "00";
      cdEls.hours.textContent = "00";
      cdEls.mins.textContent = "00";
      cdEls.secs.textContent = "00";
      const cd = document.getElementById("countdown");
      if (cd && !cd.querySelector(".cd-done")) {
        cd.innerHTML = '<div class="cd-done" style="background:transparent;border:none;padding:0;font-family:var(--font-display);font-size:1.4rem;">🎉 È il nostro giorno! 🎉</div>';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * 1000 * 60;
    const secs = Math.floor(diff / 1000);

    cdEls.days.textContent = pad(days);
    cdEls.hours.textContent = pad(hours);
    cdEls.mins.textContent = pad(mins);
    cdEls.secs.textContent = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===== 4. Copy IBAN ===== */
  const copyBtn = document.getElementById("copyIban");
  const ibanEl = document.getElementById("ibanNumber");

  if (copyBtn && ibanEl) {
    copyBtn.addEventListener("click", async () => {
      const text = ibanEl.textContent.trim().replace(/\s+/g, "");
      const originalLabel = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "✅ Copiato!";
      } catch {
        // fallback
        const t = document.createElement("textarea");
        t.value = text;
        document.body.appendChild(t);
        t.select();
        try { document.execCommand("copy"); copyBtn.textContent = "✅ Copiato!"; }
        catch { copyBtn.textContent = "Impossibile copiare"; }
        document.body.removeChild(t);
      }
      setTimeout(() => { copyBtn.textContent = originalLabel; }, 2200);
    });
  }

  /* ===== 5. Lightbox per la galleria ===== */
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImage");
  const lbCounter = document.getElementById("lightboxCounter");
  const lbClose = lightbox.querySelector(".lightbox-close");
  const lbPrev = lightbox.querySelector(".lightbox-prev");
  const lbNext = lightbox.querySelector(".lightbox-next");

  const items = Array.from(gallery.querySelectorAll(".gallery-item"));
  let currentIdx = 0;

  function showLightbox(idx) {
    currentIdx = (idx + items.length) % items.length;
    lbImg.src = items[currentIdx].getAttribute("href");
    lbCounter.textContent = `${currentIdx + 1} / ${items.length}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
    lbImg.src = "";
  }

  items.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      showLightbox(i);
    });
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", (e) => { e.stopPropagation(); showLightbox(currentIdx - 1); });
  lbNext.addEventListener("click", (e) => { e.stopPropagation(); showLightbox(currentIdx + 1); });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showLightbox(currentIdx - 1);
    else if (e.key === "ArrowRight") showLightbox(currentIdx + 1);
  });

  // Swipe su mobile
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) showLightbox(currentIdx + 1);
      else showLightbox(currentIdx - 1);
    }
  }, { passive: true });

  /* ===== 6. RSVP form (Formspree AJAX) ===== */
  const form = document.getElementById("rsvpForm");
  const feedback = document.getElementById("formFeedback");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Se l'endpoint Formspree non è stato configurato, mostra un avviso
      if (form.action.includes("YOUR_FORM_ID")) {
        feedback.className = "form-feedback error";
        feedback.textContent =
          "⚠️ Il form non è ancora configurato. Vedi il file README per attivare Formspree.";
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Invio in corso…";
      feedback.className = "form-feedback";
      feedback.textContent = "";

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          feedback.className = "form-feedback success";
          feedback.textContent =
            "💕 Grazie! La tua conferma è arrivata. Non vediamo l'ora di vederti!";
        } else {
          throw new Error("Errore server");
        }
      } catch (err) {
        feedback.className = "form-feedback error";
        feedback.textContent =
          "Ops, qualcosa è andato storto. Riprova o scrivici via email.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* ===== 7. Save the Date (Google Calendar + .ics) ===== */
  const saveDateBtn = document.getElementById("saveDateBtn");
  const calModal = document.getElementById("calModal");
  const calModalClose = document.getElementById("calModalClose");
  const calGoogle = document.getElementById("calGoogle");
  const calIcs = document.getElementById("calIcs");

  // Dettagli evento
  const EVENT = {
    title: "Matrimonio Giulia & Matteo",
    description:
      "Ci sposiamo! Vi aspettiamo al Castello di Donnafugata alle 17:30 per la cerimonia, poi cena alla Locanda Gulfi.",
    location: "Castello di Donnafugata, SP60, 97100 Donnafugata RG, Italia",
    // 26 settembre 2026, 17:30 → 23:59 (locale Italia, CEST = UTC+2)
    startUTC: "20260926T153000Z", // 17:30 CEST = 15:30 UTC
    endUTC:   "20260926T215900Z", // 23:59 CEST = 21:59 UTC
  };

  function buildGoogleCalendarUrl() {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: EVENT.title,
      dates: `${EVENT.startUTC}/${EVENT.endUTC}`,
      details: EVENT.description,
      location: EVENT.location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function buildIcsBlobUrl() {
    const now = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Giulia&Matteo//Matrimonio//IT",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:matrimonio-giulia-matteo-${EVENT.startUTC}@giuliaematteo`,
      `DTSTAMP:${now}`,
      `DTSTART:${EVENT.startUTC}`,
      `DTEND:${EVENT.endUTC}`,
      `SUMMARY:${EVENT.title}`,
      `DESCRIPTION:${EVENT.description.replace(/\n/g, "\\n")}`,
      `LOCATION:${EVENT.location.replace(/,/g, "\\,")}`,
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Manca una settimana al matrimonio di Giulia & Matteo!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    return URL.createObjectURL(blob);
  }

  function openCalModal() {
    if (calGoogle) calGoogle.href = buildGoogleCalendarUrl();
    if (calIcs) calIcs.href = buildIcsBlobUrl();
    calModal.classList.add("open");
    calModal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  }
  function closeCalModal() {
    calModal.classList.remove("open");
    calModal.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  }

  if (saveDateBtn) saveDateBtn.addEventListener("click", openCalModal);
  if (calModalClose) calModalClose.addEventListener("click", closeCalModal);
  if (calModal) {
    calModal.addEventListener("click", (e) => {
      if (e.target === calModal) closeCalModal();
    });
  }
  // Chiude dopo aver cliccato su una delle opzioni
  if (calGoogle) calGoogle.addEventListener("click", () => setTimeout(closeCalModal, 200));
  if (calIcs) calIcs.addEventListener("click", () => setTimeout(closeCalModal, 200));

  document.addEventListener("keydown", (e) => {
    if (calModal.classList.contains("open") && e.key === "Escape") closeCalModal();
  });

  /* ===== 8. Reveal on scroll (animazione leggera) ===== */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll(".section-title, .timeline-item, .location-card, .iban-card, .storia-text, .storia-image")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        observer.observe(el);
      });

    // Stile per .revealed
    const style = document.createElement("style");
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
  }
})();
