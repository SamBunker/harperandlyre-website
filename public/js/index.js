// ===== SMOOTH SCROLLING =====
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

// ===== NAVBAR BACKGROUND ON SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(44, 24, 16, 0.98), rgba(44, 24, 16, 1))';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, rgba(44, 24, 16, 0.95), rgba(44, 24, 16, 0.98))';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    }

    lastScroll = currentScroll;
});

// ===== GALLERY FUNCTIONALITY =====
const galleryThumbs = document.querySelectorAll('.thumb');
const galleryMain = document.querySelector('.gallery-main img');

// Array of images for the gallery
const galleryImages = [
    '/img/harper-idle.gif',
    '/img/harper-idle.gif',
    '/img/harper-idle.gif',
    '/img/harper-idle.gif'
];

galleryThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        // Remove active class from all thumbs
        galleryThumbs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked thumb
        thumb.classList.add('active');

        // Change main image with fade effect
        galleryMain.style.opacity = '0';

        setTimeout(() => {
            galleryMain.src = galleryImages[index];
            galleryMain.style.opacity = '1';
        }, 300);
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.character-card, .toolkit-card, .henchman-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== TOOLKIT VIDEO AUTOPLAY ON HOVER =====
const toolkitCards = document.querySelectorAll('.toolkit-card');

toolkitCards.forEach(card => {
    const video = card.querySelector('video');

    if (video) {
        let playPromise = null;

        card.addEventListener('mouseenter', () => {
            playPromise = video.play();
        });

        card.addEventListener('mouseleave', () => {
            // Wait for play promise to resolve before pausing
            if (playPromise !== null) {
                playPromise.then(() => {
                    video.pause();
                    video.currentTime = 0;
                }).catch(error => {
                    // Play was interrupted, ignore error
                    console.debug('Video play interrupted:', error);
                });
                playPromise = null;
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);

    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s linear infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);

        console.log('🎮 N64 nostalgia activated! 🎮');
    }
});

// ===== MOBILE MENU TOGGLE (IF NEEDED) =====
// This is a placeholder for future mobile menu implementation
const createMobileMenu = () => {
    // Mobile menu functionality can be added here
    console.log('Mobile menu ready for implementation');
};

// Initialize mobile menu if screen is small
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// ===== PERFORMANCE: LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SCROLL TO TOP BUTTON (OPTIONAL) =====
const createScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'all';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1) translateY(-3px)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1) translateY(0)';
    });
};

// Initialize scroll to top button
createScrollToTop();

// ===== HARPER'S JOURNAL WORLDS FUNCTIONALITY =====
// Note: Worlds data is rendered server-side via Handlebars for security
// This just handles the click interactions on pre-rendered content

document.addEventListener('DOMContentLoaded', () => {
    const worldListItems = document.querySelectorAll('.world-list-item');
    const worldContent = document.getElementById('worldContent');

    // Set first discovered world as active
    const firstDiscovered = document.querySelector('.world-list-item[data-discovered="true"]');
    if (firstDiscovered) {
        firstDiscovered.classList.add('active');
    }

    worldListItems.forEach(item => {
        // Only add click handlers to discovered worlds
        const isDiscovered = item.dataset.discovered === 'true';

        if (isDiscovered) {
            item.addEventListener('click', function() {
                // Remove active class from all items
                worldListItems.forEach(i => i.classList.remove('active'));

                // Add active class to clicked item
                this.classList.add('active');

                // Get world data from data attributes
                const worldName = this.dataset.name;
                const worldDescription = this.dataset.description;
                const worldImage = this.dataset.image;

                // Update left panel content
                worldContent.innerHTML = `
                    <img src="${worldImage}" alt="${worldName}" class="world-content-image">
                    <p class="world-content-text">${worldDescription}</p>
                `;
            });
        }
    });
});

// ===== STEAM NEWS FUNCTIONALITY =====
let newsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

async function fetchSteamNews() {
    const now = Date.now();

    // Use cache if it's less than 15 minutes old
    if (newsCache && (now - lastFetchTime) < CACHE_DURATION) {
        return newsCache;
    }

    try {
        const response = await fetch('/api/steam-news?count=6');
        const data = await response.json();

        newsCache = data;
        lastFetchTime = now;

        return data;
    } catch (error) {
        console.error('Error fetching Steam news:', error);
        return null;
    }
}

function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== MAGICAL POCUS NEWS FUNCTIONALITY =====
function createPocusScrollItem(newsItem, index) {
    const item = document.createElement('div');
    item.className = 'scroll-news-item';
    if (index === 0) item.classList.add('active');

    item.innerHTML = `
        <div class="scroll-item-date">${formatDate(newsItem.date)}</div>
        <div class="scroll-item-title">${newsItem.title}</div>
    `;

    item.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.scroll-news-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Open the news URL in a new tab
        window.open(newsItem.url, '_blank');
    });

    return item;
}

