// Index page specific functionality
export function init() {
  console.log('Index page initialized');
  
  // Add any page-specific interactivity here
  const ctaButtons = document.querySelectorAll('a[href*="services"], a[href*="contact"]');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('CTA clicked:', button.textContent);
    });
  });
}
