// Three.js 3D Background
let scene, camera, renderer, particles, particleGeometry, particleMaterial;

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('threejs-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create particle system
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        // Colors - vibrant rainbow
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Velocities
        velocities[i * 3] = (Math.random() - 0.5) * 0.5;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particleMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = { velocities: velocities };
    scene.add(particles);

    // Position camera
    camera.position.z = 500;

    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;

        // Update particle positions
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.userData.velocities;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Bounce particles
            if (Math.abs(positions[i]) > 1000) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 1000) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 1000) velocities[i + 2] *= -1;
        }

        particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Initialize Three.js when page loads
window.addEventListener('load', initThreeJS);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        timestamp: new Date().toISOString()
    };

    // Show loading
    const loading = document.getElementById('loading');
    const submitBtn = document.querySelector('.submit-btn');
    loading.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Simulate API call (replace with actual Supabase integration later)
    setTimeout(() => {
        // Log data to console for now
        console.log('Registration Data:', formData);
        
        // Hide loading
        loading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
        
        // Show success message
        alert('🎉 Registration successful! We\'ll contact you soon with more details.');
        
        // Reset form
        this.reset();
    }, 2000);
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.3s';
            entry.target.style.animationName = 'slideInUp';
            entry.target.style.animationDuration = '0.8s';
            entry.target.style.animationFillMode = 'both';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.detail-card').forEach(card => {
    observer.observe(card);
});

// Mouse movement effect for 3D elements
document.addEventListener('mousemove', function(e) {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    if (camera) {
        camera.position.x = mouseX * 50;
        camera.position.y = mouseY * 50;
        camera.lookAt(scene.position);
    }
});

// Intersection Observer for stat cards animation
const statCards = document.querySelectorAll('.stat-card');
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('h3');
            const finalNumber = parseInt(number.textContent.replace(/\D/g, '')) || 50;
            const suffix = number.textContent.replace(/[0-9]/g, '');
            
            let current = 0;
            const increment = finalNumber / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    current = finalNumber;
                    clearInterval(timer);
                }
                number.textContent = Math.floor(current) + suffix;
            }, 20);
        }
    });
}, { threshold: 0.5 });

statCards.forEach(card => statsObserver.observe(card));

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.detail-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('detail-card')) {
                this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            } else {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero-text h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }

    // Add parallax scrolling effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        const hero = document.querySelector('.hero');
        
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Add scroll-based opacity changes
        const sections = document.querySelectorAll('.detail-card');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const visibility = Math.min(1, (window.innerHeight - rect.top) / window.innerHeight);
                section.style.opacity = visibility;
            }
        });
    });

    // Add loading screen effect
    const body = document.body;
    body.classList.add('loading');
    
    setTimeout(() => {
        body.classList.remove('loading');
        body.classList.add('loaded');
    }, 1500);

    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });

    // Console welcome message
    console.log(`
    🚀 Tech Hackathon 2025 Website Loaded!
    
    ✨ Features:
    - 3D Particle Background with Three.js
    - Interactive Animations
    - Responsive Design
    - Modern CSS Effects
    
    🎯 Ready for Supabase integration!
    `);
});

// Performance optimization
let ticking = false;

function updateParallax() {
    // Throttle scroll events for better performance
    if (!ticking) {
        requestAnimationFrame(function() {
            // Parallax calculations here
            ticking = false;
        });
        ticking = true;
    }
}

// Error handling for Three.js
window.addEventListener('error', function(e) {
    if (e.message.includes('THREE')) {
        console.warn('Three.js error detected. Falling back to 2D mode.');
        document.getElementById('threejs-canvas').style.display = 'none';
    }
});

// Mobile touch interactions
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {
        document.body.classList.add('touch-device');
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});