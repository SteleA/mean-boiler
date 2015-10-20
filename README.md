![travis](https://img.shields.io/travis/alemik/mean-boiler.svg)
![codecov](https://img.shields.io/codecov/c/github/alemik/mean-boiler.svg)

# Mean boiler
A ready to use boilerplate to get your projects up and running (JUST DO IT!).

[Demo](http://meanboiler.herokuapp.com)

Some goddies:
* Google material design
* Browsersync reload
* Facebook login
* Token based auth
* Salt encrypted passwords
* Email with sendgrid

## Installation
`git clone https://github.com/alemik/mean-boiler.git`

`npm install && bower install`
## Usage
#### Startup
Make sure you have gulp installed globally. Startup the app by using `gulp`
#### local process.env for API credentials and other sensitive data
Add local process.env by creating a .env file in the app root folder. Make sure you don't push this file to github.

appName=App namev<br>
appSecret=setYourAppSecret <br>
supportEmail=support@meanapp.io <br>
sendgridUsername=yourSendGridUsername <br>
sendgridPassword=yourSendGridPassword <br>
facebookAppID=yourFacebookAppId <br>
facebookAppSecret=yourFacebookAppSecret

#### Build for production
`gulp build` Dist directory will contain the production ready code.
#### Run tests
`npm test`
## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Create a feature and a unit test for it
4. Make sure you have semantic-release-cli installed globally
5. Add to staging: `git add -A`
6. npm run commit
7. Push to the branch: `git push origin my-new-feature`
8. Submit a pull request :D

## History
TODO: Write history

## Credits
TODO: Write credits

## License
MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
