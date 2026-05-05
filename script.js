const pages = document.querySelectorAll('.page');
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const particlesContainer = document.getElementById('particles-container');

let isMusicPlaying = false;
let currentPage = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Show first page
    gsap.to('#page-1 .content', { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    
    // Start background particles
    createParticles();
});

// Start Journey
function startJourney() {
    // Play music (browser needs interaction)
    toggleMusic(true);
    nextPage(2);
}

// Navigation Logic
function nextPage(pageNum) {
    const currentEl = document.getElementById(`page-${currentPage}`);
    const nextEl = document.getElementById(`page-${pageNum}`);

    // Out animation
    gsap.to(currentEl.querySelector('.content'), {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            currentEl.classList.remove('active');
            
            // In animation
            nextEl.classList.add('active');
            gsap.fromTo(nextEl.querySelector('.content'), 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
            
            currentPage = pageNum;
            
            // Special handling for video page
            const video = document.getElementById('feature-video');
            
            if (pageNum === 4) {
                // Pause background music to hear video audio
                if (isMusicPlaying) {
                    toggleMusic(false);
                }
                video.currentTime = 0;
                video.play().catch(e => console.log("Auto-play blocked, wait for user"));
            } else {
                // Stop video if we leave page 4
                video.pause();
                
                // Resume background music if we move to pages 5-8
                if (pageNum >= 5 && pageNum <= 8) {
                    if (!isMusicPlaying) {
                        toggleMusic(true);
                    }
                }
            }
        }
    });
}

function restartJourney() {
    nextPage(1);
}

// Music Control
function toggleMusic(forcePlay = null) {
    if (forcePlay === true || (!isMusicPlaying && forcePlay === null)) {
        music.play();
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        music.pause();
        isMusicPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    }
}

musicToggle.addEventListener('click', () => toggleMusic());

// Particle System (Hearts & Sparkles)
function createParticles() {
    const symbols = ['❤', '✨', '🌸', '💖'];
    const count = 20;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
            
            const size = Math.random() * 20 + 10;
            particle.style.fontSize = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            
            // Randomize duration and delay
            const duration = Math.random() * 5 + 5;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
            
            // Remove after animation to save memory
            particle.addEventListener('animationiteration', () => {
                particle.style.left = `${Math.random() * 100}vw`;
            });
        }, i * 300);
    }
}

// Mouse Trail Effect (Optional, for premium feel)
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.1) return; // Limit creation rate
    
    const trail = document.createElement('div');
    trail.className = 'particle';
    trail.innerHTML = '✨';
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    trail.style.fontSize = '12px';
    trail.style.animation = 'fadeOut 1s forwards';
    
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 1000);
});

// Add fadeOut animation dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Video Event Listeners for Music Control
const videoEl = document.getElementById('feature-video');
if (videoEl) {
    videoEl.addEventListener('pause', () => {
        // If video pauses or ends and we are on page 4, turn music back on
        if (currentPage === 4 && !isMusicPlaying) {
            toggleMusic(true);
        }
    });

    videoEl.addEventListener('play', () => {
        // If video plays and we are on page 4, turn music off
        if (currentPage === 4 && isMusicPlaying) {
            toggleMusic(false);
        }
    });
}
