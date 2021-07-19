Feature('novel');

Scenario('test something', ({ I }) => {
  I.amOnPage("/")
  I.seeElement({ css: '#name' })
  I.fillField({ css: '#name' }, "e2etest")
  I.amAcceptingPopups();

  I.wait(2)
  I.click(".btn")
  I.wait(2)
  I.type("test")
  I.wait(2)
  I.acceptPopup()

  //I.click("OK")
  I.wait(2)

});
