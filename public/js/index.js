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

// ===== JOURNAL PAGINATION =====
const journalPages = document.querySelectorAll('.journal-page');
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

let currentPage = 0;
const totalPages = journalPages.length;

// Set total pages
totalPagesSpan.textContent = totalPages;

function updateJournal() {
    // Hide all pages
    journalPages.forEach(page => page.classList.remove('active'));

    // Show current page
    journalPages[currentPage].classList.add('active');

    // Update page indicator
    currentPageSpan.textContent = currentPage + 1;

    // Update button states
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateJournal();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateJournal();
    }
});

// Initialize journal
updateJournal();

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

function createNewsListItem(newsItem, index) {
    const item = document.createElement('div');
    item.className = 'news-list-item';
    if (index === 0) item.classList.add('active');

    item.innerHTML = `
        <div class="news-list-item-date">${formatDate(newsItem.date)}</div>
        <div class="news-list-item-title">${newsItem.title}</div>
    `;

    item.addEventListener('click', function() {
        displayNewsContent(newsItem, this);
    });

    return item;
}

function displayNewsContent(newsItem, clickedElement) {
    const newsContent = document.getElementById('newsContent');
    const viewOnSteamBtn = document.getElementById('newsViewOnSteam');

    // Update active state
    document.querySelectorAll('.news-list-item').forEach(item => item.classList.remove('active'));
    if (clickedElement) {
        clickedElement.classList.add('active');
    }

    newsContent.innerHTML = `
        <h2 class="news-content-title">${newsItem.title}</h2>
        <div class="news-content-date">${formatDate(newsItem.date)}</div>
        <div class="news-content-body">
            ${newsItem.contents}
        </div>
    `;

    // Update Steam button
    viewOnSteamBtn.href = newsItem.url;
    viewOnSteamBtn.style.display = 'inline-block';
}

async function displayNews() {
    const newsList = document.getElementById('newsList');
    const newsContent = document.getElementById('newsContent');

    const data = await fetchSteamNews();

    if (!data || !data.appnews || !data.appnews.newsitems) {
        newsList.innerHTML = '<div class="news-loading"><p>Unable to load news.</p></div>';
        newsContent.innerHTML = '<div class="news-loading"><p>Unable to load news. Please try again later.</p></div>';
        return;
    }

    const newsItems = data.appnews.newsitems;

    if (newsItems.length === 0) {
        newsList.innerHTML = '<div class="news-loading"><p>No news available.</p></div>';
        newsContent.innerHTML = '<div class="news-loading"><p>No news available at the moment.</p></div>';
        return;
    }

    // Clear loading messages
    newsList.innerHTML = '';

    // Create and append news list items
    newsItems.forEach((newsItem, index) => {
        const listItem = createNewsListItem(newsItem, index);
        newsList.appendChild(listItem);
    });

    // Display first news item by default
    displayNewsContent(newsItems[0], newsList.firstChild);
}

// Load news on page load
displayNews();

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
            displayNews();
        }
    }
});

// Refresh when user scrolls to news section (one-time check per session)
let newsRefreshedOnScroll = false;
const newsSection = document.getElementById('news');

if (newsSection) {
    const newsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !newsRefreshedOnScroll) {
                const now = Date.now();
                if ((now - lastFetchTime) >= CACHE_DURATION) {
                    displayNews();
                    newsRefreshedOnScroll = true;
                }
            }
        });
    }, { threshold: 0.1 });

    newsObserver.observe(newsSection);
}

console.log('🎵 Harper and Lyre website loaded! 🎮');
