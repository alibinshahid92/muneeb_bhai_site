document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       MOBILE NAVIGATION
       ============================================================ */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ============================================================
       COPYRIGHT YEAR
       ============================================================ */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* ============================================================
       SMOOTH SCROLL
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    /* ============================================================
       HEADER — scroll class (backdrop blur)
       ============================================================ */
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    /* ============================================================
       NAV LINK ACTIVE STATE
       ============================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-nav');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    /* ============================================================
       SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
       ============================================================ */
    const animateEls = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animateEls.forEach(el => observer.observe(el));

    /* ============================================================
       SCROLL INDICATOR (hero arrow)
       ============================================================ */
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.classList.add('visible');
        }, 1800);

        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                scrollIndicator.classList.remove('visible');
            }
        }, { passive: true });
    }

    /* ============================================================
       ANIMATED COUNTERS
       ============================================================ */
    const counters = document.querySelectorAll('.stat-number');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ============================================================
       TESTIMONIAL CAROUSEL
       ============================================================ */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let autoPlayTimer;

    function goToSlide(index) {
        // Mark current as leaving
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('leaving');

        setTimeout(() => {
            slides[currentSlide].classList.remove('leaving');
        }, 500);

        dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        resetAutoPlay();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(this.getAttribute('data-index'), 10));
        });
    });

    // Keyboard navigation for carousel
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }, { passive: true });
    }

    resetAutoPlay();

    /* ============================================================
       STICKY CTA BAR
       ============================================================ */
    const stickyCta = document.getElementById('stickyCta');
    const stickyCtaClose = document.getElementById('stickyCtaClose');
    const heroSection = document.getElementById('home');
    const bookingSection = document.getElementById('booking');
    let stickyClosed = false;

    function updateStickyCta() {
        if (stickyClosed || !heroSection || !stickyCta) return;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const bookingTop = bookingSection ? bookingSection.offsetTop : Infinity;
        const bookingBottom = bookingSection ? bookingSection.offsetTop + bookingSection.offsetHeight : Infinity;
        const scrollBottom = window.scrollY + window.innerHeight;

        const pastHero = window.scrollY > heroBottom - 100;
        const inBooking = scrollBottom > bookingTop && window.scrollY < bookingBottom;

        if (pastHero && !inBooking) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateStickyCta, { passive: true });

    if (stickyCtaClose) {
        stickyCtaClose.addEventListener('click', function () {
            stickyCta.classList.remove('visible');
            stickyClosed = true;
        });
    }

    /* ============================================================
       NEWSLETTER FORM
       ============================================================ */
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            if (email) {
                const btn = this.querySelector('button');
                const original = btn.textContent;
                btn.textContent = 'Subscribed!';
                btn.style.background = '#276749';
                emailInput.value = '';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

});
