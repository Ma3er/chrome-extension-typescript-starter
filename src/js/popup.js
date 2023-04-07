const saveCommandButton = document.getElementById("save-command-button");
const commandTextarea = document.getElementById("command-textarea");
const commandList = document.getElementById("command-list");

function saveCommand() {
  // Get command from textarea
  const command = commandTextarea.value.trim();
  if (!command) {
    return;
  }

  // Add command to list
  const commandItem = document.createElement("li");
  const commandText = document.createTextNode(command);
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.onclick = function() {
    commandList.removeChild(commandItem);
    chrome.storage.sync.get("commands", function(result) {
      const commands = result.commands || [];
      const index = commands.indexOf(command);
      if (index !== -1) {
        commands.splice(index, 1);
        chrome.storage.sync.set({commands: commands});
      }
    });
  };
  commandItem.appendChild(commandText);
  commandItem.appendChild(deleteButton);
  commandList.appendChild(commandItem);

  // Save command to storage
  chrome.storage.sync.get("commands", function(result) {
    const commands = result.commands || [];
    commands.push(command);
    chrome.storage.sync.set({commands: commands});
  });

  // Clear textarea
  commandTextarea.value = "";
}

function loadCommands() {
  chrome.storage.sync.get("commands", function(result) {
    const commands = result.commands || [];
    for (let i = 0; i < commands.length; i++) {
      const commandItem = document.createElement("li");
      const commandText = document.createTextNode(commands[i]);
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.onclick = function() {
        commandList.removeChild(commandItem);
        chrome.storage.sync.get("commands", function(result) {
          const commands = result.commands || [];
          const index = commands.indexOf(commands[i]);
          if (index !== -1) {
            commands.splice(index, 1);
            chrome.storage.sync.set({commands: commands});
          }
        });
      };
      commandItem.appendChild(commandText);
      commandItem.appendChild(deleteButton);
      commandList.appendChild(commandItem);
    }
  });
}

// Load commands from storage when popup opens
loadCommands();

// Save command to storage and add it to the list when "Save Command"
