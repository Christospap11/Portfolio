// Always start from the top of the page on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ==========================================================================
// Loading Animation & Initial Setup
// ==========================================================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const loaderText = document.getElementById('loader-text');
let progress = { value: 0 };

// Fake loading progress
gsap.to(progress, {
    value: 100,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
        loaderText.textContent = `${Math.round(progress.value)}%`;
    },
    onComplete: () => {
        // Hide loader and trigger hero animation
        gsap.to('.loader', {
            yPercent: -100,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: initHeroAnimation
        });
    }
});

// ==========================================================================
// Hero Section Animations
// ==========================================================================
function initHeroAnimation() {
    const tl = gsap.timeline();

    tl.to('.hero-content', {
        opacity: 1,
        duration: 0.1
    })
        .from('.greeting', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        })
        .from('.name', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from('.roles', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from('.bio-short', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from('.hero-buttons', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .to('.navbar', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
                document.querySelector('.navbar').style.transition = 'transform 0.2s cubic-bezier(0.645,0.045,0.355,1), opacity 0.2s ease';
            }
        }, "-=1.0");

    initTypingEffect();
}

// ==========================================================================
// Typing Effect for Roles
// ==========================================================================
function initTypingEffect() {
    const roles = ["Software Engineer", "ML Engineer", "AI Developer", "Full-Stack Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingText = document.getElementById('typing-text');
    const delayBetweenRoles = 2000;
    const typingSpeed = 100;
    const deletingSpeed = 50;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = delayBetweenRoles;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500; // Small pause before typing next word
        }

        setTimeout(type, speed);
    }

    // Start empty and begin typing
    typingText.textContent = "";
    setTimeout(type, 1000);
}

// ==========================================================================
// Scroll Animations (GSAP ScrollTrigger)
// ==========================================================================

// Navbar Hide/Show on Scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add('hidden'); // Scroll down
    } else {
        navbar.classList.remove('hidden'); // Scroll up
    }
    lastScrollTop = scrollTop;
});

// Fade Up Sections
const sections = gsap.utils.toArray('.section');

sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%", // Animates when top of section hits 80% viewport height
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Parallax for About Image
gsap.to('.about-image-wrapper', {
    scrollTrigger: {
        trigger: '.about',
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: -30
});

// ==========================================================================
// 3D Tilt Effect on Hover (Vanilla JS)
// ==========================================================================
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // max rotation degrees
        const rotateY = ((x - centerX) / centerX) * 5;

        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';

        // Dynamic lighting based on cursor (adds to glassmorphism)
        const glassLayer = card.querySelector('.glass-card');
        if (glassLayer) {
            // glassLayer.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease';

        const glassLayer = card.querySelector('.glass-card');
        if (glassLayer) {
            // glassLayer.style.background = 'var(--glass-bg)';
        }
    });
});

// ==========================================================================
// Mobile Burger Menu Toggle
// ==========================================================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// Smooth Scrolling for Nav Links (GSAP-powered)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Show navbar if it was hidden
        navbar.classList.remove('hidden');

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: targetElement.offsetTop, autoKill: false },
                ease: "power3.inOut"
            });
        }
    });
});
