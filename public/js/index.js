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
const galleryMainVideo = document.querySelector('.gallery-main video');
const introContent = document.getElementById('introContent');
const characterTitle = document.getElementById('characterTitle');
const characterDescription = document.getElementById('characterDescription');

let currentCharacter = null; // Track current character

galleryThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
        // Get profile data from data attributes
        const character = thumb.dataset.character;
        const title = thumb.dataset.title;
        const description = thumb.dataset.description;
        const mainImageWebm = thumb.dataset.mainImageWebm;
        const mainImageMp4 = thumb.dataset.mainImageMp4;

        const isCharacterSwitch = currentCharacter !== character;

        // Remove active class from all thumbs
        galleryThumbs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked thumb
        thumb.classList.add('active');

        // Change main video with fade effect
        galleryMainVideo.style.opacity = '0';

        setTimeout(() => {
            // Update video sources
            const webmSource = galleryMainVideo.querySelector('source[type="video/webm"]');
            const mp4Source = galleryMainVideo.querySelector('source[type="video/mp4"]');

            webmSource.src = mainImageWebm;
            mp4Source.src = mainImageMp4;

            // Reload video to apply new sources
            galleryMainVideo.load();
            galleryMainVideo.play();

            // Add character class to gallery video for specific styling
            galleryMainVideo.className = 'gallery-image active';
            if (character === 'lyre') {
                galleryMainVideo.classList.add('lyre-character');
            }

            galleryMainVideo.style.opacity = '1';

            // Only update text if switching between characters
            if (isCharacterSwitch) {
                const introText = document.getElementById('introText');

                // Fade out text first
                introText.classList.add('fading');

                // Remove all character mode classes
                introContent.classList.remove('lyre-mode', 'hugo-mode', 'pocus-mode');

                // Add appropriate character mode class
                if (character === 'lyre') {
                    introContent.classList.add('lyre-mode');
                } else if (character === 'hugo') {
                    introContent.classList.add('hugo-mode');
                } else if (character === 'pocus') {
                    introContent.classList.add('pocus-mode');
                }
                // Harper is default, no class needed

                // Update text content
                characterTitle.textContent = title;
                characterDescription.textContent = description;

                // Fade text back in after layout shift
                setTimeout(() => {
                    introText.classList.remove('fading');
                }, 300);

                // Update current character
                currentCharacter = character;
            }
        }, 300);
    });
});

// Initialize current character on page load
if (galleryThumbs.length > 0) {
    currentCharacter = galleryThumbs[0].dataset.character;
}

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

        console.log('Howdy from Sam the Web Developer. :) 🎮 N64 nostalgia activated! 🎮')
    }
});

// ===== MOBILE MENU TOGGLE =====
const createMobileMenu = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (!mobileMenuToggle || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle menu open/close
    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);

        // Prevent body scroll when menu is open
        if (isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    // Close menu
    const closeMenu = () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    };

    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu when clicking outside (on backdrop)
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle window resize - close menu if resized to desktop
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 150);
    });

    console.log('Mobile menu initialized successfully');
};

// Initialize mobile menu
createMobileMenu();

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
        <svg viewBox="0 0 24 24" width="32" height="32" class="steam-icon">
        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C7.4,22 3.55,18.92 2.36,14.73L6.19,16.31C6.45,17.6 7.6,18.58 8.97,18.58C10.53,18.58 11.8,17.31 11.8,15.75V15.62L15.2,13.19H15.28C17.36,13.19 19.05,11.5 19.05,9.42C19.05,7.34 17.36,5.65 15.28,5.65C13.2,5.65 11.5,7.34 11.5,9.42V9.47L9.13,12.93L8.97,12.92C8.38,12.92 7.83,13.1 7.38,13.41L2,11.2C2.43,6.05 6.73,2 12,2M8.28,17.17C9.08,17.5 10,17.13 10.33,16.33C10.66,15.53 10.28,14.62 9.5,14.29L8.22,13.76C8.71,13.58 9.26,13.57 9.78,13.79C10.31,14 10.72,14.41 10.93,14.94C11.15,15.46 11.15,16.04 10.93,16.56C10.5,17.64 9.23,18.16 8.15,17.71C7.65,17.5 7.27,17.12 7.06,16.67L8.28,17.17M17.8,9.42C17.8,10.81 16.67,11.94 15.28,11.94C13.9,11.94 12.77,10.81 12.77,9.42A2.5,2.5 0 0,1 15.28,6.91C16.67,6.91 17.8,8.04 17.8,9.42M13.4,9.42C13.4,10.46 14.24,11.31 15.29,11.31C16.33,11.31 17.17,10.46 17.17,9.42C17.17,8.38 16.33,7.53 15.29,7.53C14.24,7.53 13.4,8.38 13.4,9.42Z" />
        </svg>
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

