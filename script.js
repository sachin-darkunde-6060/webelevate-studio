/* ========================================================
   WEBELEVATE STUDIO - PRODUCTION JAVASCRIPT (v2, polished)
   ================================================        */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme Toggle --- */
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('webelevate_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    htmlElement.className = savedTheme;

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        htmlElement.className = newTheme;
        localStorage.setItem('webelevate_theme', newTheme);
    });

    /* --- Scroll Progress & Sticky Header --- */
    const header = document.getElementById('header');
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('backToTop');

    function onScrollUpdate() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';

        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollTop > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    window.addEventListener('scroll', onScrollUpdate, { passive: true });
    onScrollUpdate();

    /* --- Mobile / Tablet Nav (hamburger active below 1024px) --- */
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    function openNav() {
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (mobileToggle && navMenu && navOverlay) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            isOpen ? closeNav() : openNav();
        });

        navOverlay.addEventListener('click', closeNav);

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });

        // Close the mobile menu automatically if resized up to desktop width
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) closeNav();
        });
    }

    /* --- Nav active link on scroll (scrollspy) --- */
    const sections = ['home', 'services', 'packages', 'portfolio', 'about', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let currentId = sections[0] ? sections[0].id : '';
        const scrollPos = window.scrollY + 140;
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollPos) currentId = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* --- Typing Animation --- */
    const typeWriterEl = document.querySelector('.type-writer');
    if (typeWriterEl) {
        const words = JSON.parse(typeWriterEl.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typeWriterEl.innerHTML = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterEl.innerHTML = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    /* --- Animated Counters --- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedCounters = false;

    function runCounters() {
        statNumbers.forEach(num => {
            const target = +num.getAttribute('data-target');
            let count = 0;
            const speed = target / 50;

            function updateCount() {
                count += speed;
                if (count < target) {
                    num.textContent = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    num.textContent = target;
                }
            }
            updateCount();
        });
    }

    /* --- Scroll Reveal Animations (Intersection Observer) --- */
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.querySelector('.stat-number') && !animatedCounters) {
                    runCounters();
                    animatedCounters = true;
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    /* --- Before / After Comparison Slider (mouse + touch + keyboard) --- */
    const container = document.getElementById('comparisonContainer');
    const after = document.getElementById('comparisonAfter');
    const handle = document.getElementById('comparisonSliderHandle');

    if (container && after && handle) {
        let isDragging = false;

        function setPercentage(percentage) {
            percentage = Math.max(0, Math.min(100, percentage));
            after.style.width = percentage + '%';
            handle.style.left = percentage + '%';
            handle.setAttribute('aria-valuenow', Math.round(percentage));
        }

        function updateSliderFromX(clientX) {
            const rect = container.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            setPercentage((x / rect.width) * 100);
        }

        handle.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderFromX(e.clientX);
        });

        handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (!isDragging || !e.touches[0]) return;
            updateSliderFromX(e.touches[0].clientX);
        }, { passive: true });

        container.addEventListener('click', (e) => {
            updateSliderFromX(e.clientX);
        });

        handle.addEventListener('keydown', (e) => {
            const current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
            if (e.key === 'ArrowLeft') { setPercentage(current - 5); e.preventDefault(); }
            if (e.key === 'ArrowRight') { setPercentage(current + 5); e.preventDefault(); }
        });
    }

    /* --- Pricing Calculator --- */
    const calcTypeRadios = document.querySelectorAll('input[name="c_type"]');
    const calcAddons = document.querySelectorAll('#calcAddons input[type="checkbox"]');
    const calcTotalPrice = document.getElementById('calcTotalPrice');
    const calcChips = document.querySelectorAll('.calc-chip');

    function calculateTotal() {
        let total = 4999;
        calcTypeRadios.forEach(radio => {
            if (radio.checked) total = +radio.value;
        });
        calcAddons.forEach(addon => {
            if (addon.checked) total += +addon.value;
        });
        calcTotalPrice.textContent = '₹' + total.toLocaleString('en-IN');

        calcChips.forEach(chip => {
            const input = chip.querySelector('input');
            chip.classList.toggle('active', input && input.checked);
        });
    }

    calcTypeRadios.forEach(radio => radio.addEventListener('change', calculateTotal));
    calcAddons.forEach(checkbox => checkbox.addEventListener('change', calculateTotal));
    calculateTotal();

    /* --- Portfolio Filter --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    /* --- Testimonials Slider --- */
    const track = document.getElementById('testimonialTrack');
    const tPrev = document.getElementById('tPrev');
    const tNext = document.getElementById('tNext');
    if (track && tPrev && tNext) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;

        function updateSliderIndex() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        tNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSliderIndex();
        });

        tPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSliderIndex();
        });
    }

    /* --- FAQ Accordion --- */
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const parent = q.parentElement;
            const isOpen = parent.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
            if (!isOpen) parent.classList.add('active');
        });
    });

    /* --- Modals Handling --- */
    const quoteModal = document.getElementById('quoteModal');
    const caseModal = document.getElementById('caseModal');
    const modalClose = document.getElementById('modalClose');
    const caseModalClose = document.getElementById('caseModalClose');

    document.querySelectorAll('.open-quote-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeNav();
            quoteModal.classList.add('active');
        });
    });

    if (modalClose) modalClose.addEventListener('click', () => quoteModal.classList.remove('active'));
    if (quoteModal) quoteModal.addEventListener('click', (e) => {
        if (e.target === quoteModal) quoteModal.classList.remove('active');
    });

    document.querySelectorAll('.open-case-study').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            const metrics = btn.getAttribute('data-metrics');

            document.getElementById('caseModalTitle').textContent = title;
            document.getElementById('caseModalDesc').textContent = desc;
            document.getElementById('caseModalMetrics').textContent = metrics;
            caseModal.classList.add('active');
        });
    });

    if (caseModalClose) caseModalClose.addEventListener('click', () => caseModal.classList.remove('active'));
    if (caseModal) caseModal.addEventListener('click', (e) => {
        if (e.target === caseModal) caseModal.classList.remove('active');
    });

    /* --- Cookie Consent Banner --- */
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');

    if (!localStorage.getItem('webelevate_cookie')) {
        setTimeout(() => { if (cookieBanner) cookieBanner.style.display = 'block'; }, 1500);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('webelevate_cookie', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }

    if (cookieReject) {
        cookieReject.addEventListener('click', () => {
            localStorage.setItem('webelevate_cookie', 'rejected');
            cookieBanner.style.display = 'none';
        });
    }

});

/* --- Form Submit Handlers --- */
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent successfully to Sachin Darkunde. We will respond within 2 hours.');
    e.target.reset();
}

function handleModalSubmit(e) {
    e.preventDefault();
    alert('Quote request received! Sachin Darkunde will connect with you shortly.');
    document.getElementById('quoteModal').classList.remove('active');
    e.target.reset();
}

function handleNewsletter(e) {
    e.preventDefault();
    alert('Thank you for subscribing to WebElevate Studio insights!');
    e.target.reset();
}