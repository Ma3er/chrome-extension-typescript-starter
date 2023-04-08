import { useState, useEffect } from "react";

export default function Popup() {
  const [commands, setCommands] = useState([]);
  const [inputCommand, setInputCommand] = useState("");

  useEffect(() => {
    // Load commands from storage when component mounts
    chrome.storage.sync.get("commands", (result) => {
      if (result.commands) {
        setCommands(result.commands);
      }
    });
  }, []);

  const handleSaveCommand = () => {
    // Add command to the list of commands
    setCommands((prevCommands) => [...prevCommands, inputCommand]);

    // Save updated list of commands to storage
    chrome.storage.sync.set({ commands: [...commands, inputCommand] });

    // Clear input field
    setInputCommand("");
  };

  const handleDeleteCommand = (index) => {
    // Remove command from list of commands
    const updatedCommands = commands.filter((_, i) => i !== index);
    setCommands(updatedCommands);

    // Save updated list of commands to storage
    chrome.storage.sync.set({ commands: updatedCommands });
  };

  const handleInputChange = (event) => {
    setInputCommand(event.target.value);
  };

  return (
    <div>
      <h2>ChatGPT Command Saver</h2>
      <textarea value={inputCommand} onChange={handleInputChange}></textarea>
      <button id="save-btn">Save Command</button>
      <ul>
        {commands.map((command, index) => (
          <li key={index}>
            {command}
            <button onClick={() => handleDeleteCommand(index)}>Delete</button>
            <button onClick={() => console.log(command)}>Copy</button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Add event listener to save button
  useEffect(() => {
    const saveButton = document.getElementById("save-btn");
    saveButton.addEventListener("click", handleSaveCommand);

    // Clean up event listener on unmount
    return () => saveButton.removeEventListener("click", handleSaveCommand);
  }, [commands]);
}
