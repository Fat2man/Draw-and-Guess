// Cypress custom commands
// This file contains custom commands that extend Cypress's built-in commands

// Example of a custom command:
// Cypress.Commands.add('login', (email, password) => { ... })

// For more comprehensive examples visit:
// https://on.cypress.io/custom-commands

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Declare the Cypress namespace to add custom commands
declare namespace Cypress {
  interface Chainable<Subject = any> {
    // Add definitions for any custom commands here
  }
}