// script.js

// DOM Elements
const menuButton = document.getElementById('menu-button');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const projectsGrid = document.getElementById('projects-grid');
const scrollProgress = document.getElementById('scroll-progress');
const contactButton = document.getElementById('contact-button');
const projectsButton = document.getElementById('projects-button');
const themeButton = document.getElementById('theme-button');

// Custom Cursor Elements
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Project Data
const projects = [
    {
        title: "E-Commerce Website",
        description: "A fully responsive e-commerce platform with product filtering, cart functionality, and secure checkout.",
        tags: ["HTML5", "CSS3", "JavaScript", "React"],
        demoLink: "#",
        codeLink: "#"
    },
    {
        title: "Task Management App",
        description: "A drag-and-drop task management application with real-time updates and team collaboration features.",
        tags: ["JavaScript", "React", "Node.js", "MongoDB"],
        demoLink: "#",
        codeLink: "#"
    },
    {
        title: "Weather Dashboard",
        description: "A weather application that displays current conditions and forecasts for multiple locations.",
        tags: ["HTML5", "CSS3", "JavaScript", "API Integration"],
        demoLink: "#",
        codeLink: "#"
    },
    {
        title: "Portfolio Website",
        description: "A responsive portfolio website showcasing projects and skills with smooth animations.",
        tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        demoLink: "#",
        codeLink: "#"
    },
    {
        title: "Social Media Dashboard",
        description: "A dashboard for tracking social media metrics with interactive charts and data visualization.",
        tags: ["React", "Chart.js", "API Integration", "CSS3"],
        demoLink: "#",
        codeLink: "#"
    },
    {
        title: "Recipe Finder App",
        description: "An application for searching and filtering recipes based on ingredients and dietary preferences.",
        tags: ["Vue.js", "API Integration", "CSS3", "JavaScript"],
        demoLink: "#",
        codeLink: "#"
    }
];

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Populate projects
    renderProjects();
    
    // Add scroll event listener
    window.addEventListener('scroll', updateScrollProgress);
    
    // Add event listeners to buttons
    contactButton.addEventListener('click', function() {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
    
    projectsButton.addEventListener('click', function() {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Add event listener to theme button
    themeButton.addEventListener('click', toggleTheme);
});

// Mobile Menu Toggle Function
function toggleMenu() {
    // Toggle the CSS class (controls visibility via CSS)
    navLinks.classList.toggle('open');
    menuButton.classList.toggle('open');
    
    // Update the button text/icon for accessibility
    const isExpanded = navLinks.classList.contains('open');
    menuButton.setAttribute('aria-expanded', isExpanded);
}

// Add event listener to menu button
menuButton.addEventListener('click', toggleMenu);

// Close menu when a link is clicked (for mobile UX)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            toggleMenu(); // Closes the menu
        }
    });
});

// Form Submission Handler
if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function(event) {
        // Stop the browser from submitting the form and refreshing the page
        event.preventDefault();
        
        const nameInput = document.getElementById('name').value;
        const emailInput = document.getElementById('email').value;
        const messageInput = document.getElementById('message').value;
        
        if (nameInput === '' || emailInput === '') {
            formMessage.textContent = 'Please fill out all required fields.';
            formMessage.style.color = 'red';
        } else {
            // Successful mock submission
            formMessage.textContent = 'Thank you for your message! I will be in touch shortly.';
            formMessage.style.color = 'green';
            contactForm.reset(); // Clear the form fields
        }
    });
}

// Render Projects Function
function renderProjects() {
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                ${project.title}
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.demoLink}" class="project-link" target="_blank">Live Demo</a>
                    <a href="${project.codeLink}" class="project-link" target="_blank">View Code</a>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Scroll Progress Indicator
function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    
    scrollProgress.style.width = `${scrollPercentage}%`;
}

// Theme Toggle Functions
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const icon = themeButton.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Custom Cursor Functions
function initCustomCursor() {
    // Only enable custom cursor on desktop
    if (window.innerWidth >= 1024) {
        document.addEventListener('mousemove', moveCursor);
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-item, .hover-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
                cursorFollower.style.opacity = '0.5';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.opacity = '0.3';
            });
        });
    } else {
        // Hide custom cursor on mobile
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
}

function moveCursor(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Add a slight delay to the follower for a trailing effect
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
}

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 1)';
    } else {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.9)';
    }
});

// Add animation to skill items on scroll
const skillItems = document.querySelectorAll('.skill-item');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        } else {
            entry.target.style.animationPlayState = 'paused';
        }
    });
}, observerOptions);

skillItems.forEach(item => {
    observer.observe(item);
});