async function displayPocusNews() {
    const pocusNewsList = document.getElementById('pocusNewsList');

    const data = await fetchSteamNews();

    if (!data || !data.appnews || !data.appnews.newsitems) {
        pocusNewsList.innerHTML = '<div class="news-loading"><p>The magical energies are unstable...</p></div>';
        return;
    }

    const newsItems = data.appnews.newsitems;

    if (newsItems.length === 0) {
        pocusNewsList.innerHTML = '<div class="news-loading"><p>No magical chronicles yet...</p></div>';
        return;
    }

    // Clear loading message
    pocusNewsList.innerHTML = '';

    // Create and append scroll items
    newsItems.forEach((newsItem, index) => {
        const scrollItem = createPocusScrollItem(newsItem, index);
        pocusNewsList.appendChild(scrollItem);
    });
}

// Load Pocus news on page load
displayPocusNews();

// Alternative to setInterval: Refresh when user returns to tab or scrolls to news section
// This avoids Cloudflare rate limiting while keeping content fresh

// Refresh when user returns to the page (tab becomes visible)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const now = Date.now();
        // Only refresh if cache is older than 15 minutes
        if ((now - lastFetchTime) >= CACHE_DURATION) {
            displayPocusNews();
        }
    }
});

// Refresh when user scrolls to Pocus news section (one-time check per session)
let newsRefreshedOnScroll = false;
const pocusNewsSection = document.getElementById('pocus-news');

if (pocusNewsSection) {
    const newsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !newsRefreshedOnScroll) {
                const now = Date.now();
                if ((now - lastFetchTime) >= CACHE_DURATION) {
                    displayPocusNews();
                    newsRefreshedOnScroll = true;
                }
            }
        });
    }, { threshold: 0.1 });

    newsObserver.observe(pocusNewsSection);
}

// ===== BAMBOO HEIGHTS THEME - FALLING LEAVES =====
function createBambooLeaves() {
    const container = document.getElementById('bambooLeaves');
    if (!container) return;

    const numberOfLeaves = 15;

    for (let i = 0; i < numberOfLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'bamboo-leaf';

        // Random horizontal position
        leaf.style.left = Math.random() * 100 + '%';

        // Random animation duration (slower = more peaceful)
        const duration = 10 + Math.random() * 10; // 10-20 seconds
        leaf.style.animationDuration = duration + 's';

        // Random delay for staggered effect
        leaf.style.animationDelay = Math.random() * 5 + 's';

        // Slight size variation
        const scale = 0.8 + Math.random() * 0.4;
        leaf.style.transform = `scale(${scale})`;

        container.appendChild(leaf);
    }
}

// Initialize bamboo leaves on page load
if (document.getElementById('bambooLeaves')) {
    createBambooLeaves();
}

// ===== TRIPTRAP TOMB THEME - SAND PARTICLES =====
function createSandParticles() {
    const container = document.getElementById('sandParticles');
    if (!container) return;

    const numberOfParticles = 30;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'sand-particle';

        // Random vertical starting position
        particle.style.top = Math.random() * 100 + '%';

        // Random animation duration (creates wind effect)
        const duration = 15 + Math.random() * 15; // 15-30 seconds
        particle.style.animationDuration = duration + 's';

        // Random delay
        particle.style.animationDelay = Math.random() * 10 + 's';

        // Slight size variation
        const size = 2 + Math.random() * 3; // 2-5px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        container.appendChild(particle);
    }
}

// Initialize sand particles on page load
if (document.getElementById('sandParticles')) {
    createSandParticles();
}

// ===== DINOHATTAN THEME - TAR BUBBLES =====
function createTarBubbles() {
    const container = document.getElementById('tarBubbles');
    if (!container) return;

    const numberOfBubbles = 12;

    for (let i = 0; i < numberOfBubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'tar-bubble';

        // Random horizontal position
        bubble.style.left = Math.random() * 100 + '%';

        // Random animation duration (slow and heavy like tar)
        const duration = 8 + Math.random() * 8; // 8-16 seconds
        bubble.style.animationDuration = duration + 's';

        // Random delay for staggered bubbles
        bubble.style.animationDelay = Math.random() * 8 + 's';

        // Size variation (tar bubbles vary in size)
        const size = 20 + Math.random() * 30; // 20-50px
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';

        container.appendChild(bubble);
    }
}

// Initialize tar bubbles on page load
if (document.getElementById('tarBubbles')) {
    createTarBubbles();
}

// ===== SNOWSHOW CITY THEME - SNOW PARTICLES =====
function createSnowParticles() {
    const container = document.getElementById('snowParticles');
    if (!container) return;

    const numberOfParticles = 50;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'snow-particle';

        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';

        // Random animation duration (different fall speeds)
        const duration = 8 + Math.random() * 8; // 8-16 seconds
        particle.style.animationDuration = duration + 's';

        // Random delay for staggered snowfall
        particle.style.animationDelay = Math.random() * 8 + 's';

        // Size variation (snowflakes vary in size)
        const size = 4 + Math.random() * 8; // 4-12px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        container.appendChild(particle);
    }
}

// Initialize snow particles on page load
if (document.getElementById('snowParticles')) {
    createSnowParticles();
}

console.log('🎵 Harper and Lyre website loaded! 🎮');
