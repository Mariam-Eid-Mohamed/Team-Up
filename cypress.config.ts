import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Base URL for the application - matches Vite dev server default
    baseUrl: "http://localhost:5173",
    
    // Setup node event listeners
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    // Viewport settings for consistent testing
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Default command timeout (how long to wait for commands)
    defaultCommandTimeout: 10000,
    
    // Request timeout for API calls
    requestTimeout: 10000,
    
    // Response timeout for API calls
    responseTimeout: 10000,
  },
});
