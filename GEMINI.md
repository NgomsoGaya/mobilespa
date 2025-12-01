## Technical Spec: Mobile Bottom Sheet Navigation

**Objective:** Replace anchor-jump navigation for sections (e.g., "How to Book", "About Us") with a slide-up "Bottom Sheet" overlay.

### 1\. Architectural Strategy

Do not just "hide" the existing sections on the page. Move the content for these specific sections **out of the main document flow**.

  * **Current State:** All sections are stacked in one long `<div>`.
  * **New State:** "How to Book" is removed from the main scroll flow and placed in a fixed `modal-container` at the bottom of the DOM.

### 2\. The HTML Structure

The sheet needs three layers: the container, the distinct backdrop (for clicking to close), and the sheet itself.

```html
<div id="bottom-sheet-container" class="sheet-hidden" aria-hidden="true">
  <div class="sheet-backdrop" id="sheet-backdrop"></div>

  <div class="sheet-content" role="dialog" aria-modal="true">
    
    <div class="sheet-handle-area">
      <div class="sheet-handle-bar"></div>
    </div>

    <div class="sheet-body">
      <h2>How to Book</h2>
      <p>Your low-height content goes here...</p>
      <button id="sheet-close-btn" class="btn-primary">Close</button>
    </div>
  </div>
</div>
```

### 3\. The CSS (Animation & Positioning)

Use `transform: translateY` for smooth, GPU-accelerated animations (60fps). Do not animate `height` or `top`.

```css
/* Container: Covers whole screen, handles z-index */
#bottom-sheet-container {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 9999; /* Must be highest */
  pointer-events: none; /* Let clicks pass through when hidden */
  display: flex;
  align-items: flex-end; /* Aligns sheet to bottom */
}

/* State: Open */
#bottom-sheet-container.sheet-visible {
  pointer-events: auto; /* Capture clicks when open */
}

/* The Backdrop */
.sheet-backdrop {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

#bottom-sheet-container.sheet-visible .sheet-backdrop {
  opacity: 1;
}

/* The Sheet Card */
.sheet-content {
  position: relative;
  width: 100%;
  max-height: 85vh; /* Don't cover the very top, looks better */
  background: white;
  border-radius: 20px 20px 0 0; /* Rounded top corners */
  transform: translateY(100%); /* Start pushed down off-screen */
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); /* Nice "snap" effect */
  overflow-y: auto; /* Internal scrolling if content is long */
  padding-bottom: 40px; /* Safe area for iPhone home bar */
}

#bottom-sheet-container.sheet-visible .sheet-content {
  transform: translateY(0); /* Slide up to natural position */
}
```

### 4\. JavaScript Logic (The "Brains")

There are two critical requirements here: **Intercepting the Nav** and **Locking the Body Scroll**.

```javascript
const navLink = document.querySelector('#nav-how-to-book');
const sheetContainer = document.querySelector('#bottom-sheet-container');
const backdrop = document.querySelector('#sheet-backdrop');
const closeBtn = document.querySelector('#sheet-close-btn');

// 1. Open Function
function openSheet() {
  sheetContainer.classList.remove('sheet-hidden');
  sheetContainer.classList.add('sheet-visible');
  sheetContainer.setAttribute('aria-hidden', 'false');
  
  // CRITICAL: Prevent background page from scrolling while sheet is open
  document.body.style.overflow = 'hidden'; 
}

// 2. Close Function
function closeSheet() {
  sheetContainer.classList.remove('sheet-visible');
  sheetContainer.classList.add('sheet-hidden');
  sheetContainer.setAttribute('aria-hidden', 'true');
  
  // Restore background scrolling
  document.body.style.overflow = ''; 
}

// 3. Event Listeners
navLink.addEventListener('click', (e) => {
  e.preventDefault(); // Stop the anchor jump
  openSheet();
});

// Close when clicking the dark backdrop
backdrop.addEventListener('click', closeSheet);

// Close when clicking the close button
closeBtn.addEventListener('click', closeSheet);

// Close on 'Escape' key (Accessibility standard)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sheetContainer.classList.contains('sheet-visible')) {
    closeSheet();
  }
});
```

### 5\. Developer Checklist for "Polish"

To make this feel like a high-end app, ask the developer to check these off:

  * [ ] **Safe Area Inset:** Ensure `padding-bottom` accounts for `env(safe-area-inset-bottom)` so the iPhone home bar doesn't overlap text.
  * [ ] **Focus Management:** When the sheet opens, strictly move the keyboard focus *inside* the sheet. When it closes, return focus to the Nav element that triggered it.
  * [ ] **Click-Through Prevention:** Ensure that swiping or scrolling inside the sheet doesn't accidentally trigger scroll events on the page behind it.
  * [ ] **(Optional) Swipe-to-Close:** If the developer uses a library like `Framer Motion` (React) or `GSAP`, adding a "drag down to close" gesture is the gold standard for mobile UX.

-----
