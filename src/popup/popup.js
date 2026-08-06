const stepsElement = document.querySelector("#steps");
const errorElement = document.querySelector("#error");
const port = chrome.runtime.connect({ name: "clear-browsing-data" });
const STEPS = [
    { key: "site", label: "Identify current site" },
    { key: "preferences", label: "Load clearing preferences" },
    { key: "clearing", label: "Clear selected browsing data" },
    { key: "reload", label: "Reload current site" }
];
let activeStep;

function showError(message) {
    errorElement.textContent = message;
    errorElement.hidden = false;
}

function renderSteps() {
    const fragment = document.createDocumentFragment();

    for (const { key, label } of STEPS) {
        const step = document.createElement("li");
        const icon = document.createElement("span");
        const name = document.createElement("span");

        step.className = "step";
        step.dataset.key = key;
        step.dataset.label = label;
        step.dataset.state = "pending";
        step.setAttribute("aria-label", `${label}: pending`);
        icon.className = "step-icon";
        icon.setAttribute("aria-hidden", "true");
        name.textContent = label;

        step.append(icon, name);
        fragment.append(step);
    }

    stepsElement.replaceChildren(fragment);
}

function setStepState(key, state) {
    const step = stepsElement.querySelector(`[data-key="${key}"]`);

    if (step) {
        step.dataset.state = state;
        step.setAttribute("aria-label", `${step.dataset.label}: ${state}`);
    }
}

function handleStatus(message) {
    if (message.state === "step-complete") {
        setStepState(message.step, "complete");

        if (activeStep === message.step) {
            activeStep = undefined;
        }

        return;
    }

    if (message.state === "step-active") {
        activeStep = message.step;
        setStepState(message.step, "active");
        return;
    }

    if (message.state === "error" && activeStep) {
        setStepState(activeStep, "error");
    }

    if (message.state === "error") {
        showError(message.message);
    }
}

port.onMessage.addListener(handleStatus);

port.onDisconnect.addListener(() => {
    if (activeStep && activeStep !== "reload") {
        setStepState(activeStep, "error");
        showError("The operation was interrupted.");
    }
});

async function start() {
    try {
        activeStep = "site";
        setStepState("site", "active");

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            throw new Error("The active tab is unavailable.");
        }

        const url = new URL(tab.url);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error("Browsing data cannot be cleared for this page.");
        }

        setStepState("site", "complete");
        activeStep = undefined;

        port.postMessage({
            type: "clear",
            tab: {
                id: tab.id,
                url: tab.url
            }
        });
    } catch (error) {
        if (activeStep) {
            setStepState(activeStep, "error");
        }

        showError(error instanceof Error ? error.message : "The operation failed.");
    }
}

renderSteps();
void start();
