// Importing necessary assets (icons) for the extension UI
import editIcon from "~/assets/edit.svg";
import insertIcon from "~/assets/insert.svg";
import generateIcon from "~/assets/generate.svg";
import regenerateIcon from "~/assets/regenerate.svg";

// Main content script definition, targeting LinkedIn pages
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"], // Matches LinkedIn domain URLs
  main() {
    // HTML template for the custom modal that will be injected into the page
    const modalHtml = `
      <div id="custom-modal" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 4000;">
        <div id="modal-content" style="background: white; border-radius: 8px; width: 100%; max-width: 570px; padding: 20px;">
          <div id="messages" style="margin-top: 10px; max-height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column;"></div>
          <div style="margin-bottom: 10px;">
            <input id="input-text" type="text" placeholder="Enter your prompt..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>
          </div>
          <div style="text-align: right; margin-top: 12px;">
            <button id="insert-btn" style="background: #fff; color: #666D80; padding: 8px 16px; border: 2px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
              <img src="${insertIcon}" alt="Insert" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px;"> 
              <b>Insert</b>
            </button>
            <button id="generate-btn" style="background: #007bff; color: white; padding: 8px 16px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer;">
              <img src="${generateIcon}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px"> 
              <b>Generate</b>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modal = document.getElementById("custom-modal") as HTMLDivElement;
    const modalContent = document.getElementById("modal-content") as HTMLDivElement;
    const generateBtn = document.getElementById("generate-btn") as HTMLButtonElement;
    const insertBtn = document.getElementById("insert-btn") as HTMLButtonElement;
    const inputText = document.getElementById("input-text") as HTMLInputElement;
    const messagesDiv = document.getElementById("messages") as HTMLDivElement;

    let lastGeneratedMessage = "";
    let parentElement: HTMLElement | null = null;

    // Event listener to close the modal when clicking outside the modal content
modal.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // Close the modal only if the click is outside the modal content
  if (!modalContent.contains(target)) {
    modal.style.display = "none"; // Close the modal
  }
});

// Ensure clicks inside the modal content do not close the modal
modalContent.addEventListener("click", (event: MouseEvent) => {
  event.stopPropagation(); // Prevent bubbling to the outer modal
});

    // Click event to handle showing modal and other interactions
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element is a message form content editable
      if (
        target.matches(".msg-form__contenteditable") ||
        target.closest(".msg-form__contenteditable")
      ) {
        parentElement =
          target.closest(".msg-form__container") ||
          target.closest(".msg-form__contenteditable");

        const contentContainer = parentElement?.closest(
          ".msg-form_msg-content-container"
        );

        // Ensure elements are valid before manipulating them
        if (parentElement && contentContainer) {
          contentContainer.classList.add(
            "msg-form_msg-content-container--is-active"
          );
          parentElement.setAttribute("data-artdeco-is-focused", "true");
        }

        // Create and display the edit icon if it doesn't exist
        if (parentElement && !parentElement.querySelector(".edit-icon")) {
          parentElement.style.position = "relative";

          const icon = document.createElement("img");
          icon.className = "edit-icon";
          icon.src = editIcon;
          icon.alt = "Custom Icon";
          icon.style.position = "absolute";
          icon.style.bottom = "5px";
          icon.style.right = "5px";
          icon.style.width = "30px";
          icon.style.height = "30px";
          icon.style.cursor = "pointer";
          icon.style.zIndex = "1000";
          parentElement.appendChild(icon);

          // Event listener for the edit icon to show the modal
          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.style.display = "flex";
          });
        }
      }
    });

    const generateMessage = () => {
      // Sample message for generation (could be replaced with an actual API call)
      const messages = [
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.",
      ];
      return messages[0]; 
    };

    // Event listener for the 'Generate' button
    generateBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent bubbling up to the document

      // Get the user input
      const inputValue = inputText.value.trim();
      if (!inputValue) {
        alert("Please enter a prompt before generating."); // Alert if input is empty
        return; // Exit if input is empty
      }

      // Display the user's message in the messages div
      const userMessageDiv = document.createElement("div");
      userMessageDiv.textContent = inputValue;
      Object.assign(userMessageDiv.style, {
        backgroundColor: "#DFE1E7",
        color: "#666D80",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "5px",
        textAlign: "right",
        maxWidth: "80%",
        alignSelf: "flex-end",
        marginLeft: "auto",
      });
      messagesDiv.appendChild(userMessageDiv);

      // Disable the generate button and show loading state
      generateBtn.disabled = true;
      generateBtn.textContent = "Loading...";
      generateBtn.style.backgroundColor = "#666D80";

      // Simulate an API call with a timeout to generate a message
      setTimeout(() => {
        try {
          lastGeneratedMessage = generateMessage(); // Get the generated message
          const generatedMessageDiv = document.createElement("div");
          generatedMessageDiv.textContent = lastGeneratedMessage;
          Object.assign(generatedMessageDiv.style, {
            backgroundColor: "#DBEAFE",
            color: "#666D80",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "5px",
            textAlign: "left",
            maxWidth: "80%",
            alignSelf: "flex-start",
            marginRight: "auto",
          });

          // Add generated message to the messages div
          messagesDiv.appendChild(generatedMessageDiv);
          messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom

          // Enable the generate button and change text to 'Regenerate'
          generateBtn.disabled = false;
          generateBtn.style.backgroundColor = "#007bff";
          generateBtn.style.color = "white";
          generateBtn.innerHTML = `<img src="${regenerateIcon}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;

          // Reset input field and show the insert button
          inputText.value = "";
          insertBtn.style.display = "inline-block";
        } catch (error) {
          console.error("Error generating message:", error);
          alert("An error occurred while generating the message. Please try again."); // Alert user in case of an error
          // Reset button state in case of an error
          generateBtn.disabled = false;
          generateBtn.textContent = "Generate";
          generateBtn.style.backgroundColor = "#007bff";
        }
      }, 500);
    });

    // Event listener for the 'Insert' button to insert the generated message into the message input area
    insertBtn.addEventListener("click", () => {
      if (lastGeneratedMessage && parentElement) {
        // Remove aria-label to avoid any screen reader issues
        parentElement.removeAttribute("aria-label");

        // Find or create a <p> tag inside the contenteditable area
        let existingParagraph = parentElement.querySelector("p");

        if (!existingParagraph) {
          existingParagraph = document.createElement("p");
          parentElement.appendChild(existingParagraph);
        }

        // Ensure existingParagraph is defined before setting text
        if (existingParagraph) {
          existingParagraph.textContent = lastGeneratedMessage;
        }

        const placeholder = parentElement.querySelector('.msg-form__placeholder');
        if (placeholder) {
           placeholder.innerHTML = ''; 
        }

        const sendButton = parentElement.querySelector('.msg-form__send-button');
        if (sendButton) {
          sendButton.removeAttribute("disabled"); // Remove the disabled attribute
        }

        insertBtn.style.display = "none";
        modal.style.display = "none";
      } else {
        alert("No message available to insert."); // Alert if no message is generated
      }
    });

    // Add focus event listeners to input elements
    const inputElements = [inputText, generateBtn, insertBtn];
    inputElements.forEach((element) => {
      element.addEventListener("focus", () => {
        if (parentElement) {
          parentElement.setAttribute("data-artdeco-is-focused", "true");
        }
      });
    });

    
  },
});
