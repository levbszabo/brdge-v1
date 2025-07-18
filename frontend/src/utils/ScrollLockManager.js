import { isSafari, isIOS, isChromeMobile, isMobileWithScrollIssues } from './browserDetection';

// Scroll Lock Manager for preventing unwanted scrolling in embeds
class ScrollLockManager {
    constructor() {
        this.locks = new Set();
        this.scrollPosition = { x: 0, y: 0 };
        this.originalStyles = {};
        this.preventDefaultPassive = null;

        // Bind handlers
        this.preventScrollHandler = this.preventScrollHandler.bind(this);
        this.preventTouchMoveHandler = this.preventTouchMoveHandler.bind(this);
        this.preventWheelHandler = this.preventWheelHandler.bind(this);
    }

    preventScrollHandler(e) {
        if (this.locks.size > 0) {
            e.preventDefault();
            e.stopPropagation();
            // For mobile Chrome, we need to prevent the default passive behavior
            if (isChromeMobile() && e.cancelable) {
                e.preventDefault();
            }
            return false;
        }
    }

    preventTouchMoveHandler(e) {
        if (this.locks.size > 0) {
            // Allow scrolling within the iframe content
            if (e.target.closest('iframe')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    preventWheelHandler(e) {
        if (this.locks.size > 0) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    lock(id = 'default') {
        const isFirstLock = this.locks.size === 0;
        this.locks.add(id);

        if (isFirstLock) {
            // Store current scroll position
            this.scrollPosition = {
                x: window.pageXOffset || document.documentElement.scrollLeft,
                y: window.pageYOffset || document.documentElement.scrollTop
            };

            // Store original styles
            this.originalStyles = {
                html: {
                    overflow: document.documentElement.style.overflow,
                    position: document.documentElement.style.position,
                    top: document.documentElement.style.top,
                    width: document.documentElement.style.width,
                    height: document.documentElement.style.height
                },
                body: {
                    overflow: document.body.style.overflow,
                    position: document.body.style.position,
                    top: document.body.style.top,
                    width: document.body.style.width,
                    height: document.body.style.height
                }
            };

            // Apply scroll lock styles
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Prevent scrolling on html and body
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.position = 'fixed';
            document.documentElement.style.top = `-${this.scrollPosition.y}px`;
            document.documentElement.style.width = '100%';
            document.documentElement.style.height = '100%';

            document.body.style.overflow = 'hidden';
            document.body.style.position = 'relative';
            document.body.style.paddingRight = `${scrollBarWidth}px`;

            // Enhanced scroll prevention for all problematic browsers
            if (isSafari() || isIOS() || isMobileWithScrollIssues()) {
                // Add overscroll-behavior to prevent bounce
                document.documentElement.style.overscrollBehavior = 'none';
                document.body.style.overscrollBehavior = 'none';

                // Override scrollIntoView for all elements
                const originalScrollIntoView = Element.prototype.scrollIntoView;
                const originalScrollTo = window.scrollTo;
                const originalScroll = window.scroll;

                Element.prototype.scrollIntoView = function () {
                    // Do nothing - prevent all scrollIntoView calls
                    console.log('ScrollIntoView blocked by ScrollLockManager');
                };

                window.scrollTo = function () {
                    console.log('ScrollTo blocked by ScrollLockManager');
                };

                window.scroll = function () {
                    console.log('Scroll blocked by ScrollLockManager');
                };

                this.originalScrollIntoView = originalScrollIntoView;
                this.originalScrollTo = originalScrollTo;
                this.originalScroll = originalScroll;

                // Prevent focus-triggered scrolling
                const preventFocusScroll = (e) => {
                    const savedScroll = { x: window.pageXOffset, y: window.pageYOffset };
                    requestAnimationFrame(() => {
                        window.scrollTo(savedScroll.x, savedScroll.y);
                    });
                };
                document.addEventListener('focusin', preventFocusScroll, true);
                this.preventFocusScroll = preventFocusScroll;
            }

            // Add event listeners - especially important for Safari and mobile browsers
            const options = { passive: false, capture: true };

            // Prevent wheel scrolling
            window.addEventListener('wheel', this.preventWheelHandler, options);
            window.addEventListener('scroll', this.preventScrollHandler, options);
            document.addEventListener('scroll', this.preventScrollHandler, options);

            // Prevent touch scrolling on mobile
            if (isMobileWithScrollIssues()) {
                document.addEventListener('touchmove', this.preventTouchMoveHandler, options);
                document.addEventListener('touchstart', this.preventTouchMoveHandler, options);
                document.addEventListener('touchend', this.preventTouchMoveHandler, options);

                // Prevent bounce scrolling on body
                document.body.addEventListener('touchmove', this.preventTouchMoveHandler, options);
            }

            // Prevent keyboard scrolling
            window.addEventListener('keydown', (e) => {
                const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Space, PageUp, PageDown, End, Home, Arrow keys
                if (this.locks.size > 0 && keys.includes(e.keyCode)) {
                    e.preventDefault();
                    return false;
                }
            }, options);
        }
    }

    unlock(id = 'default') {
        this.locks.delete(id);

        if (this.locks.size === 0) {
            // Restore original styles
            Object.entries(this.originalStyles.html).forEach(([prop, value]) => {
                document.documentElement.style[prop] = value;
            });

            Object.entries(this.originalStyles.body).forEach(([prop, value]) => {
                document.body.style[prop] = value;
            });

            // Remove event listeners
            const options = { passive: false, capture: true };
            window.removeEventListener('wheel', this.preventWheelHandler, options);
            window.removeEventListener('scroll', this.preventScrollHandler, options);
            document.removeEventListener('scroll', this.preventScrollHandler, options);

            if (isSafari() || isIOS() || isMobileWithScrollIssues()) {
                document.removeEventListener('touchmove', this.preventTouchMoveHandler, options);
                document.removeEventListener('touchstart', this.preventTouchMoveHandler, options);
                document.removeEventListener('touchend', this.preventTouchMoveHandler, options);
                document.body.removeEventListener('touchmove', this.preventTouchMoveHandler, options);

                // Restore overscroll-behavior
                document.documentElement.style.overscrollBehavior = '';
                document.body.style.overscrollBehavior = '';

                // Restore original scrollIntoView
                if (this.originalScrollIntoView) {
                    Element.prototype.scrollIntoView = this.originalScrollIntoView;
                    delete this.originalScrollIntoView;
                }

                // Restore original scroll functions
                if (this.originalScrollTo) {
                    window.scrollTo = this.originalScrollTo;
                    delete this.originalScrollTo;
                }

                if (this.originalScroll) {
                    window.scroll = this.originalScroll;
                    delete this.originalScroll;
                }

                // Remove focus scroll prevention
                if (this.preventFocusScroll) {
                    document.removeEventListener('focusin', this.preventFocusScroll, true);
                    delete this.preventFocusScroll;
                }
            }

            // Restore scroll position
            window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
        }
    }

    isLocked() {
        return this.locks.size > 0;
    }
}

// Export singleton instance
export default new ScrollLockManager(); 