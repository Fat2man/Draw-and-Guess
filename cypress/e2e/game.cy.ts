/// <reference types="cypress" />

describe('Draw and Guess Game', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Draw and Guess Game').should('be.visible');
  });

  it('should display the game interface correctly', () => {
    cy.get('header').should('contain', 'Draw and Guess Game');
    cy.contains('button', 'Start Game').should('be.visible');
    cy.get('canvas').should('exist');
  });

  it('should start a game when clicking Start Game', () => {
    cy.contains('button', 'Start Game').click();
    cy.contains('Round 1').should('be.visible');
    cy.contains('is drawing now').should('be.visible');
  });

  it('should display the chat interface correctly', () => {
    cy.contains('Chat').should('be.visible');
    cy.get('input[placeholder="Type your guess..."]').should('exist');
    cy.contains('button', 'Send').should('exist');
  });

  it('should allow sending chat messages', () => {
    cy.get('input[placeholder="Type your guess..."]').type('test message');
    cy.contains('button', 'Send').click();
    cy.contains('Player 1: test message').should('be.visible');
  });

  it('should display player list correctly', () => {
    cy.contains('Players').should('be.visible');
    cy.contains('Player 1').should('be.visible');
    cy.contains('Player 2').should('be.visible');
    cy.contains('Player 3').should('be.visible');
    cy.contains('Player 4').should('be.visible');
  });

  it('should show drawing tools after starting game', () => {
    cy.contains('button', 'Start Game').click();
    cy.contains('Drawing Tools').should('be.visible');
    cy.contains('button', '✏️').should('be.visible');
    cy.contains('button', '🧽').should('be.visible');
    cy.contains('button', '🪣').should('be.visible');
  });
});