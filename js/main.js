// Typing Effect
const texts = ["SOFTWARE ENGINEER", "AI ARCHITECT", "FULL STACK DEV"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

function type() {
    if (count === texts.length) count = 0;
    currentText = texts[count];
    if (isDeleting) letter = currentText.slice(0, --index);
    else letter = currentText.slice(0, ++index);
    document.getElementById('typewriter').textContent = letter;

    let typeSpeed = isDeleting ? 40 : 100;
    
    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}

// Smooth Single-Trigger Scroll Reveal
const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -30px 0px"
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let delay = 0;
            if(entry.target.classList.contains('timeline-item')) delay = 0.15;
            if(entry.target.classList.contains('project-card')) delay = 0.1;
            entry.target.style.transitionDelay = `${delay}s`;
            entry.target.classList.add('active');
            
            // Unobserve to trigger only once perfectly smoothly without stutter during rapid scroll
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    scrollObserver.observe(el);
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Mobile Menu and Click Animations
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        
        const targetId = link.getAttribute('href');
        if(targetId.startsWith('#')) {
            const section = document.querySelector(targetId);
            if(section) {
                const reveals = section.querySelectorAll('.reveal');
                reveals.forEach(el => {
                    el.style.transition = 'none';
                    el.classList.remove('active');
                    scrollObserver.observe(el);
                });
                setTimeout(() => {
                    reveals.forEach(el => el.style.transition = '');
                }, 50);
            }
        }
    });
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) current = section.getAttribute('id');
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) item.classList.add('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// Web3Forms Asynchronous Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "SENDING...";
        submitBtn.style.opacity = "0.8";
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Reset form
                contactForm.reset();
                
                // Show success state
                submitBtn.innerText = "SENT SUCCESSFULLY!";
                submitBtn.style.backgroundColor = "var(--accent-green)";
                submitBtn.style.color = "#FFF";
                submitBtn.style.opacity = "1";
                
                // Revert after 4 seconds
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.style.color = "";
                }, 4000);
            } else {
                submitBtn.innerText = "ERROR! TRY AGAIN";
                setTimeout(() => submitBtn.innerText = originalText, 3000);
            }
        } catch (error) {
            submitBtn.innerText = "NETWORK ERROR";
            setTimeout(() => submitBtn.innerText = originalText, 3000);
        }
    });
}
