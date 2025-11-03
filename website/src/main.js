"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const card = document.querySelector('.contact-card');
const buttons = document.querySelectorAll('.contact-btn');
// const clickSound = new Audio('sounds/click-sound.mp3');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
const stars = Array.from({ length: 10 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2 + 1,
    drift: Math.random() * 0.2 + 0.05,
}));
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
    const intensity = Math.max(0, 1 - dist / 400);
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
        // Wrap around edges
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
function animate() {
    updateDistortion();
    updateStars();
    drawStars();
    requestAnimationFrame(animate);
}
animate();
// /* 🔊 Sound triggers */
// buttons.forEach(btn => {
//   ['click', 'mouseenter'].forEach(event => {
//     btn.addEventListener(event, () => {
//       clickSound.pause();
//       clickSound.currentTime = 0;
//       clickSound.play().catch(err => {
//         console.warn('Sound failed:', err);
//       });
//     });
//   });
// });
const bgMusic = new Audio('sounds/HOME-Resonance.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.2;
// ✅ Only one click listener to trigger playback
document.addEventListener('click', () => {
    bgMusic.play().catch(err => console.warn('Autoplay blocked:', err));
}, { once: true });
// ✅ Optional: log when ready
bgMusic.addEventListener('canplaythrough', () => {
    console.log('Background music ready');
});
document.addEventListener('click', () => {
    bgMusic.play().catch(err => console.warn('Autoplay blocked:', err));
}, { once: true });
bgMusic.addEventListener('canplaythrough', () => {
    console.log('Background music ready');
});
// clickSound.addEventListener('canplaythrough', () => {
//   console.log('Click sound ready');
// });
const muteBtn = document.getElementById('mute-toggle');
muteBtn.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
    muteBtn.style.transform = 'scale(1.3)';
    setTimeout(() => {
        muteBtn.style.transform = '';
    }, 200);
});
//# sourceMappingURL=main.js.map