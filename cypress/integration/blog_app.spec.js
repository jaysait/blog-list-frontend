describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Jay Smith',
      username: 'jsmith',
      password: 'Test123',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });
  it('front page can be opened', function () {
    cy.contains('blogs');
  });

  it('user can login', function () {
    cy.get('#username').type('jsmith');
    cy.get('#password').type('Test123');
    cy.get('#login-button').click();

    cy.contains('Jay Smith logged-in');
  });
  /* it.only('login fails with wrong password', function () {
    cy.get('#username').type('mluukkai');
    cy.get('#password').type('wrong');
    cy.get('#login-button').click();

    cy.get('.error').contains('wrong credentials');
  }); */

  describe('when logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('jsmith');
      cy.get('#password').type('Test123');
      cy.get('#login-button').click();
    });

    it('a new blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('#title').type('testing e2e title');
      cy.get('#author').type('testing e2e author');
      cy.get('#url').type('testing e2e url');
      cy.get('#create-button').click();
      cy.contains('testing e2e title');
    });
    it('like a blog', function () {
      cy.contains('create new blog').click();
      cy.get('#title').type('testing e2e title');
      cy.get('#author').type('testing e2e author');
      cy.get('#url').type('testing e2e url');
      cy.get('#create-button').click();
      cy.contains('view').click();
      cy.get('#like-button').click();
      cy.contains('likes 1');
    });
    it('delete a blog', function () {
      cy.contains('create new blog').click();
      cy.get('#title').type('testing e2e title');
      cy.get('#author').type('testing e2e author');
      cy.get('#url').type('testing e2e url');
      cy.get('#create-button').click();
      cy.contains('view').click();
      cy.get('#delete-button').click();
    });
  });
});
