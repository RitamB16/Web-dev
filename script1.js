const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// Make sure canvas size is dynamic and responsive
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas(); // Initial resize
window.addEventListener('resize', resizeCanvas); // Resize on window resize

let fireworks = [];
let stars = [];
let balloons = [];

// Random color generator
function randomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#F39C12', '#2ECC71', '#9B59B6', '#E67E22'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Firework class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.color = randomColor();
        this.exploded = false;
        this.particles = [];
        this.explosionSize = Math.random() * 50 + 100;
    }

    update() {
        if (!this.exploded) {
            this.y -= 8; // Move upward
            if (this.y < canvas.height / 4 + Math.random() * canvas.height / 4) {
                this.explode();
            }
        } else {
            this.particles.forEach(particle => particle.update());
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 150; i++) {
            this.particles.push(new Particle(this.x, this.y, this.explosionSize, this.color));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }
}

// Particle class for explosion
class Particle {
    constructor(x, y, explosionSize, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.color = color;
        this.opacity = 1;
        this.speedX = (Math.random() - 0.5) * 12; // Faster random speed for more dynamic effect
        this.speedY = (Math.random() - 0.5) * 12;
        this.gravity = 0.1;
        this.friction = 0.98; // Adds a more realistic slowdown effect
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.speedX *= this.friction; // Apply friction to make particles slow down
        this.speedY *= this.friction;
        this.opacity -= 0.02; // Fade out particles over time
    }

    draw() {
        ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, 
                              ${parseInt(this.color.slice(3, 5), 16)}, 
                              ${parseInt(this.color.slice(5, 7), 16)}, 
                              ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Star class for twinkling stars in the background
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = randomColor();
        this.twinkle = Math.random() > 0.5 ? 0.05 : -0.05;
    }

    update() {
        this.size += this.twinkle;
        if (this.size <= 0.5 || this.size >= 1.5) {
            this.twinkle = -this.twinkle;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Balloon class to simulate floating balloons
class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100; // Start at the bottom of the screen
        this.size = Math.random() * 30 + 20; // Random balloon size
        this.color = randomColor(); // Random balloon color
        this.speedY = Math.random() * 0.5 + 1; // Balloon will float upward
        this.windEffect = Math.random() * 0.5 - 0.25; // Random horizontal drift
        this.stringLength = this.size * 1.5; // Adjust length of the string based on balloon size
        this.curveAmount = Math.random() * 10 - 5; // Add slight curve to the string
    }

    update() {
        this.y -= this.speedY; // Float upwards
        this.x += this.windEffect; // Slight horizontal motion for realism

        // If the balloon moves off-screen, reset it to the bottom
        if (this.y < -this.size) {
            this.y = canvas.height + Math.random() * 100;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        // Balloon body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Balloon string with slight curve
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.quadraticCurveTo(this.x + this.curveAmount, this.y + this.size + this.curveAmount, this.x, this.y + this.size + this.stringLength);
        ctx.stroke();
    }
}

// Create fireworks at the top of the canvas
function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 4; // Create fireworks at the upper side of the canvas
    fireworks.push(new Firework(x, y));
}

// Create balloons randomly across the screen
function createBalloon() {
    balloons.push(new Balloon());
}

// Update the canvas content (fireworks, balloons, stars)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Create new fireworks
    if (Math.random() < 0.05) {
        createFirework();
    }

    // Create new balloons
    if (Math.random() < 0.02) {
        createBalloon();
    }

    // Update and draw fireworks
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    // Update and draw balloons
    balloons.forEach((balloon, index) => {
        balloon.update();
        balloon.draw();
    });

    requestAnimationFrame(animate);
}

// Initialize some stars for the background
for (let i = 0; i < 100; i++) {
    stars.push(new Star());
}

// Start the animation loop
animate();

// Add event listener for "Next" ball navigation
document.getElementById('nextBall').addEventListener('click', function() {
    window.location.href = 'vindex.html'; // Replace 'nextPage.html' with your desired URL
});