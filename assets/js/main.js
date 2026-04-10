const initSharedScripts = () => {
    // Keep this file for truly global scripts shared across every page.
    // Page/component-specific logic is now colocated in each HTML/partial.
};

document.addEventListener("DOMContentLoaded", initSharedScripts);

export { initSharedScripts };
