// Brdge Embed API - For embedding bridges in external sites
import { isSafari, isIOS } from './browserDetection';

class BrdgeEmbed {
    constructor() {
        this.embeds = new Map();
    }

    create(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`BrdgeEmbed: Container with id "${containerId}" not found`);
            return null;
        }

        // Default options
        const config = {
            url: options.url || process.env.REACT_APP_EMBED_URL || window.location.origin,
            brdgeId: options.brdgeId,
            agentType: options.agentType || 'view',
            token: options.token || null,
            userId: options.userId || null,
            width: options.width || '100%',
            height: options.height || '100%',
            preventScroll: options.preventScroll !== false, // Default true
            className: options.className || '',
            onLoad: options.onLoad || null,
            onError: options.onError || null
        };

        // Validate required options
        if (!config.brdgeId) {
            console.error('BrdgeEmbed: brdgeId is required');
            return null;
        }

        // Apply container styles for proper embedding
        const originalStyles = {
            position: container.style.position,
            overflow: container.style.overflow,
            webkitOverflowScrolling: container.style.webkitOverflowScrolling
        };

        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        // Safari-specific styles
        if (isSafari() || isIOS()) {
            container.style.webkitOverflowScrolling = 'touch';
            container.style.touchAction = 'none';

            // Create invisible scroll prevention overlay
            const overlay = document.createElement('div');
            overlay.className = 'brdge-embed-overlay';
            overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      `;
            container.appendChild(overlay);

            // Prevent Safari from auto-scrolling to iframe on load
            let scrollTimeout;
            const preventAutoScroll = () => {
                const currentScroll = { x: window.pageXOffset, y: window.pageYOffset };

                const scrollHandler = () => {
                    clearTimeout(scrollTimeout);
                    window.scrollTo(currentScroll.x, currentScroll.y);

                    scrollTimeout = setTimeout(() => {
                        window.removeEventListener('scroll', scrollHandler);
                    }, 100);
                };

                window.addEventListener('scroll', scrollHandler, { passive: false, capture: true });

                // Clean up after 2 seconds
                setTimeout(() => {
                    window.removeEventListener('scroll', scrollHandler);
                }, 2000);
            };

            // Start preventing auto-scroll immediately
            preventAutoScroll();
        }

        // Create iframe wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `brdge-embed-wrapper ${config.className}`;
        wrapper.style.cssText = `
      position: relative;
      width: ${config.width};
      height: ${config.height};
      overflow: hidden;
    `;

        // Build URL with parameters
        const params = new URLSearchParams({
            brdgeId: config.brdgeId,
            agentType: config.agentType,
            embed: '1'
        });

        if (config.token) params.append('token', config.token);
        if (config.userId) params.append('userId', config.userId);

        const embedUrl = `${config.url}/embed?${params.toString()}`;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'brdge-embed-iframe';
        iframe.src = embedUrl;
        iframe.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    `;

        // Set iframe attributes
        iframe.setAttribute('allow', 'camera; microphone; display-capture; fullscreen; autoplay');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('loading', 'eager');

        // Safari-specific: prevent focus on load
        if (isSafari() || isIOS()) {
            iframe.setAttribute('tabindex', '-1');
            iframe.style.pointerEvents = 'none';

            // Re-enable pointer events after load
            iframe.addEventListener('load', () => {
                setTimeout(() => {
                    iframe.style.pointerEvents = 'auto';
                }, 500);
            }, { once: true });
        }

        // Handle load/error events
        iframe.onload = () => {
            console.log('BrdgeEmbed: Iframe loaded successfully');

            // Prevent auto-focus in Safari
            if (isSafari() || isIOS()) {
                iframe.blur();
                if (document.activeElement === iframe) {
                    document.activeElement.blur();
                }
            }

            if (config.onLoad) config.onLoad(embedInstance);
        };

        iframe.onerror = (error) => {
            console.error('BrdgeEmbed: Iframe load error', error);
            if (config.onError) config.onError(error);
        };

        // Append elements
        wrapper.appendChild(iframe);
        container.appendChild(wrapper);

        // Create embed instance
        const embedInstance = {
            id: `embed-${Date.now()}`,
            container,
            wrapper,
            iframe,
            config,
            originalStyles,

            // Methods
            destroy: () => {
                // Restore original styles
                Object.assign(container.style, originalStyles);

                // Remove elements
                container.removeChild(wrapper);
                const overlay = container.querySelector('.brdge-embed-overlay');
                if (overlay) container.removeChild(overlay);

                // Remove from tracking
                this.embeds.delete(embedInstance.id);
            },

            sendMessage: (data) => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage(data, config.url);
                }
            },

            resize: (width, height) => {
                if (width) wrapper.style.width = width;
                if (height) wrapper.style.height = height;
            }
        };

        // Track embed
        this.embeds.set(embedInstance.id, embedInstance);

        return embedInstance;
    }

    // Get all active embeds
    getAll() {
        return Array.from(this.embeds.values());
    }

    // Destroy all embeds
    destroyAll() {
        this.embeds.forEach(embed => embed.destroy());
        this.embeds.clear();
    }
}

// Create singleton instance and expose globally
const brdgeEmbed = new BrdgeEmbed();

// Expose to window for external sites
if (typeof window !== 'undefined') {
    window.BrdgeEmbed = brdgeEmbed;
}

export default brdgeEmbed; 