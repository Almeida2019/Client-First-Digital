// Client-First Digital - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initCarousel();
    initPortfolioTabs();
    initThemeToggle();
    initScrollAnimations();
    initSmoothScroll();
});

// Navigation functionality
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.innerHTML = '☰';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (mobileToggle) {
                mobileToggle.innerHTML = '☰';
            }
        });
    });
    
    // Update active nav link based on current page
    updateActiveNavLink();
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const isLight = document.body.getAttribute('data-theme') === 'light';
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(0, 0, 0, 0.95)';
            } else {
                navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)';
            }
        }
    });
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if ((currentPage === 'index.html' || currentPage === '') && (href === 'index.html' || href === '/')) {
            link.classList.add('active');
        } else if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Hero Carousel functionality
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    // Auto-advance carousel
    setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }
    
    function updateSlide() {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Initialize first slide
    updateSlide();
}

// Portfolio tabs functionality
function initPortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const itemCategories = item.getAttribute('data-categories').split(',');
                
                if (category === 'all' || itemCategories.includes(category)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    // Initialize with 'all' category
    const allButton = document.querySelector('.tab-btn[data-category="all"]');
    if (allButton) {
        allButton.click();
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add transition class
        body.classList.add('theme-transitioning');
        
        // Apply new theme
        applyTheme(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            body.classList.remove('theme-transitioning');
        }, 300);
        
        localStorage.setItem('theme', newTheme);
    });
    
    function applyTheme(theme) {
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('title', 'Switch to dark mode');
        } else {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('title', 'Switch to light mode');
        }
        
        // Update navbar background immediately
        updateNavbarTheme();
    }
    
    function updateNavbarTheme() {
        const navbar = document.querySelector('.navbar');
        const isLight = body.getAttribute('data-theme') === 'light';
        if (navbar) {
            navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)';
        }
    }
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Service card interactions
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-item');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Portfolio item interactions
function initPortfolioCards() {
    const portfolioCards = document.querySelectorAll('.portfolio-item');
    
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility function to create smooth page transitions
function navigateWithTransition(url) {
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Initialize page-specific functionality based on current page
function initPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'services.html':
            initServiceCards();
            break;
        case 'portfolio.html':
            initPortfolioCards();
            break;
        default:
            // Home page or other pages
            break;
    }
}

// Add fade-in effect for page loads
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    initPageSpecific();
});

// Contact form functionality (if present)
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Build mailto link to send via default email client
        const to = 'info@clientfirstdigital.com';
        const subject = encodeURIComponent(`New enquiry: ${data.service || 'General'}`);
        const bodyLines = [
            `Name: ${data.name || ''}`,
            `Email: ${data.email || ''}`,
            `Service: ${data.service || ''}`,
            '',
            'Message:',
            (data.message || '')
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));

        // Open the user's email client with prefilled details
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

        // Provide quick UI feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Opening email...';
        setTimeout(() => {
            submitBtn.textContent = originalText;
        }, 1500);
    });
}

// Initialize contact form if it exists
document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initUIUXScrollEffect();
});

// UI/UX Portfolio Image Scroll Effect
function initUIUXScrollEffect() {
    const uiuxItems = document.querySelectorAll('.portfolio-item[data-categories*="ui-ux"]');
    
    console.log('Found UI/UX items:', uiuxItems.length); // Debug log
    
    uiuxItems.forEach((item, index) => {
        const image = item.querySelector('.portfolio-image img');
        if (!image) {
            console.log('No image found for item', index);
            return;
        }
        
        console.log('Setting up scroll effect for item', index);
        
        // Enhanced hover effect for desktop
        item.addEventListener('mouseenter', () => {
            console.log('Mouse enter on UI/UX item', index);
            image.style.objectPosition = 'center bottom';
            image.style.transition = 'object-position 6s ease-in-out';
        });
        
        item.addEventListener('mouseleave', () => {
            console.log('Mouse leave on UI/UX item', index);
            image.style.objectPosition = 'center top';
            image.style.transition = 'object-position 2s ease-in-out';
        });
        
        // Add touch support for mobile devices
        let touchStartY = 0;
        let isScrolling = false;
        
        item.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            isScrolling = false;
        });
        
        item.addEventListener('touchmove', (e) => {
            if (!isScrolling) {
                const touchY = e.touches[0].clientY;
                const deltaY = touchStartY - touchY;
                
                // If user is scrolling down on the item, trigger the scroll effect
                if (Math.abs(deltaY) > 10) {
                    isScrolling = true;
                    image.style.objectPosition = deltaY > 0 ? 'center bottom' : 'center top';
                    image.style.transition = 'object-position 4s ease-in-out';
                }
            }
        });
        
        item.addEventListener('touchend', () => {
            if (isScrolling) {
                // Reset to top after a delay
                setTimeout(() => {
                    image.style.objectPosition = 'center top';
                    image.style.transition = 'object-position 2s ease-in-out';
                }, 2000);
            }
        });
    });
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.innerHTML = '☰';
            }
        }
    }
});

// Language toggle functionality
function toggleLanguage() {
    const currentLang = document.documentElement.lang === 'pt-pt' ? 'pt-pt' : 'en';
    const newLang = currentLang === 'en' ? 'pt-pt' : 'en';

    document.documentElement.lang = newLang;
    localStorage.setItem('language', newLang);
    updateLanguageToggleLabels(newLang);
    translateContent(newLang);
}

