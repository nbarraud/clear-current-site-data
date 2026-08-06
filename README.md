# Clear Data for Current Site

> [!IMPORTANT]
> The extension formerly known as **Clear Cache for Current Tab** is now **Clear Data for Current Site**! V2 adds configurable data types, live operation progress, and an automatic page reload after clearing.

> [!TIP]
> The extension is open source. [View the code on GitHub](https://github.com/nbarraud/clear-data-for-current-site), and give the project a star if you find it useful!

Clears browser data for the current site only.

Unlike most data clearing extensions, this one targets the site in the current tab. This is particularly useful when developing and testing a web app. With this extension, clearing the browser data no longer affects your experience on other websites.

To use it, click the extension icon or press `Ctrl+R` on Windows and Linux or `Command+R` on macOS.

This is the full list of items that the extension clears. Chromium does not allow clearing anything more than that when targeting a specific tab:

- Browser cache
- Cache Storage
- Cookies
- File systems
- IndexedDB
- Local storage
- Service workers

## Usage

Open the site you want to reset, then click the extension icon. The popup displays the operation's progress while the extension clears the selected data and reloads the tab.

You can also use the keyboard shortcut:

- Windows and Linux: `Ctrl+R`
- macOS: `Command+R`

Chrome lets you change extension shortcuts from `chrome://extensions/shortcuts`.

## Choose what gets cleared

Open the extension's options page and select the data types you want to clear. Your choices are saved and used every time you run the extension.

To open the options, right-click the extension icon and select **Options**.

## Install from the Chrome Web Store

1. Open the [Chrome Web Store](https://chromewebstore.google.com/) and search for **Clear Data for Current Site**.
2. Open the extension's listing and select **Add to Chrome**.
3. Select **Add extension** when Chrome asks for confirmation.
4. To keep it visible, open the Extensions menu in Chrome's toolbar and pin the extension.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder.

## Permissions

- `activeTab` identifies the site in the active tab when you invoke the extension.
- `browsingData` removes the selected data for that site.
- `storage` remembers your clearing preferences.
