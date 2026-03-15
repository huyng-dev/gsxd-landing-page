export const init = () => {
    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-button');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        
        button?.addEventListener('click', () => {
            const isOpen = !content.classList.contains('hidden');
            
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-content').classList.add('hidden');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherIcon) {
                        otherIcon.classList.replace('bg-textPrimary', 'bg-gray-200');
                        otherIcon.classList.replace('text-white', 'text-gray-500');
                        otherIcon.classList.add('rotate-180');
                    }
                }
            });
            
            if (isOpen) {
                content.classList.add('hidden');
                icon.classList.add('rotate-180');
                icon.classList.replace('bg-textPrimary', 'bg-gray-200');
                icon.classList.replace('text-white', 'text-gray-500');
            } else {
                content.classList.remove('hidden');
                icon.classList.remove('rotate-180');
                icon.classList.replace('bg-gray-200', 'bg-textPrimary');
                icon.classList.replace('text-gray-500', 'text-white');
            }
        });
    });

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
            valueTitle.textContent = img.dataset.title;
            valueDescription.textContent = img.dataset.description;
            valueTitle.style.opacity = '1';
            valueDescription.style.opacity = '1';
            valueTitle.style.transform = 'translateY(0)';
            valueDescription.style.transform = 'translateY(0)';
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
