importScripts("../shared/settings.js");

const SUPPORTED_PROTOCOLS = new Set(["http:", "https:"]);

function sendStatus(port, message) {
    try {
        port.postMessage(message);
    } catch {
        // The operation should continue if the user closes the popup.
    }
}

async function clearBrowsingData(port, tab) {
    try {
        if (!Number.isInteger(tab?.id) || !tab.url) {
            throw new Error("The active tab is unavailable.");
        }

        const url = new URL(tab.url);

        if (!SUPPORTED_PROTOCOLS.has(url.protocol)) {
            throw new Error("Browsing data cannot be cleared for this page.");
        }

        sendStatus(port, {
            state: "step-active",
            step: "preferences"
        });

        const { dataTypes = DEFAULT_DATA_TYPES } = await chrome.storage.sync.get({
            dataTypes: DEFAULT_DATA_TYPES
        });
        const selections = Object.fromEntries(
            DATA_TYPE_OPTIONS.map(({ key }) => [key, dataTypes[key] !== false])
        );
        const selectedKeys = DATA_TYPE_OPTIONS
            .map(({ key }) => key)
            .filter((key) => selections[key]);

        sendStatus(port, {
            state: "step-complete",
            step: "preferences"
        });

        if (selectedKeys.length === 0) {
            throw new Error("Select at least one data type in the extension options.");
        }

        sendStatus(port, {
            state: "step-active",
            step: "clearing"
        });

        await chrome.browsingData.remove(
            { origins: [url.origin] },
            selections
        );

        sendStatus(port, {
            state: "step-complete",
            step: "clearing"
        });

        sendStatus(port, {
            state: "step-active",
            step: "reload"
        });

        await chrome.tabs.reload(tab.id);

        sendStatus(port, {
            state: "step-complete",
            step: "reload"
        });

        sendStatus(port, {
            state: "done"
        });
    } catch (error) {
        sendStatus(port, {
            state: "error",
            message: error instanceof Error ? error.message : "The operation failed."
        });
    }
}

chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== "clear-browsing-data") {
        return;
    }

    let started = false;

    port.onMessage.addListener((message) => {
        if (started || message?.type !== "clear") {
            return;
        }

        started = true;
        void clearBrowsingData(port, message.tab);
    });
});
