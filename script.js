// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'linear-gradient(90deg, rgba(200, 182, 255, 0.95), rgba(168, 208, 230, 0.95))';
    navbar.style.backdropFilter = 'blur(10px)';
  } else {
    navbar.style.background = 'linear-gradient(90deg, var(--lavender), var(--blue))';
    navbar.style.backdropFilter = 'none';
  }
});

// Add fade-in animation for era cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply animation to era cards
document.addEventListener('DOMContentLoaded', function() {
  const eraCards = document.querySelectorAll('.era');
  eraCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});

// Add hover effect for buttons
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// Add typing effect to hero title
document.addEventListener('DOMContentLoaded', function() {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--indigo)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    setTimeout(typeWriter, 500);
  }
});
