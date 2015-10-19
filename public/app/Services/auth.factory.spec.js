describe('Auth factory', function () {

  beforeEach(module('MeanApp'));
  var Auth, $httpBackend, LocalStore, rootScope;

  beforeEach(inject(function (_Auth_, _$httpBackend_, _LocalStore_, $rootScope) {
    Auth = _Auth_;
    LocalStore = _LocalStore_;
    $httpBackend = _$httpBackend_;
    rootScope = $rootScope;
  }))


  describe('login', function () {
    it('login should exist', function () {expect(Auth.login()).to.exist;})

    it('should login then send user to profile page and save token/user data to LocalStore', function () {
        sinon.spy(rootScope, '$emit');

        var state = 'default';
        var succeeded = false;

        $httpBackend.whenGET('app/Main/main.html').respond(function(){return state = 'main'});
        $httpBackend.whenGET('app/Account/Profile/profile.html').respond(function(){return state = 'profile'});

        $httpBackend.expectPOST('/api/auth/local')
          .respond({"token":"validToken"});

        $httpBackend.expectGET('/api/user/profile/me')
          .respond({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

        Auth.login()
          .then(function success() {
            succeeded = true;
          });

        $httpBackend.flush();

        expect(rootScope.$emit).to.have.been.calledWith('user');

        expect(succeeded).to.be.true;

        expect(state).to.equal('profile');

        expect(LocalStore.getItem('auth-token'))
          .to.equal("validToken");

        expect(LocalStore.getItem('user'))
          .to.deep.equal({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

      })
    })
    describe('signup', function () {
      it('signup should exist', function () {expect(Auth.signup()).to.exist;})
      it('should signup then send user to profile page and save token/user data to LocalStore', function () {
        var state = 'default';
        var succeeded = false;

        $httpBackend.whenGET('app/Main/main.html').respond(function(){return state = 'main'});
        $httpBackend.whenGET('app/Account/Profile/profile.html').respond(function(){return state = 'profile'});

        $httpBackend.expectPOST('/api/user')
          .respond({"token":"validToken"});

        $httpBackend.expectGET('/api/user/profile/me')
          .respond({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});


        Auth.signup()
          .then(function success() {
            succeeded = true;
          });
        $httpBackend.flush();

        expect(succeeded).to.be.true;

        expect(state).to.equal('profile');

        expect(LocalStore.getItem('auth-token'))
          .to.equal("validToken");

        expect(LocalStore.getItem('user'))
          .to.deep.equal({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

      })
    })

    describe('userIs', function () {
      it('userIs should exist', function () {expect(Auth.userIs()).to.exist;})
      it('should return user data from API', function(){


        var user;
        $httpBackend.whenGET('app/Main/main.html').respond(200);

        $httpBackend.expectGET('/api/user/profile/me', {"Accept":"application/json, text/plain, */*","Authorization":"Bearer validToken"})
          .respond({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

        Auth.userIs()
          .success(function(res){
            user = res;
          })

        $httpBackend.flush();


        expect(user).to.deep.equal({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

      })
    })

    describe('userSettings', function () {
      it('userSettings should exist', function () {expect(Auth.userSettings()).to.exist;})
      it('should change user email', function () {

        var succeeded = false;
        var state = 'default';

        $httpBackend.expectPUT('/api/user', {email: 'testchange@mail.com'})
          .respond({"message":"success"});

          $httpBackend.whenGET('app/Main/main.html').respond(function(){return state = 'main'});
          $httpBackend.whenGET('app/Account/Profile/profile.html').respond(function(){return state = 'profile'});

          $httpBackend.expectGET('/api/user/profile/me')
            .respond({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"testchange@mail.com","__v":0,"role":"user"});

          Auth.userSettings({email: 'testchange@mail.com'})
            .then(function(response){
              succeded = true;
            })

          $httpBackend.flush();

          expect(succeded).to.be.true;
          expect(state).to.equal('profile');
          expect(LocalStore.getItem('user'))
            .to.deep.equal({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"testchange@mail.com","__v":0,"role":"user"});



      })
    })

    describe('loginWithToken', function () {
      it('loginWithToken should exist', function () {expect(Auth.loginWithToken()).to.exist;})
      it('should login a user with a token', function(){

        $httpBackend.whenGET('app/Main/main.html').respond(200);
        $httpBackend.whenGET('app/Account/Profile/profile.html').respond(200);

        $httpBackend.expectGET('/api/user/profile/me')
          .respond({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});


        Auth.loginWithToken('validToken');
        $httpBackend.flush();


        expect(LocalStore.getItem('user'))
          .to.deep.equal({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});
      })
    })

    describe('logout', function () {
      it('logout should exist', function () {expect(Auth.logout).to.exist;})
      it('should logout a user and check localstore for token and user items', function () {
        $httpBackend.whenGET('app/Main/main.html').respond(200);
        sinon.spy(rootScope, '$emit');

        Auth.logout();
        $httpBackend.flush();

        expect(LocalStore.getItem('user')).to.be.null;
        expect(LocalStore.getItem('auth-token')).to.be.null;
        expect(rootScope.$emit).to.have.been.calledWith('user');
      })
    })

    describe('forgotpassword', function () {
      it('forgot should exist', function () {expect(Auth.forgot()).to.exist;})
      it('should send username and get response success', function(){
        var res;
        $httpBackend.expectGET('/api/user/forgotpassword/test').respond("success");
        $httpBackend.whenGET('app/Main/main.html').respond(200);

        Auth.forgot('test').success(function(response){
          res = response;
        })
        $httpBackend.flush();

        expect(res).to.equal('success')
      })
    })

    describe('resetPassword', function () {
      it('resetPassword should exist', function () {expect(Auth.resetPassword()).to.exist;})
      it('should post new password and reset token then get response success', function(){
        var res;
        $httpBackend.expectPOST('/api/user/resetPassword', {"password":"newPassword","resetToken":"validResetToken"}).respond({"message":"success"});
        $httpBackend.whenGET('app/Main/main.html').respond(200);

        Auth.resetPassword({"password":"newPassword","resetToken":"validResetToken"})
          .success(function(response){
          res = response;
        })
        $httpBackend.flush();

        expect(res).to.deep.equal({"message":"success"})
      })
    })

    describe('refresh', function () {
      it('refresh should exist', function () {expect(Auth.refresh()).to.exist;})
      it('should get user from API', function(){
        sinon.spy(rootScope, '$emit');

        $httpBackend.whenGET('app/Main/main.html').respond(200);
        $httpBackend.whenGET('app/Account/Profile/profile.html').respond(200);

        $httpBackend.expectGET('/api/user/profile/me')
          .respond({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

        Auth.refresh();
        $httpBackend.flush();

        expect(LocalStore.getItem('user'))
          .to.deep.equal({"_id":"55ec4ba2fec10ace2ea68cef","username":"test","email":"test@mail.com","__v":0,"role":"user"});

        expect(rootScope.$emit).to.have.been.calledWith('user');
      })
    })





})