// Load Pocus news after page is fully loaded (non-blocking)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Defer Steam API call to not block LCP
        setTimeout(displayPocusNews, 100);
    });
} else {
    // DOM already loaded
    setTimeout(displayPocusNews, 100);
}

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

// ===== GALLERY NAVIGATION =====
document.addEventListener('DOMContentLoaded', () => {
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Remove active class from all
        gallerySlides.forEach(slide => slide.classList.remove('active'));
        galleryDots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        gallerySlides[index].classList.add('active');
        galleryDots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % gallerySlides.length;
        showSlide(next);
    }

    // Click handlers for dots
    galleryDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showSlide(index);
            // Reset auto-slide timer
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Auto-slide every 5 seconds
    if (gallerySlides.length > 0) {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
});

// ===== YOUTUBE MUSIC PLAYERS =====
let players = {};
let playersReady = {};
let ytApiLoaded = false;

// Check if YouTube API is loaded
function checkYouTubeAPI() {
    return typeof YT !== 'undefined' && typeof YT.Player !== 'undefined';
}

// Initialize YouTube players
function initYouTubePlayers() {
    if (!checkYouTubeAPI()) {
        console.warn('YouTube API not ready, retrying in 500ms...');
        setTimeout(initYouTubePlayers, 500);
        return;
    }

    const videoIds = {
        ytplayer1: 'PWT8Bv2TouY', // Track 1
        ytplayer2: 'cecbsgCJeF4', // Track 2
        ytplayer3: 'U_51KX2r2Jo'  // Track 3
    };

    Object.keys(videoIds).forEach(playerId => {
        const element = document.getElementById(playerId);
        if (!element) {
            console.error(`Player element ${playerId} not found`);
            return;
        }

        try {
            players[playerId] = new YT.Player(playerId, {
                height: '0',
                width: '0',
                videoId: videoIds[playerId],
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'modestbranding': 1,
                    'rel': 0,
                    'enablejsapi': 1,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': onPlayerReady,
                    'onError': onPlayerError
                }
            });
        } catch (error) {
            // Silently handle player creation errors (usually from ad blockers)
            if (!error.message.includes('blocked')) {
                console.error(`Error creating player ${playerId}:`, error);
            }
        }
    });
}

// YouTube IFrame API Ready callback
window.onYouTubeIframeAPIReady = function() {
    ytApiLoaded = true;
    console.log('✅ YouTube API loaded');
    initYouTubePlayers();
};

// Fallback: Check if API is already loaded (for page refreshes)
if (checkYouTubeAPI()) {
    ytApiLoaded = true;
    initYouTubePlayers();
}

function onPlayerReady(event) {
    const playerId = event.target.getIframe().id;
    playersReady[playerId] = true;
    console.log(`✅ Player ${playerId} ready`);

    // Set initial volume
    event.target.setVolume(50);

    // Play button
    document.querySelectorAll(`.play-btn[data-player="${playerId}"]`).forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                if (players[playerId] && playersReady[playerId]) {
                    players[playerId].playVideo();
                } else {
                    console.warn(`Player ${playerId} not ready`);
                }
            } catch (error) {
                console.error(`Error playing ${playerId}:`, error);
            }
        });
    });

    // Pause button
    document.querySelectorAll(`.pause-btn[data-player="${playerId}"]`).forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                if (players[playerId] && playersReady[playerId]) {
                    players[playerId].pauseVideo();
                } else {
                    console.warn(`Player ${playerId} not ready`);
                }
            } catch (error) {
                console.error(`Error pausing ${playerId}:`, error);
            }
        });
    });

    // Volume slider
    document.querySelectorAll(`.volume-slider[data-player="${playerId}"]`).forEach(slider => {
        slider.addEventListener('input', (e) => {
            try {
                if (players[playerId] && playersReady[playerId]) {
                    players[playerId].setVolume(e.target.value);
                }
            } catch (error) {
                console.error(`Error setting volume ${playerId}:`, error);
            }
        });
    });
}

function onPlayerError(event) {
    const playerId = event.target.getIframe().id;
    console.error(`YouTube player error for ${playerId}:`, event.data);
    playersReady[playerId] = false;
}

console.log('🎵 Harper and Lyre website loaded! 🎮');
