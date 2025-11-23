import { progress } from './progress.js';
import { cache } from '../../connection/cache.js';

export const image = (() => {

    /**
     * @type {NodeListOf<HTMLImageElement>|null}
     */
    let images = null;

    /**
     * @type {ReturnType<typeof cache>|null}
     */
    let c = null;

    let hasSrc = false;
    let nonPriorityImagesCounted = false;

    /**
     * @type {object[]}
     */
    const urlCache = [];

    /**
     * @param {string} src 
     * @returns {Promise<HTMLImageElement>}
     */
    const loadedImage = (src) => new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = src;
    });

    /**
     * @param {HTMLImageElement} el 
     * @param {string} src 
     * @returns {Promise<void>}
     */
    const appendImage = (el, src) => loadedImage(src).then((img) => {
        // Preserve custom width/height if element has data-fixed-size attribute
        if (!el.hasAttribute('data-fixed-size')) {
            el.width = img.naturalWidth;
            el.height = img.naturalHeight;
        }
        el.src = img.src;
        img.remove();

        progress.complete('image');
    });

    /**
     * @param {HTMLImageElement} el 
     * @returns {void}
     */
    const getByFetch = (el) => {
        urlCache.push({
            url: el.getAttribute('data-src'),
            res: (url) => appendImage(el, url),
            rej: (err) => {
                console.error(err);
                progress.invalid('image');
            },
        });
    };

    /**
     * @param {HTMLImageElement} el 
     * @returns {void}
     */
    const getByDefault = (el) => {
        // Check if image is already loaded (cached)
        if (el.complete && el.naturalWidth !== 0 && el.naturalHeight !== 0) {
            el.width = el.naturalWidth;
            el.height = el.naturalHeight;
            progress.complete('image');
            return; // Exit early to prevent duplicate progress tracking
        } else if (el.complete) {
            progress.invalid('image');
            return;
        }

        // Set up listeners only if image is not yet loaded
        el.onerror = () => progress.invalid('image');
        el.onload = () => {
            el.width = el.naturalWidth;
            el.height = el.naturalHeight;
            progress.complete('image');
        };
    };

    /**
     * @returns {boolean}
     */
    const hasDataSrc = () => hasSrc;

    /**
     * Load a single priority image
     * @param {HTMLImageElement} el 
     * @returns {Promise<void>}
     */
    const loadSinglePriorityImage = async (el) => {
        if (el.hasAttribute('data-src')) {
            const src = el.getAttribute('data-src');
            if (el.getAttribute('data-fetch-img') === 'high') {
                try {
                    const i = await c.get(src, progress.getAbort());
                    await appendImage(el, i);
                    el.classList.remove('opacity-0');
                } catch (err) {
                    console.error('Error loading priority image:', err);
                    progress.invalid('image');
                }
            } else {
                // For non-high priority images with data-src, load directly
                try {
                    const i = await c.get(src, progress.getAbort());
                    await appendImage(el, i);
                } catch (err) {
                    console.error('Error loading priority image:', err);
                    progress.invalid('image');
                }
            }
        } else {
            // For images without data-src, use default loading
            getByDefault(el);
        }
    };

    /**
     * Load priority images (Welcome Page images) first
     * querySelectorAll already returns images in DOM order (top to bottom)
     * @returns {Promise<void>}
     */
    const loadPriorityImages = async () => {
        // querySelectorAll returns NodeList in DOM order, filter preserves order
        const priorityImages = Array.from(images).filter((el) => el.getAttribute('data-priority') === 'welcome');
        
        if (priorityImages.length === 0) {
            return;
        }

        await c.open();
        
        // Load images sequentially (one after another) in DOM order
        for (const el of priorityImages) {
            await loadSinglePriorityImage(el);
        }
    };

    /**
     * Load a single non-priority image
     * @param {HTMLImageElement} el 
     * @returns {Promise<void>}
     */
    const loadSingleImage = async (el) => {
        if (el.getAttribute('data-fetch-img') === 'high') {
            // High priority images with data-fetch-img="high"
            try {
                const src = el.getAttribute('data-src');
                const i = await c.get(src, progress.getAbort());
                await appendImage(el, i);
                el.classList.remove('opacity-0');
            } catch (err) {
                console.error('Error loading image:', err);
                progress.invalid('image');
            }
        } else if (el.hasAttribute('data-src')) {
            // Images with data-src but not high priority - load directly in sequence
            try {
                const src = el.getAttribute('data-src');
                const i = await c.get(src, progress.getAbort());
                await appendImage(el, i);
            } catch (err) {
                console.error('Error loading image:', err);
                progress.invalid('image');
            }
        } else {
            // Images without data-src - use default loading
            getByDefault(el);
        }
    };

    /**
     * @returns {Promise<void>}
     */
    const load = async () => {
        // querySelectorAll returns NodeList in DOM order, filter preserves order
        const arrImages = Array.from(images).filter((el) => el.getAttribute('data-priority') !== 'welcome');

        // Count remaining images for progress tracking (only once)
        if (!nonPriorityImagesCounted) {
            arrImages.forEach(progress.add);
            nonPriorityImagesCounted = true;
        }

        if (!hasSrc) {
            // If no data-src images, just load default images sequentially
            for (const el of arrImages) {
                if (!el.hasAttribute('data-src')) {
                    getByDefault(el);
                }
            }
            return;
        }

        await c.open();

        // Load all images sequentially in DOM order (top to bottom)
        // Array.from() and filter() preserve the DOM order from querySelectorAll
        for (const el of arrImages) {
            await loadSingleImage(el);
        }
    };

    /**
     * @param {string} blobUrl 
     * @returns {Promise<Response>}
     */
    const download = (blobUrl) => c.download(blobUrl, `image_${Date.now()}`);

    /**
     * @returns {object}
     */
    const init = () => {
        c = cache('image').withForceCache();
        images = document.querySelectorAll('img');

        // Only count priority images for initial progress tracking
        // Other images will be counted when load() is called
        const priorityImages = Array.from(images).filter((i) => i.getAttribute('data-priority') === 'welcome');
        priorityImages.forEach(progress.add);
        
        hasSrc = Array.from(images).some((i) => i.hasAttribute('data-src'));

        return {
            load,
            loadPriorityImages,
            download,
            hasDataSrc,
        };
    };

    return {
        init,
    };
})();