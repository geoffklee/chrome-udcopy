chrome.contextMenus.create({
    id: "copyUnideskLink",
    title: "Copy selection as Unidesk link",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "copyUnideskLink") {
      const selectedText = info.selectionText;
      const url = new URL(tab.url);
      const domain = url.hostname.replace(".unidesk.ac.uk", "");
      const link = `https://unidesk.ac.uk/${domain}/${selectedText}`;
      try {
        await copyToClipboard(link, tab.id);
        showNotification("Copied to clipboard");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  });
  
  async function copyToClipboard(text, tabId) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      await chrome.scripting.executeScript({
        target: { tabId },
        function: (text) => {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        },
        args: [text],
      });
      showNotification("Copied to clipboard");
    }
  }
  
  function showNotification(message, tabId) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "Copy as Unidesk Link",
      message: message,
      priority: 2,
    }, (notificationId) => {
      chrome.notifications.onClicked.addListener((id) => {
        if (id === notificationId) {
          // Handle the notification click event
          console.log("Notification clicked");
        }
      });
    });
  }