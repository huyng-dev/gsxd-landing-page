import { initCalculator } from '../calculator.js';

export const init = () => {
    // Note: FAQ Accordion Logic has been moved to main.js for global use.
    
    // Initialize Roof Quantity Calculator
    initCalculator();

    // Value Section Interaction
    const valueImages = document.querySelectorAll('.value-image-item');
    const valueTitle = document.getElementById('value-title');
    const valueDescription = document.getElementById('value-description');

    const updateValueSection = (img) => {
        if (img.classList.contains('active')) return;

        // Remove active from all
        valueImages.forEach(i => i.classList.remove('active'));
        // Add active to current
        img.classList.add('active');

        // Update text with transition
        valueTitle.style.opacity = '0';
        valueDescription.style.opacity = '0';
        valueTitle.style.transform = 'translateY(10px)';
        valueDescription.style.transform = 'translateY(10px)';

        setTimeout(() => {
            if (valueTitle) valueTitle.textContent = img.dataset.title;
            if (valueDescription) valueDescription.textContent = img.dataset.description;
            if (valueTitle) {
                valueTitle.style.opacity = '1';
                valueTitle.style.transform = 'translateY(0)';
            }
            if (valueDescription) {
                valueDescription.style.opacity = '1';
                valueDescription.style.transform = 'translateY(0)';
            }
        }, 300);
    };

    if (valueImages.length > 0 && valueTitle && valueDescription) {
        valueImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) updateValueSection(img);
            });
            img.addEventListener('click', () => {
                updateValueSection(img);
            });
        });
    }
};
