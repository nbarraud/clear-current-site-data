const DATA_TYPE_OPTIONS = Object.freeze([
    {
        key: "cache",
        label: "Browser cache",
        description: "Cached images, scripts, stylesheets, and other network resources."
    },
    {
        key: "cacheStorage",
        label: "Cache Storage",
        description: "Resources stored through the website Cache API."
    },
    {
        key: "cookies",
        label: "Cookies",
        description: "Cookies for the site and its registrable domain. This may sign you out."
    },
    {
        key: "fileSystems",
        label: "File systems",
        description: "Files stored through website file-system APIs."
    },
    {
        key: "indexedDB",
        label: "IndexedDB",
        description: "Structured databases stored by the website."
    },
    {
        key: "localStorage",
        label: "Local storage",
        description: "Key-value data stored by the website."
    },
    {
        key: "serviceWorkers",
        label: "Service workers",
        description: "Background workers registered by the website."
    }
]);

const DEFAULT_DATA_TYPES = Object.freeze(
    Object.fromEntries(DATA_TYPE_OPTIONS.map(({ key }) => [key, true]))
);
