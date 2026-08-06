const form = document.querySelector("#options-form");
const optionsList = document.querySelector("#options-list");
const saveStatus = document.querySelector("#save-status");
const selectAllButton = document.querySelector("#select-all");
const selectNoneButton = document.querySelector("#select-none");

function renderOptions(dataTypes) {
    const fragment = document.createDocumentFragment();

    for (const { key, label, description } of DATA_TYPE_OPTIONS) {
        const option = document.createElement("label");
        const checkbox = document.createElement("input");
        const name = document.createElement("strong");
        const details = document.createElement("small");

        option.className = "option";
        checkbox.type = "checkbox";
        checkbox.name = key;
        checkbox.checked = dataTypes[key] !== false;
        name.textContent = label;
        details.textContent = description;

        option.append(checkbox, name, details);
        fragment.append(option);
    }

    optionsList.replaceChildren(fragment);
}

function getSelections() {
    return Object.fromEntries(
        DATA_TYPE_OPTIONS.map(({ key }) => [key, form.elements[key].checked])
    );
}

function showSaveError(message) {
    saveStatus.textContent = message;
    saveStatus.dataset.state = "error";
}

async function save() {
    try {
        await chrome.storage.sync.set({ dataTypes: getSelections() });
        saveStatus.textContent = "";
        delete saveStatus.dataset.state;
    } catch {
        showSaveError("Could not save settings");
    }
}

function setAll(checked) {
    for (const { key } of DATA_TYPE_OPTIONS) {
        form.elements[key].checked = checked;
    }

    void save();
}

form.addEventListener("change", () => void save());
selectAllButton.addEventListener("click", () => setAll(true));
selectNoneButton.addEventListener("click", () => setAll(false));

async function restore() {
    try {
        const { dataTypes } = await chrome.storage.sync.get({
            dataTypes: DEFAULT_DATA_TYPES
        });
        renderOptions(dataTypes);
    } catch {
        renderOptions(DEFAULT_DATA_TYPES);
        showSaveError("Could not load settings");
    }
}

void restore();
