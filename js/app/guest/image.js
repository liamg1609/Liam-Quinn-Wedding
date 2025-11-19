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
        el.width = img.naturalWidth;
        el.height = img.naturalHeight;
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
     * Load priority images (Welcome Page images) first
     * @returns {Promise<void>}
     */
    const loadPriorityImages = async () => {
        const priorityImages = Array.from(images).filter((el) => el.getAttribute('data-priority') === 'welcome');
        
        if (priorityImages.length === 0) {
            return;
        }

        await c.open();
        
        const priorityPromises = priorityImages.map((el) => {
            if (el.hasAttribute('data-src')) {
                const src = el.getAttribute('data-src');
                if (el.getAttribute('data-fetch-img') === 'high') {
                    return c.get(src, progress.getAbort())
                        .then((i) => appendImage(el, i))
                        .then(() => el.classList.remove('opacity-0'))
                        .catch((err) => {
                            console.error('Error loading priority image:', err);
                            progress.invalid('image');
                        });
                } else {
                    // For non-high priority images with data-src, load directly
                    return c.get(src, progress.getAbort())
                        .then((i) => appendImage(el, i))
                        .catch((err) => {
                            console.error('Error loading priority image:', err);
                            progress.invalid('image');
                        });
                }
            } else {
                // For images without data-src, use default loading
                getByDefault(el);
                return Promise.resolve();
            }
        });

        await Promise.allSettled(priorityPromises);
    };

    /**
     * @returns {Promise<void>}
     */
    const load = async () => {
        const arrImages = Array.from(images).filter((el) => el.getAttribute('data-priority') !== 'welcome');

        arrImages.filter((el) => el.getAttribute('data-fetch-img') !== 'high').forEach((el) => {
            el.hasAttribute('data-src') ? getByFetch(el) : getByDefault(el);
        });

        if (!hasSrc) {
            return;
        }

        await c.open();
        await Promise.allSettled(arrImages.filter((el) => el.getAttribute('data-fetch-img') === 'high').map((el) => {
            return c.get(el.getAttribute('data-src'), progress.getAbort())
                .then((i) => appendImage(el, i))
                .then(() => el.classList.remove('opacity-0'));
        }));
        await c.run(urlCache, progress.getAbort());
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

        // Count all images for progress tracking
        images.forEach(progress.add);
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