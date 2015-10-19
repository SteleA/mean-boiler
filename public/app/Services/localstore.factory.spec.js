describe('LocalStore factory', function () {

  beforeEach(module('MeanApp'));
  var $httpBackend, LocalStore, rootScope;

  beforeEach(inject(function (_$httpBackend_, _LocalStore_, $rootScope) {
    LocalStore = _LocalStore_;
    $httpBackend = _$httpBackend_;
    rootScope = $rootScope;
  }))

  describe('getItem', function () {

    it('getItem should exist', function () {
      expect(LocalStore.getItem).to.exist;
    })

    it('getItem should equal user', function () {
      LocalStore.setItem('user','user')
      expect(LocalStore.getItem('user')).to.equal('user')
    })

  })

  describe('setItem', function () {

    it('setItem should exist', function () {
      expect(LocalStore.setItem).to.exist;
    })

    it('getItem should equal null', function () {
      LocalStore.setItem('user')
      expect(LocalStore.getItem('user')).to.be.null
    })

  })


})
