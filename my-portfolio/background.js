// ==========================================================================
// Interactive Canvas Background (Particles/Constellation Effect)
// ==========================================================================

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

// Configuration for particles
const config = {
    particleCount: 100, // Adjusted based on screen size later
    particleColor: 'rgba(0, 229, 255, 0.5)', // Cyan accent matching CSS --accent-primary
    lineColor: 'rgba(0, 229, 255, 0.15)',
    particleRadius: 1.5,
    maxVelocity: 0.5,
    interactionRadius: 150, // How close mouse needs to be to interact
    connectionDistance: 120 // How close particles need to be to connect
};

// Resize Canvas to Window
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Adjust particle count based on screen size (density control)
    const area = width * height;
    config.particleCount = Math.floor(area / 12000);

    initParticles();
}

// Particle Class
class Particle {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.dx = dx || (Math.random() - 0.5) * config.maxVelocity * 2;
        this.dy = dy || (Math.random() - 0.5) * config.maxVelocity * 2;
        this.radius = radius || config.particleRadius;
        this.color = color || config.particleColor;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x + this.radius > width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // Mouse Interaction
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Gentle push away from mouse
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;

                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
            }
        }

        this.draw();
    }
}

// Initialize particles array
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// Connect particles with lines
function drawConnections() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                // Calculate opacity based on distance
                let opacity = 1 - (distance / config.connectionDistance);
                ctx.strokeStyle = config.lineColor.replace(/[\d\.]+\)$/g, `${opacity * 0.3})`); // Modify rgba alpha
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    drawConnections();
}

// Event Listeners
window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Remove mouse interaction when leaving window
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Start
resize();
animate();
