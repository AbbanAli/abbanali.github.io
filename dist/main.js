"use strict";
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const card = document.querySelector('.contact-card');
const buttons = document.querySelectorAll('.contact-btn');
const muteBtn = document.getElementById('mute-toggle');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = generateStars(250);
});
function generateStars(count) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        drift: Math.random() * 0.2 + 0.05,
    }));
}
let stars = generateStars(200);
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
function updateDistortion() {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const intensity = Math.max(0, 1 - dist / 500);
    card.style.setProperty('--distort', intensity.toFixed(3));
}
function updateStars() {
    for (const star of stars) {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
            const pull = 0.02 * (1 - dist / 70);
            star.vx += pull * (dx / dist);
            star.vy += pull * (dy / dist);
        }
        star.vx *= 0.96;
        star.vy *= 0.96;
        star.x += star.vx + star.drift;
        star.y += star.vy + star.drift;
        if (star.x < 0)
            star.x = canvas.width;
        if (star.x > canvas.width)
            star.x = 0;
        if (star.y < 0)
            star.y = canvas.height;
        if (star.y > canvas.height)
            star.y = 0;
    }
}
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }
}
function getClientSpecs() {
    return {
        Timestamp: new Date().toISOString(),
        Platform: navigator.platform,
        UserAgent: navigator.userAgent,
        Language: navigator.language,
        Screen: `${screen.width}x${screen.height}`,
        ColorDepth: `${screen.colorDepth} bits`,
        DeviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown",
        HardwareConcurrency: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} threads` : "Unknown"
    };
}
function logSpecsToConsoleAndPage() {
    const specs = getClientSpecs();
    console.group("📜 Visitor Specs");
    const specLog = document.getElementById("spec-log");
    let loreTrigger = "";
    for (const [key, value] of Object.entries(specs)) {
        console.log(`${key}: ${value}`);
        if (specLog) {
            specLog.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        // Optional lore triggers
        if (key === "DeviceMemory" && value.includes("16")) {
            loreTrigger = "The stars shimmer brighter for machines of memory.";
        }
        if (key === "Screen" && value.includes("3840")) {
            loreTrigger = "A 4K traveler approaches. The cosmos stirs.";
        }
    }
    console.groupEnd();
    if (specLog && loreTrigger) {
        specLog.innerHTML += `<p class="lore-trigger">${loreTrigger}</p>`;
        specLog.style.display = "block";
    }
}
window.addEventListener("DOMContentLoaded", logSpecsToConsoleAndPage);
function animate() {
    updateDistortion();
    updateStars();
    drawStars();
    requestAnimationFrame(animate);
}
animate();
const bgMusic = new Audio();
bgMusic.src = 'sounds/HOME-Resonance.mp3?v=1';
bgMusic.loop = true;
bgMusic.volume = 0.03;
const audioContext = new (window.AudioContext || window.AudioContext)();
const source = audioContext.createMediaElementSource(bgMusic);
// Create a low-shelf filter to boost bass
const bassBoost = audioContext.createBiquadFilter();
bassBoost.type = 'lowshelf';
bassBoost.frequency.value = 200; // Boost frequencies below 200Hz
bassBoost.gain.value = 3; // Boost amount in dB (try 3–6 for subtle lift)
window.addEventListener("DOMContentLoaded", () => {
    const welcomeEl = document.getElementById("welcome-message");
    const hasVisited = localStorage.getItem("hasVisited");
    if (welcomeEl) {
        if (hasVisited) {
            welcomeEl.textContent = "Welcome back, traveler. The stars remember you.";
        }
        else {
            localStorage.setItem("hasVisited", "true");
        }
    }
});
// Connect the nodes
source.connect(bassBoost);
bassBoost.connect(audioContext.destination);
document.addEventListener('click', () => {
    bgMusic.play().catch(err => console.warn('Autoplay blocked:', err));
}, { once: true });
bgMusic.addEventListener('canplaythrough', () => {
    console.log('Background music ready');
});
bgMusic.addEventListener('error', () => {
    console.error('Audio load error:', bgMusic.error);
});
muteBtn.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
    muteBtn.style.transform = 'scale(1.3)';
    setTimeout(() => {
        muteBtn.style.transform = '';
    }, 200);
});