// Translation content keyed by identifiers
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.portfolio': 'Portfolio',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.cta': 'Book Strategy Call',

        'hero.subtitle': 'Premium Digital Solutions',
        'hero.headingLead': 'Transform Your Business with',
        'hero.headingHighlight': 'AI Automation',
        'hero.description': 'Unlock your business potential with our cutting-edge AI automation solutions, custom web development, and strategic digital marketing services.',
        'hero.ctaPrimary': 'Explore Services',
        'hero.ctaSecondary': 'View Portfolio',

        'hero.slide2.subtitle': "South Africa's Premier Agency",
        'hero.slide2.heading': 'Expert <span class="gradient-text">Web Development</span> & Design',
        'hero.slide2.body': 'From stunning websites to complex web applications, we deliver exceptional digital experiences that drive results and exceed expectations.',
        'hero.slide2.ctaPrimary': 'See Our Work',
        'hero.slide2.ctaSecondary': 'Get Quote',

        'hero.slide3.subtitle': 'Business System Integration',
        'hero.slide3.heading': 'Seamless <span class="gradient-text">Zoho & Microsoft 365</span> Solutions',
        'hero.slide3.body': 'Streamline your operations with expert integration of Zoho CRM, Microsoft 365, and Google Workspace. Boost productivity and collaboration.',
        'hero.slide3.ctaPrimary': 'Learn More',
        'hero.slide3.ctaSecondary': 'Book Consultation',

        'index.core.headingLead': 'Our',
        'index.core.headingHighlight': 'Core Services',
        'index.core.tagline': 'Comprehensive digital solutions tailored for South African businesses',
        'index.core.ai.title': 'AI Automation',
        'index.core.ai.body': 'Transform your workflow with intelligent automation solutions that save time, reduce costs, and eliminate manual processes.',
        'index.core.ai.point1': 'Custom AI solutions',
        'index.core.ai.point2': 'Workflow automation',
        'index.core.ai.point3': 'Process optimization',
        'index.core.ai.point4': 'ROI-focused results',
        'index.core.web.title': 'Web Development',
        'index.core.web.body': 'Professional websites and web applications built with modern technologies like Next.js, React, and responsive design principles.',
        'index.core.web.point1': 'Next.js & React development',
        'index.core.web.point2': 'Responsive design',
        'index.core.web.point3': 'Performance optimization',
        'index.core.web.point4': 'SEO-ready structure',
        'index.core.creative.title': 'Creative Design',
        'index.core.creative.body': 'Stunning brand identities and UI/UX designs that captivate your audience and drive conversions across all platforms.',
        'index.core.creative.point1': 'Brand identity design',
        'index.core.creative.point2': 'UI/UX design',
        'index.core.creative.point3': 'Visual storytelling',
        'index.core.creative.point4': 'Conversion optimization',

        'index.why.heading': 'Why Choose <span class="gradient-text">Client-First Digital</span>?',
        'index.why.intro': "We're not just another digital agency. We're your strategic partner in digital transformation, committed to delivering exceptional results that drive real business growth.",
        'index.why.point1.title': 'Proven Track Record',
        'index.why.point1.body': '500+ successful projects delivered across various industries',
        'index.why.point2.title': 'Cutting-Edge Technology',
        'index.why.point2.body': 'Latest tools and frameworks for superior performance',
        'index.why.point3.title': '24/7 Premium Support',
        'index.why.point3.body': 'Round-the-clock maintenance and optimization',
        'index.why.statsTitle': 'Our Success Stats',
        'index.why.stat1': 'Projects Completed',
        'index.why.stat2': 'Client Satisfaction',
        'index.why.stat3': 'Years Experience',
        'index.why.stat4': 'Support Available',

        'index.process.headingLead': 'Our',
        'index.process.headingHighlight': 'Proven Process',
        'index.process.tagline': 'From strategy to implementation, we follow a systematic approach that ensures success',
        'index.process.step1.title': '1. Discovery',
        'index.process.step1.body': 'We dive deep into understanding your business, goals, and challenges to create a tailored strategy.',
        'index.process.step2.title': '2. Design',
        'index.process.step2.body': 'Our creative team develops stunning designs and user experiences that align with your brand vision.',
        'index.process.step3.title': '3. Develop',
        'index.process.step3.body': 'We build robust, scalable solutions using cutting-edge technologies and best practices.',
        'index.process.step4.title': '4. Deploy',
        'index.process.step4.body': 'We launch your solution and provide ongoing support to ensure continued success and growth.',

        'index.contact.heading': 'Ready to <span class="gradient-text">Transform</span> Your Business?',
        'index.contact.tagline': "Let's discuss how our premium digital solutions can help you achieve your business goals and stay ahead of the competition.",
        'index.contact.whatsappLabel': 'WhatsApp:',
        'index.contact.emailLabel': 'Email:',
        'index.contact.locationLabel': 'Location:',
        'index.contact.locationValue': 'Pretoria, South Africa',
        'index.contact.formTitle': 'Book Your Free Strategy Call',

        'cta.learnMore': 'Learn More',
        'cta.getStarted': 'Get Started',
        'cta.getQuote': 'Get Quote',
        'cta.startProject': 'Start Project',
        'cta.discussProject': 'Discuss Project',
        'cta.startStore': 'Start Store',
        'cta.growBusiness': 'Grow Business',
        'cta.analyzeData': 'Analyze Data',
        'cta.migrateNow': 'Migrate Now',
        'cta.bookConsultation': 'Book Free Consultation',
        'cta.viewWork': 'View Our Work',
        'cta.viewProjects': 'View Projects',
        'cta.ourServices': 'Our Services',
        'cta.livePreview': 'Live Preview',
        'cta.hireUs': 'Hire Us',
        'cta.getCRM': 'Get CRM',
        'cta.buildSimilar': 'Build Similar',
        'cta.createPortfolio': 'Create Portfolio',
        'cta.startEcommerce': 'Start E-commerce',
        'cta.viewProject': 'View Project',
        'cta.fashionEcommerce': 'Fashion E-commerce',
        'cta.furnitureStore': 'Furniture Store',
        'cta.corporateSite': 'Corporate Site',
        'cta.viewServices': 'View Our Services',

        // Services page
        'services.hero.subtitle': 'Premium Digital Services',
        'services.hero.heading': 'Comprehensive <span class="gradient-text">Digital Solutions</span> for Your Business',
        'services.hero.description': 'From AI automation to web development, we deliver cutting-edge services that transform businesses globally and drive measurable results.',
        'services.core.title': 'Core Digital Services',
        'services.core.ai.title': 'AI Automation',
        'services.core.ai.body': 'Transform your business processes with intelligent automation solutions that eliminate manual tasks, reduce operational costs, and boost productivity by up to 300%.',
        'services.core.ai.point1': 'Custom AI workflow automation',
        'services.core.ai.point2': 'Intelligent document processing',
        'services.core.ai.point3': 'Automated customer service chatbots',
        'services.core.ai.point4': 'Data analysis and reporting automation',
        'services.core.ai.point5': 'Process optimization consulting',
        'services.core.ai.point6': 'ROI-focused implementation',
        'services.core.ai.price': 'From R15,000',
        'services.core.ai.timeline': '2-6 weeks delivery',
        'services.core.web.title': 'Web Development',
        'services.core.web.body': 'Professional websites and web applications built with cutting-edge technologies like Next.js and React, delivering exceptional performance and user experiences.',
        'services.core.web.point1': 'Next.js & React development',
        'services.core.web.point2': 'Responsive mobile-first design',
        'services.core.web.point3': 'SEO optimization & fast loading',
        'services.core.web.point4': 'Progressive Web Apps (PWA)',
        'services.core.web.point5': 'Custom CMS integration',
        'services.core.web.point6': 'Performance monitoring & analytics',
        'services.core.web.price': 'From R8,000',
        'services.core.web.timeline': '1-4 weeks delivery',
        'services.core.creative.title': 'Creative Design',
        'services.core.creative.body': 'Stunning brand identities and UI/UX designs that captivate your audience, drive conversions, and establish your brand as a market leader.',
        'services.core.creative.point1': 'Complete brand identity packages',
        'services.core.creative.point2': 'UI/UX design for web & mobile',
        'services.core.creative.point3': 'Logo design & visual guidelines',
        'services.core.creative.point4': 'Marketing material design',
        'services.core.creative.point5': 'User research & testing',
        'services.core.creative.point6': 'Conversion-focused design strategies',
        'services.core.creative.price': 'From R5,000',
        'services.core.creative.timeline': '1-3 weeks delivery',
        'services.core.support.title': 'Premium Support',
        'services.core.support.body': 'Round-the-clock maintenance, optimization, and support services to ensure your digital assets perform flawlessly and deliver consistent results.',
        'services.core.support.point1': '24/7 technical support',
        'services.core.support.point2': 'Regular security updates & backups',
        'services.core.support.point3': 'Performance optimization',
        'services.core.support.point4': 'Content updates & maintenance',
        'services.core.support.point5': 'Monthly analytics reports',
        'services.core.support.point6': 'Priority response times',
        'services.core.support.price': 'From R2,500/month',
        'services.core.support.timeline': 'Ongoing service',
        'services.integration.title': 'Business System Integration',
        'services.integration.zoho.title': 'Zoho Ecosystem',
        'services.integration.zoho.body': 'Complete Zoho suite implementation and integration, streamlining your business operations with CRM, accounting, project management, and marketing automation.',
        'services.integration.zoho.point1': 'Zoho CRM setup & customization',
        'services.integration.zoho.point2': 'Zoho Books accounting integration',
        'services.integration.zoho.point3': 'Zoho Creator custom applications',
        'services.integration.zoho.point4': 'Zoho Campaigns email marketing',
        'services.integration.zoho.point5': 'Zoho Desk customer support system',
        'services.integration.zoho.point6': 'Cross-platform data synchronization',
        'services.integration.zoho.price': 'From R12,000',
        'services.integration.zoho.timeline': '2-4 weeks setup',
        'services.integration.google.title': 'Google Workspace',
        'services.integration.google.body': 'Professional Google Workspace setup and optimization, enhancing team collaboration with Gmail, Drive, Meet, Calendar, and advanced security features.',
        'services.integration.google.point1': 'Professional Gmail setup & migration',
        'services.integration.google.point2': 'Google Drive organization & permissions',
        'services.integration.google.point3': 'Google Meet conferencing setup',
        'services.integration.google.point4': 'Shared calendar management',
        'services.integration.google.point5': 'Advanced security configuration',
        'services.integration.google.point6': 'Team training & best practices',
        'services.integration.google.price': 'From R6,000',
        'services.integration.google.timeline': '1-2 weeks setup',
        'services.integration.microsoft.title': 'Microsoft 365 Ecosystem',
        'services.integration.microsoft.body': 'Comprehensive Microsoft 365 implementation with Teams, SharePoint, Power Platform, and advanced productivity tools for enterprise-level collaboration.',
        'services.integration.microsoft.point1': 'Microsoft Teams setup & optimization',
        'services.integration.microsoft.point2': 'SharePoint intranet development',
        'services.integration.microsoft.point3': 'Power Platform automation',
        'services.integration.microsoft.point4': 'Exchange email configuration',
        'services.integration.microsoft.point5': 'OneDrive business setup',
        'services.integration.microsoft.point6': 'Advanced compliance & security',
        'services.integration.microsoft.price': 'From R10,000',
        'services.integration.microsoft.timeline': '2-3 weeks setup',
        'services.integration.custom.title': 'Custom Integrations',
        'services.integration.custom.body': 'Seamless API connections between different business systems, creating unified workflows that eliminate data silos and improve operational efficiency.',
        'services.integration.custom.point1': 'REST API development & integration',
        'services.integration.custom.point2': 'Database synchronization',
        'services.integration.custom.point3': 'Third-party service connections',
        'services.integration.custom.point4': 'Real-time data sharing',
        'services.integration.custom.point5': 'Automated workflow triggers',
        'services.integration.custom.point6': 'Custom dashboard development',
        'services.integration.custom.price': 'From R20,000',
        'services.integration.custom.timeline': '3-6 weeks delivery',
        'services.additional.title': 'Additional Services',
        'services.additional.ecommerce.title': 'E-commerce Solutions',
        'services.additional.ecommerce.body': 'Complete online store development with secure payment gateways, inventory management, and conversion optimization to maximize your online sales potential.',
        'services.additional.ecommerce.point1': 'Custom e-commerce development',
        'services.additional.ecommerce.point2': 'Payment gateway integration',
        'services.additional.ecommerce.point3': 'Inventory management systems',
        'services.additional.ecommerce.point4': 'Order tracking & fulfillment',
        'services.additional.ecommerce.point5': 'Mobile-optimized shopping experience',
        'services.additional.ecommerce.point6': 'Conversion rate optimization',
        'services.additional.ecommerce.price': 'From R15,000',
        'services.additional.ecommerce.timeline': '3-6 weeks delivery',
        'services.additional.marketing.title': 'Digital Marketing',
        'services.additional.marketing.body': 'Comprehensive digital marketing strategies including SEO, social media management, and content marketing to increase your online visibility and drive qualified leads.',
        'services.additional.marketing.point1': 'Search Engine Optimization (SEO)',
        'services.additional.marketing.point2': 'Social media management',
        'services.additional.marketing.point3': 'Content marketing strategies',
        'services.additional.marketing.point4': 'Pay-per-click advertising (PPC)',
        'services.additional.marketing.point5': 'Email marketing campaigns',
        'services.additional.marketing.point6': 'Performance tracking & analytics',
        'services.additional.marketing.price': 'From R8,000/month',
        'services.additional.marketing.timeline': 'Ongoing campaigns',
        'services.additional.analytics.title': 'Data Analytics',
        'services.additional.analytics.body': 'Advanced business intelligence and reporting solutions that transform your data into actionable insights, helping you make informed decisions and drive growth.',
        'services.additional.analytics.point1': 'Custom dashboard development',
        'services.additional.analytics.point2': 'Business intelligence reporting',
        'services.additional.analytics.point3': 'Data visualization & insights',
        'services.additional.analytics.point4': 'Automated reporting systems',
        'services.additional.analytics.point5': 'Performance KPI tracking',
        'services.additional.analytics.point6': 'Predictive analytics modeling',
        'services.additional.analytics.price': 'From R12,000',
        'services.additional.analytics.timeline': '2-4 weeks setup',
        'services.additional.cloud.title': 'Cloud Migration',
        'services.additional.cloud.body': 'Seamless migration of your business systems to cloud platforms, improving accessibility, security, and scalability while reducing operational costs.',
        'services.additional.cloud.point1': 'Cloud strategy & planning',
        'services.additional.cloud.point2': 'Data migration & security',
        'services.additional.cloud.point3': 'Infrastructure optimization',
        'services.additional.cloud.point4': 'Cost optimization strategies',
        'services.additional.cloud.point5': 'Staff training & support',
        'services.additional.cloud.point6': '24/7 monitoring & maintenance',
        'services.additional.cloud.price': 'From R18,000',
        'services.additional.cloud.timeline': '4-8 weeks migration',
        'services.metrics.heading': 'Our <span class="gradient-text">Success Metrics</span>',
        'services.metrics.tagline': 'Measurable results that matter to your business',
        'services.metrics.stat1': 'Average productivity increase with AI automation',
        'services.metrics.stat2': 'Faster website loading speeds on average',
        'services.metrics.stat3': 'Average increase in conversion rates',
        'services.metrics.stat4': 'Average cost reduction through automation',
        'services.cta.heading': 'Ready to Transform Your Business?',
        'services.cta.body': "Let's discuss how our premium services can help you achieve your goals",

        // Portfolio page
        'portfolio.hero1.subtitle': 'Our Premium Portfolio',
        'portfolio.hero1.heading': 'Exceptional <span class="gradient-text">Digital Experiences</span> We\'ve Created',
        'portfolio.hero1.body': 'Explore our collection of award-winning websites, applications, and digital solutions that have transformed businesses globally.',
        'portfolio.hero2.subtitle': 'Award-Winning Designs',
        'portfolio.hero2.heading': 'Transforming <span class="gradient-text">Global Businesses</span> Through Design',
        'portfolio.hero2.body': 'From luxury e-commerce platforms to corporate websites, our portfolio showcases innovative solutions that drive real business results and user engagement.',
        'portfolio.filter.all': 'All Projects',
        'portfolio.filter.uiux': 'UI/UX Design',
        'portfolio.filter.web': 'Web Development',
        'portfolio.filter.ecommerce': 'E-commerce',
        'portfolio.filter.corporate': 'Corporate',
        'portfolio.filter.creative': 'Creative',
        'portfolio.items.eternal.title': 'Eternal Moments Wedding Platform',
        'portfolio.items.eternal.category': 'UI/UX Design • Creative • Web Development',
        'portfolio.items.eternal.description': 'Luxury wedding planning platform celebrating love across all cultures. Features elegant design, cultural ceremony guides, and comprehensive planning tools for couples and event planners.',
        'portfolio.items.eternal.testimonial': '"The Eternal Moments platform perfectly captures the essence of luxury wedding planning. The cultural integration features are exceptional and have helped us serve diverse couples beautifully." - Wedding Planner Client',
        'portfolio.items.eternal.completed': 'Completed: October 2024',
        'portfolio.items.angbu.title': 'ANGBU CRM System',
        'portfolio.items.angbu.category': 'UI/UX Design • Web Development • Corporate',
        'portfolio.items.angbu.description': 'Comprehensive educational management platform for Angbu Training Centre featuring student management, course tracking, and bilingual support for English language learning programs.',
        'portfolio.items.angbu.testimonial': '"The ANGBU CRM has revolutionized how we manage our English classes. The bilingual interface and student tracking features are exactly what we needed for our growing training center." - ATC Management',
        'portfolio.items.angbu.completed': 'Completed: September 2024',
        'portfolio.items.ysam.title': 'YSAM Luxury Car Rental',
        'portfolio.items.ysam.category': 'E-commerce • UI/UX Design • Web Development',
        'portfolio.items.ysam.description': 'Premium car rental service specializing in luxury Toyota Land Cruiser vehicles for executive transport, weddings, and VIP services in Cabinda with professional driver services.',
        'portfolio.items.ysam.testimonial': '"YSAM\'s website perfectly represents our luxury service. The elegant design and clear pricing structure have significantly increased our online bookings and client inquiries." - YSAM Management',
        'portfolio.items.ysam.completed': 'Completed: August 2024',
        'portfolio.items.tebogo.title': 'Tebogo Portfolio Website',
        'portfolio.items.tebogo.category': 'UI/UX Design • Creative • Web Development',
        'portfolio.items.tebogo.description': 'Modern, professional portfolio website showcasing creative work and expertise. Features smooth animations, responsive design, and an elegant presentation of projects and skills.',
        'portfolio.items.tebogo.testimonial': '"My new portfolio website has been a game-changer for my freelance career. The professional design and smooth user experience have helped me land several high-value clients." - Tebogo, Creative Professional',
        'portfolio.items.tebogo.completed': 'Completed: July 2024',
        'portfolio.items.ecobean.title': 'Eco Bean Products',
        'portfolio.items.ecobean.category': 'UI/UX Design • E-commerce • Web Development • Creative',
        'portfolio.items.ecobean.description': 'Sustainable product showcase featuring eco-friendly coffee beans and related products. Clean, modern design emphasizing environmental consciousness and product quality.',
        'portfolio.items.ecobean.testimonial': '"Eco Bean\'s product showcase beautifully represents our commitment to sustainability. The clean design and intuitive navigation have helped increase our product inquiries by 200%." - Eco Bean Founder',
        'portfolio.items.ecobean.completed': 'Completed: June 2024',
        'portfolio.items.ubuntu.title': 'Ubuntu Fashion Platform',
        'portfolio.items.ubuntu.category': 'E-commerce • UI/UX Design • Creative',
        'portfolio.items.ubuntu.description': 'Contemporary African fashion e-commerce platform celebrating Ubuntu philosophy through modern designs. Features sophisticated product galleries, cultural storytelling, and seamless shopping experience.',
        'portfolio.items.ubuntu.testimonial': '"Ubuntu Fashion\'s platform perfectly captures our brand\'s essence of African elegance and modern sophistication. The cultural elements integrated with e-commerce functionality are outstanding." - Ubuntu Fashion Team',
        'portfolio.items.ubuntu.completed': 'Completed: May 2024',
        'portfolio.items.luxuria.title': 'Luxuria Furniture E-commerce',
        'portfolio.items.luxuria.category': 'E-commerce • UI/UX Design • Web Development',
        'portfolio.items.luxuria.description': 'Premium furniture e-commerce platform showcasing luxury home furnishings with elegant product displays, 360° views, and sophisticated shopping experience for discerning customers.',
        'portfolio.items.luxuria.testimonial': '"Luxuria\'s e-commerce platform elevated our brand to new heights. The premium design and intuitive shopping experience have increased our online sales by 180% within the first quarter." - Luxuria Furniture Management',
        'portfolio.items.luxuria.completed': 'Completed: March 2024',
        'portfolio.items.atc.title': 'ATC LDA Corporate Website',
        'portfolio.items.atc.category': 'UI/UX Design • Corporate • Web Development',
        'portfolio.items.atc.description': 'Professional corporate website for ATC LDA showcasing business services, company values, and client testimonials. Features modern design with emphasis on trust and professionalism.',
        'portfolio.items.atc.testimonial': '"Our new corporate website has transformed how clients perceive our company. The professional design and clear service presentation have significantly improved our business inquiries." - ATC LDA Management',
        'portfolio.items.atc.completed': 'Completed: April 2024',
        'portfolio.stats.heading': 'Portfolio <span class="gradient-text">Impact Statistics</span>',
        'portfolio.stats.tagline': 'Measurable results from our portfolio projects',
        'portfolio.stats.stat1': 'Average increase in client inquiries',
        'portfolio.stats.stat2': 'Client satisfaction rate',
        'portfolio.stats.stat3': 'Faster loading speeds achieved',
        'portfolio.stats.stat4': 'Sales increase for e-commerce clients',
        'portfolio.tech.heading': 'Technologies <span class="gradient-text">We Master</span>',
        'portfolio.tech.tagline': 'Cutting-edge tools and frameworks powering our portfolio projects',
        'portfolio.tech.frontend.title': 'Frontend Excellence',
        'portfolio.tech.frontend.body': 'React, Next.js, Vue.js, TypeScript, and modern CSS frameworks for exceptional user experiences.',
        'portfolio.tech.backend.title': 'Backend Power',
        'portfolio.tech.backend.body': 'Node.js, Python, databases, and cloud services for robust, scalable applications.',
        'portfolio.tech.design.title': 'Design & UX',
        'portfolio.tech.design.body': 'Responsive design, accessibility standards, and conversion-focused user experiences.',
        'portfolio.cta.heading': 'Ready to Join Our <span class="gradient-text">Success Stories</span>?',
        'portfolio.cta.body': 'Let\'s create something extraordinary together. Your project could be our next portfolio highlight.',
        'portfolio.footer.categoriesTitle': 'Portfolio Categories',
        'portfolio.footer.uiux': 'UI/UX Design',
        'portfolio.footer.web': 'Web Development',
        'portfolio.footer.ecommerce': 'E-commerce',
        'portfolio.footer.corporate': 'Corporate',

        'footer.tagline': 'Premium digital solutions for global businesses.',
        'footer.servicesTitle': 'Services',
        'footer.services': 'Services',
        'footer.ai': 'AI Automation',
        'footer.web': 'Web Development',
        'footer.creative': 'Creative Design',
        'footer.integration': 'Business Integration',
        'footer.companyTitle': 'Company',
        'footer.portfolio': 'Portfolio',
        'footer.about': 'About Us',
        'footer.contact': 'Contact',
        'footer.privacy': 'Privacy Policy',
        'footer.contactTitle': 'Contact Info',
        'footer.copy': '© 2024 Client-First Digital. All rights reserved. | Empowering global businesses with premium digital solutions.',
        'footer.location': '📍 Pretoria, South Africa',

        'form.namePlaceholder': 'Your Name',
        'form.emailPlaceholder': 'Your Email',
        'form.servicePlaceholder': 'Select Service Interest',
        'form.messagePlaceholder': 'Tell us about your project...',
        'form.submit': 'Book Strategy Call',
        'form.option.default': 'Select Service Interest',
        'form.option.ai-automation': 'AI Automation',
        'form.option.web-development': 'Web Development',
        'form.option.creative-design': 'Creative Design',
        'form.option.business-integration': 'Business Integration',
        'form.option.e-commerce': 'E-commerce Solutions',
        'form.option.digital-marketing': 'Digital Marketing'
    },
    'pt-pt': {
        'nav.home': 'Início',
        'nav.services': 'Serviços',
        'nav.portfolio': 'Portfólio',
        'nav.about': 'Sobre',
        'nav.contact': 'Contacto',
        'nav.cta': 'Agendar Consulta',

        'hero.subtitle': 'Soluções Digitais Premium',
        'hero.headingLead': 'Transforme o Seu Negócio com',
        'hero.headingHighlight': 'Automação IA',
        'hero.description': 'Libere o potencial do seu negócio com soluções avançadas de automação IA, desenvolvimento web personalizado e estratégias de marketing digital.',
        'hero.ctaPrimary': 'Explorar Serviços',
        'hero.ctaSecondary': 'Ver Portfólio',

        'hero.slide2.subtitle': 'Agência Líder na África do Sul',
        'hero.slide2.heading': 'Especialistas em <span class="gradient-text">Desenvolvimento Web</span> e Design',
        'hero.slide2.body': 'Criamos websites impressionantes e aplicações web complexas que oferecem experiências digitais excecionais e resultados mensuráveis.',
        'hero.slide2.ctaPrimary': 'Ver Projetos',
        'hero.slide2.ctaSecondary': 'Pedir Orçamento',

        'hero.slide3.subtitle': 'Integração de Sistemas Empresariais',
        'hero.slide3.heading': 'Soluções <span class="gradient-text">Zoho e Microsoft 365</span> Integradas',
        'hero.slide3.body': 'Otimize as operações com integrações especializadas de Zoho CRM, Microsoft 365 e Google Workspace. Aumente a produtividade e a colaboração.',
        'hero.slide3.ctaPrimary': 'Saber Mais',
        'hero.slide3.ctaSecondary': 'Marcar Consulta',

        'index.core.headingLead': 'Os Nossos',
        'index.core.headingHighlight': 'Serviços Principais',
        'index.core.tagline': 'Soluções digitais abrangentes feitas à medida para empresas sul-africanas',
        'index.core.ai.title': 'Automação IA',
        'index.core.ai.body': 'Transforme os seus processos com soluções inteligentes que poupam tempo, reduzem custos e eliminam tarefas manuais.',
        'index.core.ai.point1': 'Soluções de IA personalizadas',
        'index.core.ai.point2': 'Automação de fluxos de trabalho',
        'index.core.ai.point3': 'Otimização de processos',
        'index.core.ai.point4': 'Resultados focados em ROI',
        'index.core.web.title': 'Desenvolvimento Web',
        'index.core.web.body': 'Websites profissionais e aplicações web construídas com tecnologias modernas como Next.js, React e princípios responsivos.',
        'index.core.web.point1': 'Desenvolvimento Next.js & React',
        'index.core.web.point2': 'Design responsivo',
        'index.core.web.point3': 'Otimização de performance',
        'index.core.web.point4': 'Estrutura preparada para SEO',
        'index.core.creative.title': 'Design Criativo',
        'index.core.creative.body': 'Identidades de marca e designs UI/UX que cativam o seu público e impulsionam conversões em todas as plataformas.',
        'index.core.creative.point1': 'Design de identidade de marca',
        'index.core.creative.point2': 'Design UI/UX',
        'index.core.creative.point3': 'Storytelling visual',
        'index.core.creative.point4': 'Otimização de conversão',

        'index.why.heading': 'Porque Escolher a <span class="gradient-text">Client-First Digital</span>?',
        'index.why.intro': 'Somos mais do que uma agência digital. Somos o seu parceiro estratégico na transformação digital, comprometidos em gerar resultados excepcionais.',
        'index.why.point1.title': 'Histórico Comprovado',
        'index.why.point1.body': 'Mais de 500 projetos bem-sucedidos em diversos setores',
        'index.why.point2.title': 'Tecnologia de Ponta',
        'index.why.point2.body': 'Ferramentas e frameworks mais recentes para máximo desempenho',
        'index.why.point3.title': 'Suporte Premium 24/7',
        'index.why.point3.body': 'Manutenção e otimização contínuas, a qualquer hora',
        'index.why.statsTitle': 'As Nossas Métricas de Sucesso',
        'index.why.stat1': 'Projetos Concluídos',
        'index.why.stat2': 'Satisfação dos Clientes',
        'index.why.stat3': 'Anos de Experiência',
        'index.why.stat4': 'Suporte Disponível',

        'index.process.headingLead': 'O Nosso',
        'index.process.headingHighlight': 'Processo Comprovado',
        'index.process.tagline': 'Do planeamento à implementação, seguimos uma abordagem sistemática que garante sucesso',
        'index.process.step1.title': '1. Descoberta',
        'index.process.step1.body': 'Compreendemos a fundo o seu negócio, objetivos e desafios para criar uma estratégia à medida.',
        'index.process.step2.title': '2. Design',
        'index.process.step2.body': 'A nossa equipa cria designs e experiências cativantes alinhadas com a sua marca.',
        'index.process.step3.title': '3. Desenvolvimento',
        'index.process.step3.body': 'Construímos soluções robustas e escaláveis com tecnologias de ponta.',
        'index.process.step4.title': '4. Lançamento',
        'index.process.step4.body': 'Lançamos a solução e fornecemos suporte contínuo para garantir crescimento sustentável.',

        'index.contact.heading': 'Pronto para <span class="gradient-text">Transformar</span> o Seu Negócio?',
        'index.contact.tagline': 'Vamos conversar sobre como as nossas soluções digitais premium podem ajudar a alcançar os seus objetivos e superar a concorrência.',
        'index.contact.whatsappLabel': 'WhatsApp:',
        'index.contact.emailLabel': 'Email:',
        'index.contact.locationLabel': 'Localização:',
        'index.contact.locationValue': 'Pretória, África do Sul',
        'index.contact.formTitle': 'Agende a Sua Sessão Estratégica Gratuita',

        'cta.learnMore': 'Saber Mais',
        'cta.getStarted': 'Começar Agora',
        'cta.getQuote': 'Obter Orçamento',
        'cta.startProject': 'Iniciar Projeto',
        'cta.discussProject': 'Discutir Projeto',
        'cta.startStore': 'Lançar Loja',
        'cta.growBusiness': 'Fazer Crescer o Negócio',
        'cta.analyzeData': 'Analisar Dados',
        'cta.migrateNow': 'Migrar Agora',
        'cta.bookConsultation': 'Agendar Consulta Gratuita',
        'cta.viewWork': 'Ver Nosso Trabalho',
        'cta.viewProjects': 'Ver Projetos',
        'cta.ourServices': 'Os Nossos Serviços',
        'cta.livePreview': 'Ver Demonstração',
        'cta.hireUs': 'Contratar Equipa',
        'cta.getCRM': 'Obter CRM',
        'cta.buildSimilar': 'Construir Similar',
        'cta.createPortfolio': 'Criar Portefólio',
        'cta.startEcommerce': 'Iniciar E-commerce',
        'cta.viewProject': 'Ver Projeto',
        'cta.fashionEcommerce': 'E-commerce de Moda',
        'cta.furnitureStore': 'Loja de Mobiliário',
        'cta.corporateSite': 'Site Corporativo',
        'cta.viewServices': 'Ver Serviços',

        // Página de Serviços
        'services.hero.subtitle': 'Serviços Digitais Premium',
        'services.hero.heading': 'Soluções <span class="gradient-text">Digitais Completas</span> para o Seu Negócio',
        'services.hero.description': 'Da automação IA ao desenvolvimento web, entregamos serviços de ponta que transformam empresas a nível global e produzem resultados mensuráveis.',
        'services.core.title': 'Serviços Digitais Principais',
        'services.core.ai.title': 'Automação IA',
        'services.core.ai.body': 'Transforme os seus processos com soluções inteligentes que eliminam tarefas manuais, reduzem custos operacionais e aumentam a produtividade até 300%.',
        'services.core.ai.point1': 'Automação personalizada de fluxos de trabalho com IA',
        'services.core.ai.point2': 'Processamento inteligente de documentos',
        'services.core.ai.point3': 'Chatbots de atendimento automatizado',
        'services.core.ai.point4': 'Automação de análise e relatórios de dados',
        'services.core.ai.point5': 'Consultoria de otimização de processos',
        'services.core.ai.point6': 'Implementação focada no ROI',
        'services.core.ai.price': 'Desde R15 000',
        'services.core.ai.timeline': 'Entrega em 2-6 semanas',
        'services.core.web.title': 'Desenvolvimento Web',
        'services.core.web.body': 'Websites e aplicações web profissionais construídos com tecnologias modernas como Next.js e React, entregando desempenho excecional e grandes experiências de utilizador.',
        'services.core.web.point1': 'Desenvolvimento Next.js & React',
        'services.core.web.point2': 'Design responsivo mobile-first',
        'services.core.web.point3': 'Otimização de SEO e velocidade',
        'services.core.web.point4': 'Progressive Web Apps (PWA)',
        'services.core.web.point5': 'Integração de CMS personalizado',
        'services.core.web.point6': 'Monitorização de performance e analytics',
        'services.core.web.price': 'Desde R8 000',
        'services.core.web.timeline': 'Entrega em 1-4 semanas',
        'services.core.creative.title': 'Design Criativo',
        'services.core.creative.body': 'Identidades de marca e designs UI/UX impressionantes que cativam o seu público, aumentam conversões e posicionam a sua marca como líder no mercado.',
        'services.core.creative.point1': 'Pacotes completos de identidade visual',
        'services.core.creative.point2': 'Design UI/UX para web e mobile',
        'services.core.creative.point3': 'Design de logótipo e guias visuais',
        'services.core.creative.point4': 'Design de materiais de marketing',
        'services.core.creative.point5': 'Pesquisa e testes com utilizadores',
        'services.core.creative.point6': 'Estratégias de design orientadas para conversão',
        'services.core.creative.price': 'Desde R5 000',
        'services.core.creative.timeline': 'Entrega em 1-3 semanas',
        'services.core.support.title': 'Suporte Premium',
        'services.core.support.body': 'Manutenção, otimização e suporte 24/7 para garantir que os seus ativos digitais funcionam na perfeição e entregam resultados consistentes.',
        'services.core.support.point1': 'Suporte técnico 24/7',
        'services.core.support.point2': 'Atualizações de segurança e backups',
        'services.core.support.point3': 'Otimização de performance',
        'services.core.support.point4': 'Atualizações de conteúdo e manutenção',
        'services.core.support.point5': 'Relatórios analíticos mensais',
        'services.core.support.point6': 'Tempos de resposta prioritários',
        'services.core.support.price': 'Desde R2 500/mês',
        'services.core.support.timeline': 'Serviço contínuo',
        'services.integration.title': 'Integração de Sistemas Empresariais',
        'services.integration.zoho.title': 'Ecossistema Zoho',
        'services.integration.zoho.body': 'Implementação completa do conjunto Zoho, agilizando operações com CRM, contabilidade, gestão de projetos e automação de marketing.',
        'services.integration.zoho.point1': 'Configuração e personalização do Zoho CRM',
        'services.integration.zoho.point2': 'Integração contabilística com Zoho Books',
        'services.integration.zoho.point3': 'Aplicações personalizadas com Zoho Creator',
        'services.integration.zoho.point4': 'Email marketing com Zoho Campaigns',
        'services.integration.zoho.point5': 'Sistema de suporte Zoho Desk',
        'services.integration.zoho.point6': 'Sincronização de dados entre plataformas',
        'services.integration.zoho.price': 'Desde R12 000',
        'services.integration.zoho.timeline': 'Implementação em 2-4 semanas',
        'services.integration.google.title': 'Google Workspace',
        'services.integration.google.body': 'Configuração e otimização profissional do Google Workspace, melhorando a colaboração da equipa com Gmail, Drive, Meet, Calendar e recursos avançados de segurança.',
        'services.integration.google.point1': 'Configuração profissional de Gmail e migração',
        'services.integration.google.point2': 'Organização do Google Drive e permissões',
        'services.integration.google.point3': 'Configuração de videoconferência no Google Meet',
        'services.integration.google.point4': 'Gestão de calendários partilhados',
        'services.integration.google.point5': 'Configuração avançada de segurança',
        'services.integration.google.point6': 'Formação da equipa e boas práticas',
        'services.integration.google.price': 'Desde R6 000',
        'services.integration.google.timeline': 'Configuração em 1-2 semanas',
        'services.integration.microsoft.title': 'Ecossistema Microsoft 365',
        'services.integration.microsoft.body': 'Implementação completa do Microsoft 365 com Teams, SharePoint, Power Platform e ferramentas avançadas de produtividade para colaboração empresarial.',
        'services.integration.microsoft.point1': 'Configuração e otimização do Microsoft Teams',
        'services.integration.microsoft.point2': 'Desenvolvimento de intranet SharePoint',
        'services.integration.microsoft.point3': 'Automação com Power Platform',
        'services.integration.microsoft.point4': 'Configuração de email Exchange',
        'services.integration.microsoft.point5': 'Configuração empresarial do OneDrive',
        'services.integration.microsoft.point6': 'Conformidade e segurança avançadas',
        'services.integration.microsoft.price': 'Desde R10 000',
        'services.integration.microsoft.timeline': 'Implementação em 2-3 semanas',
        'services.integration.custom.title': 'Integrações Personalizadas',
        'services.integration.custom.body': 'Conexões API perfeitas entre diferentes sistemas empresariais, criando fluxos unificados que eliminam silos de dados e melhoram a eficiência operacional.',
        'services.integration.custom.point1': 'Desenvolvimento e integração de REST APIs',
        'services.integration.custom.point2': 'Sincronização de bases de dados',
        'services.integration.custom.point3': 'Integrações com serviços de terceiros',
        'services.integration.custom.point4': 'Partilha de dados em tempo real',
        'services.integration.custom.point5': 'Disparadores automáticos de workflow',
        'services.integration.custom.point6': 'Desenvolvimento de dashboards personalizados',
        'services.integration.custom.price': 'Desde R20 000',
        'services.integration.custom.timeline': 'Entrega em 3-6 semanas',
        'services.additional.title': 'Serviços Adicionais',
        'services.additional.ecommerce.title': 'Soluções de E-commerce',
        'services.additional.ecommerce.body': 'Desenvolvimento completo de lojas online com pagamentos seguros, gestão de inventário e otimização de conversões para maximizar as suas vendas.',
        'services.additional.ecommerce.point1': 'Desenvolvimento de e-commerce personalizado',
        'services.additional.ecommerce.point2': 'Integração de gateways de pagamento',
        'services.additional.ecommerce.point3': 'Sistemas de gestão de inventário',
        'services.additional.ecommerce.point4': 'Gestão de encomendas e logística',
        'services.additional.ecommerce.point5': 'Experiência de compra otimizada para mobile',
        'services.additional.ecommerce.point6': 'Otimização da taxa de conversão',
        'services.additional.ecommerce.price': 'Desde R15 000',
        'services.additional.ecommerce.timeline': 'Entrega em 3-6 semanas',
        'services.additional.marketing.title': 'Marketing Digital',
        'services.additional.marketing.body': 'Estratégias completas de marketing digital com SEO, redes sociais e conteúdo para aumentar a visibilidade online e gerar leads qualificados.',
        'services.additional.marketing.point1': 'Otimização para motores de busca (SEO)',
        'services.additional.marketing.point2': 'Gestão de redes sociais',
        'services.additional.marketing.point3': 'Estratégias de marketing de conteúdo',
        'services.additional.marketing.point4': 'Publicidade pay-per-click (PPC)',
        'services.additional.marketing.point5': 'Campanhas de email marketing',
        'services.additional.marketing.point6': 'Monitorização de performance e analytics',
        'services.additional.marketing.price': 'Desde R8 000/mês',
        'services.additional.marketing.timeline': 'Campanhas contínuas',
        'services.additional.analytics.title': 'Análise de Dados',
        'services.additional.analytics.body': 'Soluções avançadas de business intelligence e reporting que transformam dados em insights acionáveis para decisões informadas.',
        'services.additional.analytics.point1': 'Desenvolvimento de dashboards personalizados',
        'services.additional.analytics.point2': 'Relatórios de business intelligence',
        'services.additional.analytics.point3': 'Visualização de dados e insights',
        'services.additional.analytics.point4': 'Sistemas automáticos de reporting',
        'services.additional.analytics.point5': 'Acompanhamento de KPIs de performance',
        'services.additional.analytics.point6': 'Modelos de análise preditiva',
        'services.additional.analytics.price': 'Desde R12 000',
        'services.additional.analytics.timeline': 'Implementação em 2-4 semanas',
        'services.additional.cloud.title': 'Migração para a Cloud',
        'services.additional.cloud.body': 'Migração sem interrupções dos seus sistemas para plataformas cloud, melhorando acessibilidade, segurança e escalabilidade enquanto reduz custos.',
        'services.additional.cloud.point1': 'Estratégia e planeamento de cloud',
        'services.additional.cloud.point2': 'Migração de dados e segurança',
        'services.additional.cloud.point3': 'Otimização de infraestrutura',
        'services.additional.cloud.point4': 'Estratégias de otimização de custos',
        'services.additional.cloud.point5': 'Formação e suporte à equipa',
        'services.additional.cloud.point6': 'Monitorização e manutenção 24/7',
        'services.additional.cloud.price': 'Desde R18 000',
        'services.additional.cloud.timeline': 'Migração em 4-8 semanas',
        'services.metrics.heading': 'Os Nossos <span class="gradient-text">Indicadores de Sucesso</span>',
        'services.metrics.tagline': 'Resultados mensuráveis que importam para o seu negócio',
        'services.metrics.stat1': 'Aumento médio de produtividade com automação IA',
        'services.metrics.stat2': 'Velocidades de carregamento mais rápidas em média',
        'services.metrics.stat3': 'Aumento médio nas taxas de conversão',
        'services.metrics.stat4': 'Redução média de custos através de automação',
        'services.cta.heading': 'Pronto para Transformar o Seu Negócio?',
        'services.cta.body': 'Vamos conversar sobre como os nossos serviços premium podem ajudar a alcançar os seus objetivos',

        // Página de Portefólio
        'portfolio.hero1.subtitle': 'O Nosso Portefólio Premium',
        'portfolio.hero1.heading': 'Experiências Digitais <span class="gradient-text">Excecionais</span> que Criámos',
        'portfolio.hero1.body': 'Explore a nossa coleção de websites, aplicações e soluções digitais premiadas que transformaram negócios em todo o mundo.',
        'portfolio.hero2.subtitle': 'Designs Premiados',
        'portfolio.hero2.heading': 'A Transformar <span class="gradient-text">Negócios Globais</span> Através do Design',
        'portfolio.hero2.body': 'De plataformas de luxo a websites corporativos, o nosso portefólio apresenta soluções inovadoras que geram resultados reais e envolvimento dos utilizadores.',
        'portfolio.filter.all': 'Todos os Projetos',
        'portfolio.filter.uiux': 'Design UI/UX',
        'portfolio.filter.web': 'Desenvolvimento Web',
        'portfolio.filter.ecommerce': 'E-commerce',
        'portfolio.filter.corporate': 'Corporativo',
        'portfolio.filter.creative': 'Criativo',
        'portfolio.items.eternal.title': 'Plataforma Eternal Moments Wedding',
        'portfolio.items.eternal.category': 'Design UI/UX • Criativo • Desenvolvimento Web',
        'portfolio.items.eternal.description': 'Plataforma de planeamento de casamentos de luxo que celebra o amor em todas as culturas. Inclui design elegante, guias culturais e ferramentas completas de planeamento.',
        'portfolio.items.eternal.testimonial': '"A plataforma Eternal Moments capta na perfeição a essência do planeamento de casamentos de luxo. As funcionalidades culturais são excecionais e ajudaram-nos a servir casais diversos com excelência." - Wedding Planner Client',
        'portfolio.items.eternal.completed': 'Concluído: Outubro 2024',
        'portfolio.items.angbu.title': 'Sistema CRM ANGBU',
        'portfolio.items.angbu.category': 'Design UI/UX • Desenvolvimento Web • Corporativo',
        'portfolio.items.angbu.description': 'Plataforma completa de gestão educativa para o Angbu Training Centre com gestão de alunos, acompanhamento de cursos e suporte bilingue para programas de inglês.',
        'portfolio.items.angbu.testimonial': '"O CRM ANGBU revolucionou a forma como gerimos as nossas aulas de inglês. A interface bilingue e o acompanhamento de alunos são exatamente o que precisávamos para o nosso centro em crescimento." - Gestão ATC',
        'portfolio.items.angbu.completed': 'Concluído: Setembro 2024',
        'portfolio.items.ysam.title': 'YSAM Luxury Car Rental',
        'portfolio.items.ysam.category': 'E-commerce • Design UI/UX • Desenvolvimento Web',
        'portfolio.items.ysam.description': 'Serviço premium de aluguer de automóveis especializado em veículos Toyota Land Cruiser para transporte executivo, casamentos e serviços VIP em Cabinda com motoristas profissionais.',
        'portfolio.items.ysam.testimonial': '"O website da YSAM representa na perfeição o nosso serviço de luxo. O design elegante e a estrutura de preços clara aumentaram significativamente as reservas online." - Direção YSAM',
        'portfolio.items.ysam.completed': 'Concluído: Agosto 2024',
        'portfolio.items.tebogo.title': 'Website Portefólio de Tebogo',
        'portfolio.items.tebogo.category': 'Design UI/UX • Criativo • Desenvolvimento Web',
        'portfolio.items.tebogo.description': 'Website portefólio moderno e profissional que destaca trabalhos criativos e competências. Inclui animações fluidas, design responsivo e apresentação elegante de projetos.',
        'portfolio.items.tebogo.testimonial': '"O meu novo portefólio mudou o rumo da minha carreira freelance. O design profissional e a experiência suave ajudaram-me a conquistar vários clientes de alto valor." - Tebogo, Profissional Criativo',
        'portfolio.items.tebogo.completed': 'Concluído: Julho 2024',
        'portfolio.items.ecobean.title': 'Eco Bean Products',
        'portfolio.items.ecobean.category': 'Design UI/UX • E-commerce • Desenvolvimento Web • Criativo',
        'portfolio.items.ecobean.description': 'Mostruário sustentável de produtos com cafés ecológicos e artigos relacionados. Design moderno e limpo que destaca a consciência ambiental e a qualidade dos produtos.',
        'portfolio.items.ecobean.testimonial': '"O mostruário Eco Bean representa lindamente o nosso compromisso com a sustentabilidade. O design limpo e a navegação intuitiva aumentaram em 200% os pedidos de informação." - Fundador Eco Bean',
        'portfolio.items.ecobean.completed': 'Concluído: Junho 2024',
        'portfolio.items.ubuntu.title': 'Plataforma Ubuntu Fashion',
        'portfolio.items.ubuntu.category': 'E-commerce • Design UI/UX • Criativo',
        'portfolio.items.ubuntu.description': 'Plataforma de moda africana contemporânea que celebra a filosofia Ubuntu. Inclui galerias sofisticadas, storytelling cultural e experiência de compra fluida.',
        'portfolio.items.ubuntu.testimonial': '"A plataforma Ubuntu Fashion capta a essência da nossa marca de elegância africana com sofisticação moderna. Os elementos culturais integrados com o e-commerce são excecionais." - Equipa Ubuntu Fashion',
        'portfolio.items.ubuntu.completed': 'Concluído: Maio 2024',
        'portfolio.items.luxuria.title': 'Luxuria Furniture E-commerce',
        'portfolio.items.luxuria.category': 'E-commerce • Design UI/UX • Desenvolvimento Web',
        'portfolio.items.luxuria.description': 'Plataforma premium de mobiliário que apresenta peças de luxo com galerias elegantes, vistas a 360° e experiência de compra sofisticada para clientes exigentes.',
        'portfolio.items.luxuria.testimonial': '"A plataforma e-commerce da Luxuria elevou a nossa marca a um novo nível. O design premium e a experiência intuitiva aumentaram as vendas online em 180% no primeiro trimestre." - Gestão Luxuria Furniture',
        'portfolio.items.luxuria.completed': 'Concluído: Março 2024',
        'portfolio.items.atc.title': 'Website Corporativo ATC LDA',
        'portfolio.items.atc.category': 'Design UI/UX • Corporativo • Desenvolvimento Web',
        'portfolio.items.atc.description': 'Website corporativo profissional para a ATC LDA que destaca serviços, valores e testemunhos. Design moderno com foco em confiança e profissionalismo.',
        'portfolio.items.atc.testimonial': '"O novo website corporativo transformou a perceção dos nossos clientes. O design profissional e a apresentação clara dos serviços melhoraram muito os pedidos comerciais." - Gestão ATC LDA',
        'portfolio.items.atc.completed': 'Concluído: Abril 2024',
        'portfolio.stats.heading': 'Estatísticas de Impacto do Portefólio',
        'portfolio.stats.tagline': 'Resultados mensuráveis dos nossos projetos',
        'portfolio.stats.stat1': 'Aumento médio de pedidos de clientes',
        'portfolio.stats.stat2': 'Taxa de satisfação dos clientes',
        'portfolio.stats.stat3': 'Velocidades de carregamento até 3x mais rápidas',
        'portfolio.stats.stat4': 'Aumento de vendas para clientes de e-commerce',
        'portfolio.tech.heading': 'Tecnologias <span class="gradient-text">que Dominamos</span>',
        'portfolio.tech.tagline': 'Ferramentas e frameworks de ponta que alimentam os nossos projetos',
        'portfolio.tech.frontend.title': 'Excelência em Frontend',
        'portfolio.tech.frontend.body': 'React, Next.js, Vue.js, TypeScript e frameworks CSS modernos para experiências de utilizador excecionais.',
        'portfolio.tech.backend.title': 'Potência de Backend',
        'portfolio.tech.backend.body': 'Node.js, Python, bases de dados e serviços cloud para aplicações robustas e escaláveis.',
        'portfolio.tech.design.title': 'Design & UX',
        'portfolio.tech.design.body': 'Design responsivo, padrões de acessibilidade e experiências focadas em conversão.',
        'portfolio.cta.heading': 'Pronto para Fazer Parte das Nossas <span class="gradient-text">Histórias de Sucesso</span>?',
        'portfolio.cta.body': 'Criemos algo extraordinário em conjunto. O seu projeto pode ser o próximo destaque do nosso portefólio.',
        'portfolio.footer.categoriesTitle': 'Categorias do Portefólio',
        'portfolio.footer.uiux': 'Design UI/UX',
        'portfolio.footer.web': 'Desenvolvimento Web',
        'portfolio.footer.ecommerce': 'E-commerce',
        'portfolio.footer.corporate': 'Corporativo',

        'footer.tagline': 'Soluções digitais premium para empresas globais.',
        'footer.servicesTitle': 'Serviços',
        'footer.services': 'Serviços',
        'footer.ai': 'Automação IA',
        'footer.web': 'Desenvolvimento Web',
        'footer.creative': 'Design Criativo',
        'footer.integration': 'Integração Empresarial',
        'footer.companyTitle': 'Empresa',
        'footer.portfolio': 'Portfólio',
        'footer.about': 'Sobre Nós',
        'footer.contact': 'Contacto',
        'footer.privacy': 'Política de Privacidade',
        'footer.contactTitle': 'Informações de Contacto',
        'footer.copy': '© 2024 Client-First Digital. Todos os direitos reservados. | A potenciar empresas globais com soluções digitais premium.',
        'footer.location': '📍 Pretória, África do Sul',

        'form.namePlaceholder': 'O Seu Nome',
        'form.emailPlaceholder': 'O Seu Email',
        'form.servicePlaceholder': 'Selecione o Serviço',
        'form.messagePlaceholder': 'Conte-nos sobre o seu projeto...',
        'form.submit': 'Agendar Consulta',
        'form.option.default': 'Selecione o Serviço',
        'form.option.ai-automation': 'Automação IA',
        'form.option.web-development': 'Desenvolvimento Web',
        'form.option.creative-design': 'Design Criativo',
        'form.option.business-integration': 'Integração Empresarial',
        'form.option.e-commerce': 'Soluções de E-commerce',
        'form.option.digital-marketing': 'Marketing Digital'
    }
};

function translateContent(lang) {
    const dictionary = translations[lang];
    if (!dictionary) return;

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (!key) return;
        const value = dictionary[key];
        if (value === undefined) return;

        if (element.dataset.translateHtml === 'true') {
            element.innerHTML = value;
        } else {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (!key) return;
        const value = dictionary[key];
        if (value === undefined) return;
        element.placeholder = value;
    });
}

function updateLanguageToggleLabels(lang) {
    const toggles = document.querySelectorAll('.language-toggle');
    toggles.forEach(toggle => {
        toggle.textContent = lang === 'pt-pt' ? 'EN' : 'PT';
    });
}

// Load saved language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.lang = savedLang;
    updateLanguageToggleLabels(savedLang);
    translateContent(savedLang);
});

// Export functions for use in other scripts if needed
window.ClientFirst = {
    navigateWithTransition,
    initCarousel,
    initPortfolioTabs,
    initThemeToggle,
    toggleLanguage
};
