(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;
  const APP_VERSION = "v177-species-catch-detail-nyan-motion";
  const PET_NAME = "爆釣にゃん師匠";
  const PET_MOTION_NAMES = ["idle", "kiriri", "wink", "happy", "surprise", "think", "angry", "sleepy", "doya", "guide", "smile", "sad", "dreamy", "focus", "side", "back"];
  const PET_MOTION_IMAGES = PET_MOTION_NAMES.map((name) => `assets/nyan-motion-${name}-v177.png?v=${APP_VERSION}`);
  const PET_IMAGE_SRC = PET_MOTION_IMAGES[0];
  const PET_IMAGE_FALLBACK_SRC = PET_MOTION_IMAGES[0];
  const PET_BUBBLE_IMAGE_SRC = `assets/turi-nyan-speech-bubble-comic-transparent-v176.png?v=${APP_VERSION}`;

  function patchText(value) {
    if (typeof value !== "string") return value;
    return value
      .replaceAll("爆調ニャンコ視聴", PET_NAME)
      .replaceAll("爆調ツインニャンコ", "爆釣ツインニャンコ")
      .replaceAll("v156-menu-bg-map-fix", APP_VERSION)
      .replaceAll("v163-menu-points-fix", APP_VERSION)
      .replaceAll("v172-spot-checklist-restore", APP_VERSION)
      .replaceAll("v173-motion-nyan-sensei", APP_VERSION)
      .replaceAll("v176-spot-species-picker-fix", APP_VERSION);
  }

  function patchNode(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const next = patchText(node.nodeValue || "");
        if (next !== node.nodeValue) node.nodeValue = next;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.attributes) {
        for (const attr of Array.from(node.attributes)) {
          const next = patchText(attr.value || "");
          if (next !== attr.value) node.setAttribute(attr.name, next);
        }
      }
      node = walker.nextNode();
    }
  }

  function injectPetStyles() {
    if (document.getElementById("turiNyanPetStyles")) return;
    const style = document.createElement("style");
    style.id = "turiNyanPetStyles";
    style.textContent = `
      :root { --turi-nyan-bubble-image: url("${PET_BUBBLE_IMAGE_SRC}"); }
      #turiNyanPet { position: fixed; right: calc(10px + env(safe-area-inset-right)); bottom: calc(78px + env(safe-area-inset-bottom)); z-index: 2147483200; display: grid; justify-items: end; pointer-events: none; }
      #turiNyanPet .pet-bubble { display: none; width: min(284px, calc(100vw - 14px)); aspect-ratio: 1 / 1; padding: 72px 64px 82px 56px; box-sizing: border-box; background-color: transparent !important; background-image: var(--turi-nyan-bubble-image) !important; background-repeat: no-repeat !important; background-size: 100% 100% !important; background-position: center !important; border: 0 !important; box-shadow: none !important; color: #17120d; font-size: .50rem; font-weight: 900; line-height: 1.08; pointer-events: auto; overflow: hidden; }
      #turiNyanPet.is-speaking .pet-bubble { display: block; }
      #turiNyanPet .pet-bubble strong { display: block; color: #8d321d; font-size: .56rem; line-height: 1.04; margin-bottom: 2px; white-space: nowrap; }
      #turiNyanPet #turiNyanMessage { display: block; max-height: 2.25em; overflow: hidden; overflow-wrap: anywhere; }
      #turiNyanPet .pet-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; margin-top: 4px; }
      #turiNyanPet .pet-actions button { min-height: 19px; padding: 2px 4px; border-radius: 999px; font-size: .46rem; font-weight: 900; pointer-events: auto; }
      #turiNyanPet .pet-button { width: 124px; height: 124px; padding: 0; border: 0; border-radius: 999px; background: transparent; pointer-events: auto; filter: drop-shadow(0 10px 18px rgba(0,0,0,.20)); }
      #turiNyanPet .pet-button img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.10); transform-origin: center bottom; transition: opacity .12s ease, transform .18s ease; animation: turiNyanFloat 1.9s ease-in-out infinite; will-change: transform, opacity; }
      #turiNyanPet.is-motioning .pet-button img { transform: scale(1.18) translateY(-4px) rotate(-2deg); }
      #turiNyanPet.is-speaking .pet-button img { animation-duration: 2.2s; }
      @keyframes turiNyanFloat {
        0%, 100% { transform: scale(1.10) translateY(0) rotate(0deg); }
        35% { transform: scale(1.13) translateY(-5px) rotate(-1deg); }
        70% { transform: scale(1.11) translateY(-1px) rotate(1deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        #turiNyanPet .pet-button img { animation: none !important; transition: none !important; }
      }
      body.menu-open #turiNyanPet, body.panel-open #turiNyanPet, body.position-adjusting #turiNyanPet, body.map-popup-open #turiNyanPet, body.record-popup-open #turiNyanPet, body.spot-card-open #turiNyanPet { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  function preloadMotionImages() {
    PET_MOTION_IMAGES.forEach((src) => {
      try { const img = new Image(); img.src = src; } catch (error) {}
    });
  }

  function installPet() {
    if (document.getElementById("turiNyanPet")) return;
    preloadMotionImages();
    const pet = document.createElement("aside");
    pet.id = "turiNyanPet";
    pet.innerHTML = `<div class="pet-bubble"><strong>${PET_NAME}</strong><span id="turiNyanMessage">魚種をボタンで選べるにゃ。</span><div class="pet-actions"><button type="button" data-pet-close>閉じる</button><button type="button" data-pet-map>地図</button></div></div><button class="pet-button" type="button" aria-label="${PET_NAME}"><img id="turiNyanPetImage" src="${PET_IMAGE_SRC}" alt="${PET_NAME}" data-motion-animated="0"></button>`;
    document.body.appendChild(pet);

    const petButton = pet.querySelector(".pet-button");
    const petImage = pet.querySelector("#turiNyanPetImage");
    const messageEl = pet.querySelector("#turiNyanMessage");
    let motionIndex = 0;
    let motionTimer = null;
    let hideSpeechTimer = null;
    let lastManualMotionAt = 0;
    petImage?.addEventListener("error", () => {
      petImage.dataset.motionAnimated = "0";
      if (petImage.getAttribute("src") !== PET_IMAGE_FALLBACK_SRC) petImage.src = PET_IMAGE_FALLBACK_SRC;
    }, { once: true });

    const setMotionFrame = (index, lively = true) => {
      if (!petImage) return;
      motionIndex = ((index % PET_MOTION_IMAGES.length) + PET_MOTION_IMAGES.length) % PET_MOTION_IMAGES.length;
      const nextSrc = PET_MOTION_IMAGES[motionIndex];
      if (petImage.dataset.motionAnimated !== "1" && petImage.getAttribute("src") !== nextSrc) petImage.setAttribute("src", nextSrc);
      if (lively) {
        pet.classList.add("is-motioning");
        window.setTimeout(() => pet.classList.remove("is-motioning"), 360);
      }
    };

    window.__MIE_NYAN_MOTION__ = (motionName = "idle", message = "", autoHideMs = 4200) => {
      const index = PET_MOTION_NAMES.indexOf(String(motionName || "idle"));
      setMotionFrame(index >= 0 ? index : 0, true);
      if (messageEl && message) messageEl.textContent = message;
      if (message) {
        pet.classList.add("is-speaking");
        if (hideSpeechTimer) window.clearTimeout(hideSpeechTimer);
        hideSpeechTimer = window.setTimeout(() => pet.classList.remove("is-speaking"), Math.max(Number(autoHideMs) || 4200, 1200));
      }
    };

    const advanceMotion = (manual = false) => {
      if (document.hidden && !manual) return;
      setMotionFrame(motionIndex + 1, true);
    };

    motionTimer = window.setInterval(() => advanceMotion(false), 900);
    window.addEventListener("pagehide", () => { if (motionTimer) window.clearInterval(motionTimer); }, { once: true });

    petButton?.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastManualMotionAt > 260) {
        lastManualMotionAt = now;
        advanceMotion(true);
      }
      pet.classList.toggle("is-speaking");
    });
    petButton?.addEventListener("pointerenter", () => advanceMotion(true));
    pet.querySelector("[data-pet-close]")?.addEventListener("click", () => pet.classList.remove("is-speaking"));

    // v170: 吹き出し内の「地図」ボタンを、タップ/クリックどちらでも確実に地図画面へ戻す。
    const mapButton = pet.querySelector("[data-pet-map]");
    let lastMapButtonAt = 0;
    const openMapFromPet = (event) => {
      try { event?.preventDefault?.(); } catch (error) {}
      try { event?.stopPropagation?.(); } catch (error) {}
      const now = Date.now();
      if (now - lastMapButtonAt < 280) return;
      lastMapButtonAt = now;

      let handled = false;
      try {
        if (typeof window.__MIE_OPEN_MAP_VIEW__ === "function") {
          handled = window.__MIE_OPEN_MAP_VIEW__("pet-map-button") === true;
        }
      } catch (error) {}

      if (!handled) {
        const screen = document.getElementById("appStartScreen");
        if (screen) {
          screen.classList.add("is-hidden", "is-closing");
          screen.setAttribute("aria-hidden", "true");
          screen.style.setProperty("display", "none", "important");
          screen.style.setProperty("pointer-events", "none", "important");
        }
        document.getElementById("mobileMenu")?.classList.remove("is-open");
        document.getElementById("menuBackdrop")?.classList.remove("is-open");
        document.getElementById("menuToggle")?.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".catch-panel").forEach((panel) => {
          panel.classList.remove("is-open");
          panel.classList.add("is-hidden");
          panel.setAttribute("aria-hidden", "true");
          panel.style.removeProperty("display");
        });
        document.body.classList.remove("start-screen-active", "start-screen-launching", "menu-open", "panel-open", "position-adjusting", "map-popup-open", "record-popup-open", "spot-card-open");
        document.body.classList.add("start-screen-done");
        [40, 120, 300, 700].forEach((ms) => window.setTimeout(() => {
          try { window.dispatchEvent(new Event("resize")); } catch (error) {}
        }, ms));
      }
      pet.classList.remove("is-speaking");
      setMotionFrame(3, true);
    };
    mapButton?.addEventListener("click", openMapFromPet, { capture: true });
    mapButton?.addEventListener("pointerup", openMapFromPet, { capture: true });
    mapButton?.addEventListener("touchend", openMapFromPet, { passive: false, capture: true });
  }

  function init() {
    injectPetStyles();
    patchNode(document.body);
    try { new MutationObserver(() => patchNode(document.body)).observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (error) {}
    installPet();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
