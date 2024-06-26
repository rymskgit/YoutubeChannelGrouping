
function Show() {

    const parentDocument = window.parent.document;

    const frame = parentDocument.querySelector('#subpopup-overlay') ?? null;
    if (frame === null) {
        return;
    }

    frame.style.display = "unset";
}

function Close() {

    const parentDocument = window.parent.document;

    const frame = parentDocument.querySelector('#subpopup-overlay') ?? null;
    if (frame === null) {
        return;
    }

    frame.style.display = "none";
}

function updateMessage(message) {

    const messageBox = document.querySelector('#message') ?? null;
    if (messageBox === null) {
        return;
    }

    messageBox.textContent = message;
    messageBox.style.visibility = "visible";

    setTimeout(() => {
        messageBox.style.visibility = "hidden";
    }, 3000);
}

function validateData(data, dataType) {

    if (dataType === "group-name") {
        const groups = Array.from(data);
        groups.forEach((value) => {
            const name = value.name;
            const order = value.order;
            if (name === undefined || order === undefined) {
                throw new Exception();
            }
        })
    }
    else if (dataType === "grouping") {
        const settings = Array.from(data);
        settings.forEach((value) => {
            const account = value.account;
            const groupname = value.groupname;
            const order = value.order;
            if (account === undefined || groupname === undefined || order === undefined) {
                throw new Exception();
            }
        })
    }
}

function onCloseClick() {

    Close();
}

function onCopyClick() {

    const jsonText = document.querySelector('#jsonText') ?? null;
    if (jsonText === null) {
        return;
    }

    navigator.clipboard.writeText(jsonText.value);
}

function onImportClick() {

    const jsonText = document.querySelector('#jsonText') ?? null;
    if (jsonText === null) {
        return;
    }

    try {
        const data = JSON.parse(jsonText.value);
        validateData(data, jsonText.dataType);

        if (jsonText.dataType === "group-name") {
            chrome.runtime.sendMessage({ type: "import-group", data: data });
        }
        else if (jsonText.dataType === "grouping") {
            chrome.runtime.sendMessage({ type: "import-grouping", data: data });
        }

        Close();
    }
    catch (error) {
        updateMessage("invalid json for import.");
    }
}

function onExport(data) {

    const jsonText = document.querySelector('#jsonText') ?? null;
    if (jsonText === null) {
        return;
    }

    jsonText.value = data;

    Show();
}

function onImport(dataType) {

    const jsonText = document.querySelector('#jsonText') ?? null;
    if (jsonText === null) {
        return;
    }

    jsonText.value = "";
    jsonText.dataType = dataType;

    Show();
}

function setEventHandler() {

    const closeBtn = document.querySelector('#close-popup') ?? null;
    if (closeBtn !== null) {
        closeBtn.addEventListener("click", (event) => onCloseClick());
    }

    const copyJsonBtn = document.querySelector('#copy-json') ?? null;
    if (copyJsonBtn !== null) {
        copyJsonBtn.addEventListener("click", (event) => onCopyClick());
    }

    const importJsonBtn = document.querySelector('#import-json') ?? null;
    if (importJsonBtn !== null) {
        importJsonBtn.addEventListener("click", (event) => onImportClick());
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "export") {
        onExport(message.data);
    }
    else if (message.type === "import") {
        onImport(message.dataType);
    }
});

function main() {
    setEventHandler();
}

window.onload = () => {
    main();
}
