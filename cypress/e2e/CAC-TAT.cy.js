const { faker } = require('@faker-js/faker');

describe('Central de Atendimento ao Cliente TAT', () => {

  const user = {}

  beforeEach(() => {
    cy.visit('./src/index.html');

    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.text = faker.lorem.paragraph();

  });

  it('verifica o título da aplicação', () => { 
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT');
  });

  it('preenche os campos obrigatórios e envia o formulário', () => {
    //preenchendo o campo NOME
    cy.get('#firstName').type('Daniel');

    //preenchendo o campo SOBRENOME
    cy.get('#lastName').type('Araújo Berriel');

    //preenchendo o campo EMAIL
    cy.get('#email').type('danielberriel163@gmail.com');

    //preenchendo o campo COMO PODEMOS TE AJUDAR? OBS.: Como o texto é relativamente grande estamos usando a opção {delay:0}, para a digitação acontecer de forma imediata XD
    cy.get('#open-text-area')
    .type('Gostaria de saber mais sobre testes de Software! Gostaria de saber mais sobre testes de Software! Gostaria de saber mais sobre testes de Software!', {delay: 0});

    //clickando no botão ENVIAR
    cy.contains('button', 'Enviar').click();

  });

  it('exibe mensagem de erro ao submeter um formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Daniel');
    cy.get('#lastName').type('Araújo Berriel');

    //preenchendo o campo EMAIL com FORMATO INVÁLIDO
    cy.get('#email').type('danielberriel163gmail.com');

    cy.get('#open-text-area')
    .type('Gostaria de saber mais sobre testes de Software! Gostaria de saber mais sobre testes de Software! Gostaria de saber mais sobre testes de Software!', {delay: 0});

    cy.contains('button', 'Enviar').click();

    //Verificando a exibição da mensagem de erro
    cy.get('.error').should('be.visible').and('contain', 'Valide os campos obrigatórios!');
  });

  it('tenta preencher o campo TELEFONE com letras', () => {
    cy.get('#phone').as('telefone').type('abcdefgh')
    
    cy.get('@telefone').should('have.value', '')
  });

  it('exibe mensagem de erro quando o teste quando o TELEFONE se torna OBRIGATÓRIO, mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Daniel');
    cy.get('#lastName').type('Araújo Berriel');
    cy.get('#email').type('danielberriel163@gmail.com');

    cy.get('#open-text-area')
    .type('Gostaria de saber mais sobre testes de Software!', {delay: 0});

    //Ação para tornar o telefone obrigatório
    cy.get('#phone-checkbox').check();

    cy.contains('button', 'Enviar').click();

    cy.get('.error').should('be.visible').and('contain', 'Valide os campos obrigatórios!');
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Daniel').should('be.value', 'Daniel').clear().should('be.value', '');
    cy.get('#lastName').type('Araújo Berriel').should('be.value', 'Araújo Berriel').clear().should('be.value', '');
    cy.get('#email').type('danielberriel163@gmail.com').should('be.value', 'danielberriel163@gmail.com').clear().should('be.value', '');
    cy.get('#phone').type('21998265811').should('be.value', '21998265811').clear().should('be.value', '');
  });

  it('exibe menssagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible').and('contain', 'Valide os campos obrigatórios!');
  });

  context('GUI custom commands', () => {
    it('envia o formulário com sucesso usando um comando customizado', () => {
      cy.fillMandatoryFieldsAndSubmit(user);
    });
  });

  it('Selecione um produto (YouTube) por seu texto', () => {
    cy.get('select').select('YouTube').should('be.value', 'youtube');
  });

  it('Selecione um produto (Mentoria) por seu valor (value)', () => {
    cy.get('select').select('mentoria').should('be.value', 'mentoria');
  });

  it('Selecione um produto (Blog) por seu índice', () => {
    cy.get('select').select(1).should('be.value', 'blog');
  });

  it('selects a random option from a select dropdown', () => {
    cy.get('select option').its('length', {log: false}).then(n => {
      cy.get('select').select(Cypress._.random(1, n - 1));
    })
  });

  it('marca o tipo de atendimento Feedback', () => {
    cy.get('input[type="radio"]').check('feedback').should('be.checked');
  });

  it('marca cada tipo de atendimento no input radio', () => {
    cy.get('input[type="radio"]').each($radio => {
      cy.wrap($radio).check().should('be.checked');
    });
  });

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('#check input[type="checkbox"]').check().should('be.checked').last().uncheck().should('not.be.checked');

  });

  it('selecione um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json')
    .then(input => {
      expect(input[0].files[0].name).to.equal('example.json');
    });
  });

  it('selecione um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
    .then(input => {
      expect(input[0].files[0].name).to.equal('example.json');
    })
  });

  it('selecione um arquivo para o qual foi dado um alias', () => {
    cy.fixture('example.json', { encoding: null }).as('exampleFile');
    cy.get('input[type="file"]')
    .selectFile('@exampleFile')
    .then(input => {
      expect(input[0].files[0].name).to.equal('example.json');
    });
  });

  it('verifica que a políticaaa de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank');
  });

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click();
  });
  
  it('testa a página da política de privacidade de forma idependente', () => {
    cy.visit('./src/privacy.html');

    cy.get('h1').contains('CAC TAT - Política de Privacidade');
  });

  //Simular o teste em um dispositivo móvel
  /**1- Direto pela linha de comando:
    cypress run --config viewportWidth=375, viewportHeight=667
    OBS.: Os valores de altura e largura podem ser alterados conformee suas necessidades.
  **/
 /**2- Via arquivo de configurações: 
    Por padrão, o Cypress utiliza a largura de 1000px e a altura de 660px.
    Porém, é possível sobrescrever estes valores via arquivo de configuração (cypress.config.js).
    Com o arquivo modificado, os testes serão executados em um viewport mobile, tanto quando rodar em modo headless(cypress run), como quando executados em modo interativo (cypress open).
    Lembrando que o modo headless realiza os testes sem mostrar a interface gráfica, o navegador está rodando, só não renderiza nada. 
 **/ 

    

})