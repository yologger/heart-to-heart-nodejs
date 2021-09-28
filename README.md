# RESTful API Server for heart to heart based on Node.js

## Introduction 
This project is RESTful API server for Heart to Heart application. You can also check `Heart to Heart` application for **Android** [here](https://github.com/yologger/heart-to-heart-android-legacy) and **iOS** [here](https://github.com/yologger/heart-to-heart-ios).


## Platform
* Heroku 

## Dependencies
Heart to Heart for server has following dependencies:
* Node.js
* express.js
* body-parser
* cookie-parsesr
* [multer](https://github.com/expressjs/multer) to upload files
* mysql2
* sequelize
* [passport](https://github.com/jaredhanson/passport) for OAuth2
* passport-local
* bcrypt
* dotenv
* cross-env
* helmet
* hpp
* jsonwebtoken
* morgan
* pm2
* winston

## Features
#### `Implemented`
* Sign up
* Authorization (OAuth 2.0)
* Create new post
	- Choose and upload multiple images 
* Show all posts
    - Infinite scrolling
* Upload avatar image

#### `Not Implemented Yet`
* HTTPS
* Follow other users
* Like post
* Find password
* Change password