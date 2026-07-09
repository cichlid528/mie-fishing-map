(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;
  const APP_VERSION = "v169-photo-camera-fix";
  const PET_NAME = "爆釣にゃん師匠";
  const PET_IMAGE_SRC = `assets/turi-nyan-pose-front-v149.png?v=${APP_VERSION}`;
  const PET_BUBBLE_IMAGE_SRC = `assets/turi-nyan-speech-bubble-comic-transparent-v169.png?v=${APP_VERSION}`;

  function patchText(value) {
    if (typeof value !== "string") return value;
    return value
      .replaceAll("爆調ニャンコ視聴", PET_NAME)
      .replaceAll("爆調ツインニャンコ", "爆釣ツインニャンコ")
      .replaceAll("v156-menu-bg-map-fix", APP_VERSION)
      .replaceAll("v163-menu-points-fix", APP_VERSION);
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
      #turiNyanPet .pet-button { width: 118px; height: 118px; padding: 0; border: 0; border-radius: 999px; background: transparent; pointer-events: auto; }
      #turiNyanPet .pet-button img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.12); transform-origin: center bottom; }
      body.menu-open #turiNyanPet, body.panel-open #turiNyanPet, body.position-adjusting #turiNyanPet, body.map-popup-open #turiNyanPet, body.record-popup-open #turiNyanPet, body.spot-card-open #turiNyanPet { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  function installPet() {
    if (document.getElementById("turiNyanPet")) return;
    const pet = document.createElement("aside");
    pet.id = "turiNyanPet";
    pet.innerHTML = `<div class="pet-bubble"><strong>${PET_NAME}</strong><span id="turiNyanMessage">写真とカメラも復旧したにゃ。</span><div class="pet-actions"><button type="button" data-pet-close>閉じる</button><button type="button" data-pet-map>地図</button></div></div><button class="pet-button" type="button" aria-label="${PET_NAME}"><img src="${PET_IMAGE_SRC}" alt="${PET_NAME}"></button>`;
    document.body.appendChild(pet);
    pet.querySelector(".pet-button")?.addEventListener("click", () => pet.classList.toggle("is-speaking"));
    pet.querySelector("[data-pet-close]")?.addEventListener("click", () => pet.classList.remove("is-speaking"));
    pet.querySelector("[data-pet-map]")?.addEventListener("click", () => {
      document.getElementById("appStartScreen")?.classList.add("is-hidden");
      document.body.classList.add("start-screen-done");
      pet.classList.remove("is-speaking");
    });
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
