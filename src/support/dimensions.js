// support/dimensions.js

// Function to get the viewport dimensions
export function getViewportDimensions() {
    const width = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );

    const height = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    );

    // You might want to subtract a fixed number if you want some margin around the container
    // or deal with a navigation bar, footer, etc.
    return { width, height };
}
