export const storage = (table) => {

    /**
     * @param {string|null} [key=null]
     * @returns {any}
     */
    const get = (key = null) => {
        try {
            const item = localStorage.getItem(table);
            if (!item) {
                return key ? undefined : {};
            }
            
            const data = JSON.parse(item);
            
            // Validate that data is an object, not a string or other primitive
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                // Invalid data, reset to empty object
                localStorage.setItem(table, '{}');
                return key ? undefined : {};
            }
            
            return key ? data[String(key)] : data;
        } catch (error) {
            // JSON parse error, reset to empty object
            console.warn(`Invalid JSON in localStorage for key "${table}", resetting...`);
            localStorage.setItem(table, '{}');
            return key ? undefined : {};
        }
    };

    /**
     * @param {string} key
     * @param {any} value
     * @returns {void}
     */
    const set = (key, value) => {
        const data = get();
        data[String(key)] = value;
        localStorage.setItem(table, JSON.stringify(data));
    };

    /**
     * @param {string} key
     * @returns {boolean}
     */
    const has = (key) => Object.keys(get()).includes(String(key));

    /**
     * @param {string} key
     * @returns {void}
     */
    const unset = (key) => {
        if (!has(key)) {
            return;
        }

        const data = get();
        delete data[String(key)];
        localStorage.setItem(table, JSON.stringify(data));
    };

    /**
     * @returns {void}
     */
    const clear = () => localStorage.setItem(table, '{}');

    if (!localStorage.getItem(table)) {
        clear();
    }

    return {
        set,
        get,
        has,
        clear,
        unset,
    };
};