Feature('novel');

Scenario('test create book', ({ I }) => {
  I.amOnPage("/")
  I.seeElement({ css: '#name' })
  I.fillField({ css: '#name' }, "e2etest")
  I.click(".btn")
  I.type("test")
  I.click("OK")

});
