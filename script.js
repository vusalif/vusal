// Smooth scrolling for navigation links
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
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            message: this.querySelector('textarea').value
        };

        // Here you would typically send the form data to a server
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Clear form
        this.reset();
    });
}

// Scroll-based animations for sections
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scrolling down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to toggle theme
function toggleTheme() {
    if (!window.themeUnlocked) {
        showThemeLockWarning();
        return;
    }
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to light theme instead of system preference
    const currentTheme = savedTheme || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Event listeners
themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!window.themeUnlocked) {
        showThemeLockWarning();
        return;
    }
    toggleTheme();
});

// Remove system preference listener since we're defaulting to light
// prefersDarkScheme.addListener((e) => {
//     if (!localStorage.getItem('theme')) {
//         document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
//     }
// });

// Initialize theme on load
initializeTheme();

// Snake Game
document.addEventListener('DOMContentLoaded', () => {
    const avatarContainer = document.querySelector('.avatar-container');
    const hoverCounter = document.querySelector('.hover-counter');
    const snakeGame = document.querySelector('.snake-game');
    const snakeHead = document.querySelector('.snake-head');
    const food = document.querySelector('.food');
    const themeToggle = document.querySelector('.theme-toggle');

    // Create score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    snakeGame.appendChild(scoreDisplay);

    // Create theme lock warning
    const themeLockWarning = document.createElement('div');
    themeLockWarning.className = 'theme-lock-warning';
    document.body.appendChild(themeLockWarning);

    // Rainbow colors for snake body
    const rainbowColors = [
        '#FF0000', // Red
        '#FF7F00', // Orange
        '#FFFF00', // Yellow
        '#00FF00', // Green
        '#0000FF', // Blue
        '#4B0082', // Indigo
        '#8B00FF'  // Violet
    ];

    let hoverCount = 0;
    const requiredHovers = 5;
    let gameActive = false;
    let snakePos = { x: 90, y: 90 };
    let snakeVel = { x: 0, y: 0 };
    let snakeParts = [];
    let foodPos = {};
    let score = 0;
    let hoverOutTimer = null;
    let themeUnlocked = false;

    // Disable initial theme toggle
    themeToggle.style.opacity = '0.5';
    themeToggle.style.cursor = 'not-allowed';

    // Theme toggle click handler
    themeToggle.addEventListener('click', (e) => {
        if (!themeUnlocked) {
            e.stopPropagation();
            showThemeLockWarning();
            return;
        }
        toggleTheme();
    });

    function showThemeLockWarning() {
        themeLockWarning.textContent = "It's locked... to crack this setting, hover the avatar and collect 50 Points";
        themeLockWarning.style.opacity = '1';
        themeLockWarning.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            themeLockWarning.style.opacity = '0';
            themeLockWarning.style.transform = 'translateY(-10px)';
        }, 3000);
    }

    avatarContainer.addEventListener('mouseenter', () => {
        if (!gameActive) {
            hoverCount++;
            const remaining = requiredHovers - hoverCount;
            hoverCounter.textContent = `Hover me ${remaining} ${remaining === 1 ? 'time' : 'times'}`;
            hoverCounter.style.opacity = '1';
            
            if (hoverCount >= requiredHovers) {
                startGame();
            }
        } else {
            if (hoverOutTimer) {
                clearTimeout(hoverOutTimer);
                hoverOutTimer = null;
            }
            snakeGame.classList.add('active');
        }
    });

    avatarContainer.addEventListener('mouseleave', () => {
        if (!gameActive) {
            hoverCounter.style.opacity = '0';
        } else {
            hoverOutTimer = setTimeout(() => {
                snakeGame.classList.remove('active');
                resetGame(); // Reset game when hidden
            }, 5000);
        }
    });

    function checkThemeUnlock() {
        if (score >= 50 && !window.themeUnlocked) {
            window.themeUnlocked = true;
            themeToggle.style.opacity = '1';
            themeToggle.style.cursor = 'pointer';
            
            // Show success message once
            const themeLockWarning = document.querySelector('.theme-lock-warning');
            themeLockWarning.textContent = "Theme settings unlocked! 🎉";
            themeLockWarning.style.opacity = '1';
            themeLockWarning.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                themeLockWarning.style.opacity = '0';
                themeLockWarning.style.transform = 'translateY(-10px)';
                // Remove the warning element after animation
                setTimeout(() => {
                    themeLockWarning.remove();
                }, 300);
            }, 3000);
        }
    }

    function updateScore() {
        scoreDisplay.textContent = score;
        checkThemeUnlock();
    }

    function startGame() {
        gameActive = true;
        snakeGame.classList.add('active');
        hoverCounter.style.opacity = '0';
        resetGame();
        gameLoop();
    }

    function resetGame() {
        snakePos = { x: 90, y: 90 };
        snakeVel = { x: 0, y: 0 };
        snakeParts = [];
        score = 0;
        updateScore();
        spawnFood();
        updateSnake();
    }

    function spawnFood() {
        foodPos = {
            x: Math.floor(Math.random() * 160) + 10,
            y: Math.floor(Math.random() * 160) + 10
        };
        food.style.left = `${foodPos.x}px`;
        food.style.top = `${foodPos.y}px`;
    }

    function updateSnake() {
        // Update head position
        snakeHead.style.left = `${snakePos.x}px`;
        snakeHead.style.top = `${snakePos.y}px`;
        
        // Update body parts
        snakeParts.forEach((part, index) => {
            const color = rainbowColors[index % rainbowColors.length];
            part.element.style.left = `${part.x}px`;
            part.element.style.top = `${part.y}px`;
            part.element.style.background = color;
            part.element.style.boxShadow = `0 0 10px ${color}`;
        });
    }

    function addBodyPart() {
        const part = document.createElement('div');
        part.className = 'snake-body-part';
        snakeParts.push({
            x: snakePos.x,
            y: snakePos.y,
            element: part
        });
        snakeGame.appendChild(part);
    }

    function checkCollision() {
        const distance = Math.hypot(snakePos.x - foodPos.x, snakePos.y - foodPos.y);
        if (distance < 10) {
            score++;
            updateScore();
            addBodyPart();
            spawnFood();
        }
    }

    function moveSnake(e) {
        const speed = 3;
        const rect = snakeGame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const dx = x - snakePos.x;
        const dy = y - snakePos.y;
        const angle = Math.atan2(dy, dx);
        
        snakeVel.x = Math.cos(angle) * speed;
        snakeVel.y = Math.sin(angle) * speed;
    }

    snakeGame.addEventListener('mousemove', moveSnake);

    function gameLoop() {
        if (!gameActive) return;

        // Update snake position
        snakePos.x += snakeVel.x;
        snakePos.y += snakeVel.y;
        
        // Keep snake in bounds
        snakePos.x = Math.max(5, Math.min(175, snakePos.x));
        snakePos.y = Math.max(5, Math.min(175, snakePos.y));
        
        // Update body positions
        for (let i = snakeParts.length - 1; i > 0; i--) {
            snakeParts[i].x = snakeParts[i - 1].x;
            snakeParts[i].y = snakeParts[i - 1].y;
        }
        if (snakeParts.length > 0) {
            snakeParts[0].x = snakePos.x;
            snakeParts[0].y = snakePos.y;
        }
        
        updateSnake();
        checkCollision();
        
        requestAnimationFrame(gameLoop);
    }

    // Make themeUnlocked globally accessible
    window.themeUnlocked = false;

    function showThemeLockWarning() {
        const themeLockWarning = document.querySelector('.theme-lock-warning');
        themeLockWarning.textContent = "It's locked... to crack this setting, hover the avatar and collect 50 Points";
        themeLockWarning.style.opacity = '1';
        themeLockWarning.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            themeLockWarning.style.opacity = '0';
            themeLockWarning.style.transform = 'translateY(-10px)';
        }, 3000);
    }

    function checkThemeUnlock() {
        if (score >= 50 && !window.themeUnlocked) {
            window.themeUnlocked = true;
            themeToggle.style.opacity = '1';
            themeToggle.style.cursor = 'pointer';
            
            // Show success message once
            const themeLockWarning = document.querySelector('.theme-lock-warning');
            themeLockWarning.textContent = "Theme settings unlocked! 🎉";
            themeLockWarning.style.opacity = '1';
            themeLockWarning.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                themeLockWarning.style.opacity = '0';
                themeLockWarning.style.transform = 'translateY(-10px)';
                // Remove the warning element after animation
                setTimeout(() => {
                    themeLockWarning.remove();
                }, 300);
            }, 3000);
        }
    }
}); 