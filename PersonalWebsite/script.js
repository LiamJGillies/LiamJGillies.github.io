// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(`Generated color: ${color}`); // Debug: Log the generated color
  return color;
}

// Select the <h1> element
const heading = document.querySelector(".fallback-text");
const heading2 = document.querySelector(".heading-container");

// Create the circle mask element
const circleMask = document.createElement("div");
circleMask.classList.add("circle-mask");
document.body.appendChild(circleMask);

// Variable to store the current random color
let currentColor = getRandomColor(); // Generate an initial random color

// Function to apply the current color to the heading
function applyCurrentColor() {
  console.log(`Applying color: ${currentColor}`); // Debug: Log the color being applied
  heading.style.background = `linear-gradient(to right, ${currentColor}, ${currentColor})`;
  heading.style.webkitBackgroundClip = "text";
  heading.style.color = "transparent"; // Make the text transparent to show the gradient
}

// Apply the initial random color on page load
applyCurrentColor();

// Generate a new random color when the mouse enters the <h1>
heading2.addEventListener("mouseover", () => {
  console.log("Mouse entered the <h1>");
  getRandomColor(); // Generate a new random color
  currentColor = getRandomColor(); // Generate a new random color
  applyCurrentColor(); // Apply the new color
});

// Update the circle mask position based on mouse movement
document.addEventListener("mousemove", (e) => {
  const maskSize = 300; // Diameter of the circle
  const maskX = e.clientX; // Cursor's X position relative to the viewport
  const maskY = e.clientY; // Cursor's Y position relative to the viewport

  // Update the circle mask position
  circleMask.style.left = `${maskX}px`;
  circleMask.style.top = `${maskY}px`;

  const rect = heading.getBoundingClientRect(); // Get the bounding box of the <h1> element
  const relativeX = e.clientX - rect.left; // X position relative to the <h1>
  const relativeY = e.clientY - rect.top; // Y position relative to the <h1>

  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    heading.style.clipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
    heading.style.webkitClipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
    heading.style.color = "transparent"; // Keep the text transparent to show the gradient
  } else {
    // Reset the text color to black but keep the clip-path effect
    heading.style.color = "black"; // Reset text color to black
    heading.style.clipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
    heading.style.webkitClipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
  }
});
