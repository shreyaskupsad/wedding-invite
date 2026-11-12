(() => {
  const data = window.wedding;
  const $ = (selector, root = document) => root.querySelector(selector);
  const set = (selector, value) => { const node = $(selector); if (node && value != null) node.textContent = value; };
  const safeDate = (value) => { const date = value ? new Date(value) : null; return date && Number.isFinite(date.getTime()) ? date : null; };

  const shareTitle = `${data.groom.name} & ${data.bride.name} — A New Year’s Day Wedding`;
  const shareDescription = `On New Year’s Day, ${data.groom.name} and ${data.bride.name} begin their next chapter in ${data.city}.`;
  document.title = shareTitle;
  [
    ['meta[name="description"]', shareDescription],
    ['meta[property="og:title"]', shareTitle],
    ['meta[property="og:description"]', shareDescription],
    ['meta[name="twitter:title"]', shareTitle],
    ['meta[name="twitter:description"]', shareDescription]
  ].forEach(([selector, value]) => {
    const node = $(selector);
    if (node) node.setAttribute("content", value);
  });
  set("#openingGroom", data.groom.name); set("#openingBride", data.bride.name);
  set("#navInitials", `${data.initials.groom} · ${data.initials.bride}`);
  set("#groomName", data.groom.name); set("#brideName", data.bride.name);
  set("#heroDate", `${data.date} · ${data.city}`); set("#venueTitle", data.venue.name);
  set("#venueCity", data.city); set("#venueMapCity", `${data.city.toUpperCase()} · INDIA`); set("#venueAddress", data.venue.address);
  const venueEvent = data.events.find((event) => event.name === data.venue.highlightEvent);
  const venueHighlight = $("#venueHighlight");
  if (venueEvent) venueHighlight.textContent = `${venueEvent.name.toUpperCase()} · ${venueEvent.time}`;
  else venueHighlight.hidden = true;
  set("#groomFamily", data.groom.family); set("#brideFamily", data.bride.family);
  set("#finalGroom", data.groom.name); set("#finalBride", data.bride.name);
  set("#finalDate", data.date); set("#hashtag", data.hashtag);
  set("#countdownDate", data.date);

  const opening = $("#opening");
  const audio = $("#weddingAudio");
  audio.src = data.song.src;
  let soundWanted = true;
  let heroVideo = null;
  if (data.heroVideo) {
    heroVideo = document.createElement("video"); heroVideo.className = "hero-video"; heroVideo.src = data.heroVideo;
    heroVideo.muted = true; heroVideo.loop = true; heroVideo.playsInline = true; heroVideo.preload = "none"; heroVideo.setAttribute("aria-hidden", "true");
    heroVideo.addEventListener("loadeddata", () => $(".hero-art").classList.add("has-video"), { once: true });
    heroVideo.addEventListener("error", () => heroVideo.remove(), { once: true });
    $(".hero-art").prepend(heroVideo);
  }
  function reflectAudio() {
    const playing = !audio.paused;
    $("#soundControl").classList.toggle("playing", playing);
    $("#soundLabel").textContent = playing ? "Pause song" : "Play song";
    $("#soundControl").setAttribute("aria-label", playing ? `Pause ${data.song.title}` : `Play ${data.song.title}`);
  }
  audio.addEventListener("play", reflectAudio); audio.addEventListener("pause", reflectAudio);
  audio.addEventListener("error", () => { set("#soundLabel", "Song not added"); $("#soundControl").setAttribute("aria-label", "Wedding song file not found"); });
  async function startMusic() {
    if (!soundWanted || !data.song.src) return;
    try { await audio.play(); } catch { set("#soundLabel", "Play song"); }
  }
  $("#enterButton").addEventListener("click", () => {
    opening.classList.add("is-gone"); document.body.classList.add("entered");
    window.setTimeout(() => $(".hero").classList.add("hero-settled"), 500);
    window.setTimeout(() => { opening.hidden = true; }, 1300);
    startMusic();
    if (heroVideo) heroVideo.play().catch(() => {});
  });
  const heroArch = $(".hero-arch");
  const heroSection = $(".hero");
  let photoHoldTimer;
  function clearPhotoHighlight() {
    window.clearTimeout(photoHoldTimer);
    heroArch.classList.remove("photo-held");
    heroSection.classList.remove("photo-held");
  }
  heroArch.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    window.clearTimeout(photoHoldTimer);
    photoHoldTimer = window.setTimeout(() => {
      heroArch.classList.add("photo-held");
      heroSection.classList.add("photo-held");
    }, 260);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => heroArch.addEventListener(type, clearPhotoHighlight));
  window.addEventListener("pointerup", clearPhotoHighlight);
  window.addEventListener("pointercancel", clearPhotoHighlight);

  requestAnimationFrame(() => opening.classList.add("ready"));
  $("#soundControl").addEventListener("click", () => {
    soundWanted = true;
    if (audio.paused) startMusic(); else audio.pause();
  });

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.13 });
  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
  const header = $("#siteHeader");
  const headerObserver = new IntersectionObserver(([entry]) => header.classList.toggle("is-visible", !entry.isIntersecting), { threshold: 0.02 });
  headerObserver.observe($("#home"));

  const storyPath = $("#storyPath");
  data.story.forEach((item, index) => {
    const article = document.createElement("article"); article.className = "memory";
    if (item.image) { const image = document.createElement("img"); image.className = "memory-photo"; image.src = item.image; image.alt = `${item.title} — a couple's memory`; image.loading = "lazy"; article.append(image); }
    const date = document.createElement("time"); date.textContent = item.date;
    const title = document.createElement("h3"); title.textContent = item.title;
    const desc = document.createElement("p"); desc.textContent = item.description;
    article.append(date, title, desc); storyPath.append(article);
  });

  const eventSelector = $("#eventSelector"), eventDetail = $("#eventDetail");
  function renderEvent(index) {
    const event = data.events[index];
    eventSelector.querySelectorAll("button").forEach((tab, i) => { tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    eventDetail.style.setProperty("--event-glow", event.tone || "#b88f56");
    eventDetail.replaceChildren();
    const ix = document.createElement("span"); ix.className = "event-index"; ix.textContent = `CHAPTER ${String(index + 1).padStart(2, "0")} / ${String(data.events.length).padStart(2, "0")}`;
    const title = document.createElement("h3"); title.textContent = event.name;
    const description = document.createElement("p"); description.className = "event-description"; description.textContent = event.description;
    const facts = document.createElement("div"); facts.className = "event-facts";
    [["DATE", event.date], ["TIME", event.time], ["VENUE", event.venue], ["DRESS", event.dressCode]].forEach(([label, value]) => {
      const fact = document.createElement("div"); fact.className = "event-fact";
      const small = document.createElement("small"); small.textContent = label;
      const span = document.createElement("span"); span.textContent = value;
      fact.append(small, span); facts.append(fact);
    });
    if (event.muhurtham) { const fact = document.createElement("div"); fact.className = "event-fact"; const small = document.createElement("small"); small.textContent = "MUHURTHAM"; const span = document.createElement("span"); span.textContent = event.muhurtham; fact.append(small, span); facts.append(fact); }
    const actions = document.createElement("div"); actions.className = "event-actions";
    if (event.mapsUrl) { const maps = document.createElement("a"); maps.href = event.mapsUrl; maps.target = "_blank"; maps.rel = "noreferrer"; maps.textContent = "MAP & DIRECTIONS ↗"; actions.append(maps); }
    if (safeDate(event.dateTime)) { const cal = document.createElement("button"); cal.type = "button"; cal.textContent = "ADD TO CALENDAR +"; cal.addEventListener("click", () => downloadCalendar(event.name, event.dateTime, event.description, event.venue)); actions.append(cal); }
    eventDetail.append(ix, title, description, facts, actions);
  }
  data.events.forEach((event, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "event-tab"; button.setAttribute("role", "tab"); button.setAttribute("aria-selected", String(index === 0)); button.tabIndex = index === 0 ? 0 : -1;
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("span"); name.textContent = event.name;
    button.append(number, name); button.addEventListener("click", () => renderEvent(index));
    button.addEventListener("keydown", (e) => { if (["ArrowRight", "ArrowLeft"].includes(e.key)) { e.preventDefault(); const next = (index + (e.key === "ArrowRight" ? 1 : data.events.length - 1)) % data.events.length; eventSelector.children[next].focus(); renderEvent(next); } });
    eventSelector.append(button);
  });
  if (data.events.length) renderEvent(0);

  function downloadCalendar(title, iso, description, location) {
    const start = safeDate(iso); if (!start) return;
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const escape = (text) => String(text || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT", `UID:${Date.now()}@wedding-invitation`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${escape(title)}`, `DESCRIPTION:${escape(description)}`, `LOCATION:${escape(location)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`; link.click(); URL.revokeObjectURL(url);
  }
  const maps = $("#directionsLink");
  if (data.venue.mapsUrl) maps.href = data.venue.mapsUrl; else { maps.removeAttribute("href"); maps.setAttribute("aria-disabled", "true"); maps.addEventListener("click", (e) => e.preventDefault()); }
  $("#calendarButton").addEventListener("click", () => {
    if (safeDate(data.dateTime)) downloadCalendar(`${data.groom.name} & ${data.bride.name} — Wedding`, data.dateTime, "Wedding celebration", data.venue.name);
    else { $("#calendarButton").textContent = "ADD THE WEDDING DATE IN wedding.js"; }
  });

  const countdown = $("#countdown");
  function updateCountdown() {
    const target = safeDate(data.dateTime);
    if (!target) { $("#countdownFoot").textContent = "Add the wedding date and time in wedding.js to start the countdown."; return; }
    const remaining = Math.max(0, target.getTime() - Date.now());
    const days = Math.floor(remaining / 86400000), hours = Math.floor(remaining / 3600000) % 24, minutes = Math.floor(remaining / 60000) % 60, seconds = Math.floor(remaining / 1000) % 60;
    [days, hours, minutes, seconds].forEach((n, i) => { const value = countdown.children[i * 2].querySelector("strong"); value.textContent = String(n).padStart(i === 0 ? 1 : 2, "0"); });
    if (remaining === 0) $("#countdownFoot").textContent = "Today, our families gather.";
  }
  updateCountdown(); window.setInterval(updateCountdown, 1000);

  // Send both forms to the configured private Google Sheet through Apps Script.
  async function submitToSheet(payload, statusNode, submitButton, successMessage) {
    if (!data.formEndpoint) {
      statusNode.textContent = "The response service is not configured yet. Your message was not sent.";
      return false;
    }

    submitButton.disabled = true;
    statusNode.textContent = "Sending securely…";
    try {
      const response = await fetch(data.formEndpoint, {
        method: "POST",
        body: new URLSearchParams(payload)
      });
      if (!response.ok) throw new Error("The response service could not be reached.");
      const result = await response.json();
      if (!result.ok) throw new Error(result.message || "The response could not be saved.");
      statusNode.textContent = successMessage;
      return true;
    } catch (error) {
      statusNode.textContent = `${error.message || "Something went wrong."} Please try again, or contact the couple directly.`;
      return false;
    } finally {
      submitButton.disabled = false;
    }
  }

  const rsvpForm = $("#rsvpForm");
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!rsvpForm.reportValidity()) return;
    const fields = new FormData(rsvpForm);
    const saved = await submitToSheet({
      type: "rsvp",
      name: fields.get("name"),
      attending: fields.get("attending"),
      guests: fields.get("guests"),
      message: fields.get("message")
    }, $("#rsvpStatus"), rsvpForm.querySelector("button[type=submit]"), "Thank you — your RSVP has been sent to us.");
    if (saved) rsvpForm.reset();
  });

  const wishForm = $("#wishForm"), wishInput = $("#wishMessage"), wishName = $("#wishName");
  wishInput.addEventListener("input", () => { $("#wishCount").textContent = `${wishInput.value.length} / 240`; });
  wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!wishForm.reportValidity()) return;
    const saved = await submitToSheet({
      type: "wish",
      name: wishName.value,
      wish: wishInput.value
    }, $("#wishStatus"), wishForm.querySelector("button[type=submit]"), "Thank you — your wish has been sent to us privately.");
    if (saved) {
      wishForm.reset();
      $("#wishCount").textContent = "0 / 240";
    }
  });
})();
