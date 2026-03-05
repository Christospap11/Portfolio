// ==========================================================================
// Custom Cursor — Dot + Lagged Ring + Particle Trail
// ==========================================================================

(function () {
    // ── DOM Setup ──────────────────────────────────────────────────────────
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // ── State ──────────────────────────────────────────────────────────────
    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;
    let isHovering = false;
    let isClicking = false;

    // ── Mouse tracking ─────────────────────────────────────────────────────
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        spawnParticle(e.clientX, e.clientY);
    });

    document.addEventListener('mousedown', () => {
        isClicking = true;
        dot.classList.add('clicking');
        ring.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        isClicking = false;
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
    });

    // ── Hover detection on interactive elements ────────────────────────────
    const interactiveSelectors = 'a, button, .nav-toggle, .skill-item, .project-link-btn, .cta-button';

    document.querySelectorAll(interactiveSelectors).forEach(el => attachHover(el));

    // Also watch for dynamically added elements (optional safety net)
    const observer = new MutationObserver(() => {
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            if (!el._cursorBound) attachHover(el);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function attachHover(el) {
        el._cursorBound = true;
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            ring.classList.add('hovering');
            dot.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            ring.classList.remove('hovering');
            dot.classList.remove('hovering');
        });
    }

    // ── Hide cursor when leaving window ────────────────────────────────────
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    // ── Animation loop: smooth ring lag ────────────────────────────────────
    const LERP_SPEED = 0.12; // 0–1, lower = more lag

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        ringX = lerp(ringX, mouseX, LERP_SPEED);
        ringY = lerp(ringY, mouseY, LERP_SPEED);

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ── Particle sparkle trail ─────────────────────────────────────────────
    let lastParticleTime = 0;
    const PARTICLE_INTERVAL = 30; // ms between particles

    function spawnParticle(x, y) {
        const now = Date.now();
        if (now - lastParticleTime < PARTICLE_INTERVAL) return;
        lastParticleTime = now;

        const p = document.createElement('div');
        p.className = 'cursor-particle';

        // Random spread
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 18 + 4;
        const tx = Math.cos(angle) * spread;
        const ty = Math.sin(angle) * spread;
        const size = Math.random() * 5 + 3;

        p.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
        `;

        document.body.appendChild(p);

        // Remove after animation ends
        p.addEventListener('animationend', () => p.remove());
    }
})();
