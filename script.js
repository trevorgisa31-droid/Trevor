// ===== PAGE NAVIGATION =====
const homePage = document.querySelector('.home-page');
const projectsPage = document.querySelector('.projects-page');

// ===== FUNCTION TO SHOW HOME PAGE =====
function showHomePage() {
    homePage.style.display = 'block';
    projectsPage.style.display = 'none';
    window.scrollTo(0, 0);
}

// ===== FUNCTION TO SHOW PROJECTS PAGE =====
function showProjectsPage() {
    homePage.style.display = 'none';
    projectsPage.style.display = 'block';
    window.scrollTo(0, 0);
}

// ===== VIEW MY WORK BUTTON =====
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
        e.preventDefault();
        showProjectsPage();
    });
}

// ===== BACK TO HOME BUTTON =====
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        showHomePage();
    });
}

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#projects') {
            showProjectsPage();
        } else {
            showHomePage();
        }
    });
});

// ===== VISITOR COUNTER =====
function initializeVisitorCounter() {
    let visitorCount = localStorage.getItem('visitorCount');
    visitorCount = visitorCount ? parseInt(visitorCount) + 1 : 1;
    localStorage.setItem('visitorCount', visitorCount);
    const counter = document.getElementById('visitorCount');
    if (counter) counter.textContent = visitorCount;
}
initializeVisitorCounter();

// ===== STAR RATING FUNCTIONALITY =====
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-value');
        updateStars(selectedRating);
        updateRatingText(selectedRating);
    });
    star.addEventListener('mouseover', function() {
        updateStars(this.getAttribute('data-value'));
    });
});

const starRating = document.querySelector('.star-rating');
if (starRating) {
    starRating.addEventListener('mouseleave', function() {
        updateStars(selectedRating);
    });
}

function updateStars(rating) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingText(rating) {
    const ratingTexts = { 1: '😞 Poor', 2: '😐 Fair', 3: '🙂 Good', 4: '😊 Very Good', 5: '😍 Excellent' };
    const ratingText = document.getElementById('ratingText');
    if (ratingText) ratingText.textContent = ratingTexts[rating];
}

// ===== FEEDBACK FORM SUBMISSION =====
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessageElement = document.getElementById('feedbackMessage');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!selectedRating) {
            feedbackMessageElement.textContent = '⚠️ Please select a rating!';
            feedbackMessageElement.style.color = '#e74c3c';
            return;
        }
        const name = document.getElementById('feedbackName').value;
        const message = document.getElementById('feedbackMessage').value;
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.push({ name, message, rating: selectedRating, timestamp: new Date().toLocaleString() });
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        feedbackMessageElement.textContent = '✅ Thank you for your feedback!';
        feedbackMessageElement.style.color = '#2ecc71';
        feedbackForm.reset();
        selectedRating = 0;
        updateStars(0);
        if (document.getElementById('ratingText')) document.getElementById('ratingText').textContent = 'Click to rate';
        setTimeout(() => { feedbackMessageElement.textContent = ''; }, 3000);
    });
}

// ===== CATEGORY FILTER FUNCTIONALITY =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCategories = document.querySelectorAll('.project-category');

projectCategories.forEach(category => category.classList.add('active'));

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        projectCategories.forEach(category => {
            if (filterValue === 'all' || category.getAttribute('data-category') === filterValue) {
                category.classList.add('active');
            } else {
                category.classList.remove('active');
            }
        });
    });
});

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-button');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm.trim()) {
        alert('Please enter a search term');
        return;
    }
    showProjectsPage();
    const projectCards = document.querySelectorAll('.project-card');
    let found = false;
    projectCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.border = '3px solid #3498db';
            found = true;
        } else {
            card.style.display = 'none';
        }
    });
    if (!found) {
        alert('No projects found matching "' + searchTerm + '"');
        projectCards.forEach(card => {
            card.style.display = 'block';
            card.style.border = 'none';
        });
    }
}

if (searchButton) searchButton.addEventListener('click', performSearch);
if (searchInput) searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performSearch();
});

// ===== SCROLL ANIMATION (FADE IN EFFECT) =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
