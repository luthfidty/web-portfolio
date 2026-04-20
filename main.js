document.addEventListener("DOMContentLoaded", function() {
    
    // Set Tahun Copyright
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Setup Intersection Observer untuk Animasi Scroll (Berulang)
    const observerOptions = {
        root: null, 
        rootMargin: '0px 0px -50px 0px', 
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            } else {
                entry.target.classList.remove('reveal-visible');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => {
        observer.observe(el);   
    });

    // Animasi Canvas Background
    const canvas = document.getElementById('network-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        const particleCount = 60; 
        const connectionDistance = 150; 
        const moveSpeed = 0.3; 

        function init() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * moveSpeed;
                this.vy = (Math.random() - 0.5) * moveSpeed;
                this.radius = Math.random() * 2 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; 
                ctx.fill();
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.25})`; 
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', init);
        
        init();
        animate();
    }

});

// Kosongkan form saat kembali
window.addEventListener('pageshow', function(event) {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
    }
});

// --- Logika Cerdas Carousel ---

// 1. Fungsi untuk mengecek dan menyembunyikan tombol
function updateCarouselButtons(containerId, prevBtnId, nextBtnId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!container || !prevBtn || !nextBtn) return;

    // Sembunyikan panah KIRI jika scroll sudah mentok di awal (0)
    if (container.scrollLeft <= 0) {
        prevBtn.classList.add('opacity-0', 'pointer-events-none');
        prevBtn.classList.remove('opacity-100');
    } else {
        prevBtn.classList.remove('opacity-0', 'pointer-events-none');
        prevBtn.classList.add('opacity-100');
    }

    // Sembunyikan panah KANAN jika scroll sudah mentok di ujung akhir
    // (Atau jika jumlah kartu sedikit dan tidak butuh scroll sama sekali)
    if (Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 2) {
        nextBtn.classList.add('opacity-0', 'pointer-events-none');
        nextBtn.classList.remove('opacity-100');
    } else {
        nextBtn.classList.remove('opacity-0', 'pointer-events-none');
        nextBtn.classList.add('opacity-100');
    }
}

// 2. Fungsi saat tombol panah ditekan
function slideCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    if (container) {
        const scrollAmount = 400 * direction;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// 3. Menjalankan logika pengecekan saat halaman dimuat dan di-scroll
document.addEventListener("DOMContentLoaded", function() {
    const carousels = [
        { id: 'web-carousel', prev: 'web-prev', next: 'web-next' },
        { id: 'ai-carousel', prev: 'ai-prev', next: 'ai-next' }
    ];

    carousels.forEach(c => {
        const container = document.getElementById(c.id);
        if (container) {
            // Cek saat halaman pertama kali dimuat
            // SetTimeout kecil memastikan lebar CSS sudah selesai di-render
            setTimeout(() => updateCarouselButtons(c.id, c.prev, c.next), 100);
            
            // Cek secara real-time setiap kali user menggeser (scroll/swipe)
            container.addEventListener('scroll', () => {
                updateCarouselButtons(c.id, c.prev, c.next);
            });
            
            // Cek ulang jika ukuran layar (jendela browser) diubah
            window.addEventListener('resize', () => {
                updateCarouselButtons(c.id, c.prev, c.next);
            });
        }
    });

    const carouselsOtis = [
        { id: 'web-carousel', interval: 5000 }, // Geser setiap 5 detik
        { id: 'ai-carousel', interval: 4000 }  // Geser setiap 4 detik
    ];

    carouselsOtis.forEach(c => {
        const container = document.getElementById(c.id);
        if (container) {
            setInterval(() => {
                // Geser ke kanan (direction = 1)
                const scrollAmount = 400; // Sesuaikan jumlah scroll
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

                // Cek jika sudah sampai di ujung akhir
                if (Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 2) {
                    // Kembali ke awal
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                }
            }, c.interval);
        }
    });
});