var protractor = require('protractor');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var User    = require('../../server/api/user/user.model.js');

Object.defineProperty(
  protractor.promise.Promise.prototype,
  'should',
  Object.getOwnPropertyDescriptor(Object.prototype, 'should')
);

before(function(done) {
 User.remove({username:{$in:['test-user']}},done);
})

after(function(done) {
 User.remove({username:{$in:['test-user']}},done);
})

describe('signup', function () {

  it('user signup and logs out', function () {
     browser.get('http://localhost:9000')
     element(by.css('.signup')).click()
     element(by.model('form.username')).sendKeys('test-user')
     element(by.model('form.email')).sendKeys('test-user@email.com')
     element(by.model('form.password')).sendKeys('123')
     element(by.css('.signupBtn')).click()

     browser.getCurrentUrl().should.eventually.contain("profile");

     element(by.css('.menuBtn')).click()
     element(by.css('.logout')).click()

     browser.getCurrentUrl().should.eventually.contain("login");

  })
})


describe('login', function () {

  it('user logs in with incorrect username', function () {
     browser.get('http://localhost:9000')
     element(by.css('.login')).click()
     element(by.model('form.username')).sendKeys('wrong-user')
     element(by.model('form.password')).sendKeys('123')
     element(by.css('.loginBtn')).click()
     element(by.css('.error')).getText().should.eventually.contain('Incorrect username or password.')
  })

  it('user logs in with incorrect password', function () {
     browser.get('http://localhost:9000')
     element(by.css('.login')).click()
     element(by.model('form.username')).sendKeys('test-user')
     element(by.model('form.password')).sendKeys('wrongPassword')
     element(by.css('.loginBtn')).click()
     element(by.css('.error')).getText().should.eventually.contain('Incorrect username or password.')
  })

  it('user logs in successfully', function () {
     browser.get('http://localhost:9000')
     element(by.css('.login')).click()
     element(by.model('form.username')).sendKeys('test-user')
     element(by.model('form.password')).sendKeys('123')
     element(by.css('.loginBtn')).click()
     browser.getCurrentUrl().should.eventually.contain("profile");
  })

})

describe('user settings', function () {
  it('user changes password, logs out and logins in with new password', function () {
     browser.get('http://localhost:9000/settings')
     element(by.model('form.password')).sendKeys('1')
     element(by.css('.settingsBtn')).click()
     browser.getCurrentUrl().should.eventually.contain("profile");

     element(by.css('.menuBtn')).click()
     element(by.css('.logout')).click()

     element(by.css('.login')).click()
     element(by.model('form.username')).sendKeys('test-user')
     element(by.model('form.password')).sendKeys('1')
     element(by.css('.loginBtn')).click()

     browser.getCurrentUrl().should.eventually.contain("profile");

     element(by.css('.menuBtn')).click()
     element(by.css('.logout')).click()
  })
})
