Ticket: Restrict "Bottom Sheet" Behavior to Mobile Only
Status: Current implementation triggers the Bottom Sheet on all devices. Goal: PC/Desktop users should experience standard scrolling. Mobile users keep the Bottom Sheet. Breakpoint: Use 1024px as the cutoff.

Part 1: CSS Updates (The "Reset")
Please add a Media Query to override and disable the Bottom Sheet styles on desktop screens. The sections must sit naturally in the page flow on PC.

Add this code block to the end of your CSS:

CSS

/* --- DESKTOP OVERRIDE (Screens wider than 1024px) --- */
@media (min-width: 1024px) {
  /* Select your existing bottom-sheet class (e.g., .sheet-modal or .section-container) */
  .your-bottom-sheet-class {
    /* 1. Reset Positioning: Put it back in the document flow */
    position: relative !important; 
    bottom: auto !important;
    left: auto !important;
    
    /* 2. Reset Visibility: Ensure it's always visible, not hidden off-screen */
    transform: none !important; 
    opacity: 1 !important;
    visibility: visible !important;
    
    /* 3. Reset Dimensions: Let it take natural height */
    width: 100% !important;
    height: auto !important;
    max-height: none !important;
    
    /* 4. Remove Sheet Styling */
    border-radius: 0 !important;
    box-shadow: none !important;
    background: transparent !important; /* Or match site background */
    z-index: 1 !important; /* Ensure it sits below the header/nav */
    padding: 60px 0; /* Add standard section padding */
  }

  /* Hide mobile-specific UI elements */
  .sheet-backdrop, 
  .sheet-close-button, 
  .sheet-drag-handle {
    display: none !important;
  }
}
Part 2: JavaScript Updates (The Logic Branch)
Update the navigation click event. Wrap the existing "Open Sheet" logic in a conditional check.

Update the click event listener logic:

JavaScript

// Inside your navigation click listener:
navLink.addEventListener('click', (e) => {
  e.preventDefault();

  // 1. Check if we are on Desktop
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  // 2. Branch the logic
  if (isDesktop) {
    // --- DESKTOP BEHAVIOR ---
    // Identify the target section and scroll to it
    const targetId = e.target.getAttribute('href'); 
    const targetSection = document.querySelector(targetId);
    
    // Smooth scroll to the section
    targetSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
  } else {
    // --- MOBILE BEHAVIOR ---
    // Run the EXISTING code that opens the Bottom Sheet
    openBottomSheet(); 
  }
});
QA / Testing Criteria
On Mobile: Clicking "How to Book" (or any link) opens the slide-up sheet. Background is dimmed.

On Desktop: Clicking "How to Book" smooth-scrolls down the page to that section. No popup appears. The content looks like a normal website section.

Resize Test: Open the site on a small window (Mobile mode), then expand the window to full screen (Desktop mode). The "Sheet" should disappear and transform into a regular page section automatically.