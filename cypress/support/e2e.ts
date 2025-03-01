// Import cypress commands and global configurations here
import './commands';

// Hide fetch/XHR requests from command log
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Cypress namespace declaration
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
    }
  }
}