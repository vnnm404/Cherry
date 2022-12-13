<div align="center">
<h1>🍒 Cherry</h1>
<p><b>Cherry</b> is a self-hosted online multiplayer chess app.</p>
<p>It connects two <b>berries</b> (<i>players</i>) with a <b>stem</b> (<i>server</i>) to produce a cherry!</p>
<p>Its simple and minimal, written in <code>nodejs</code>, <code>express</code> and <code>socket.io</code > . It uses websockets to enable multiplayer and supports private matches through invite links so you can play with your friends! It also supports user authentication with cookies and sessions.</p>
<a href="#getting-started">Getting started</a> • <a href="#installation">Installation</a> • <a href="#usage">Usage</a>
</div>

## Getting Started
Make sure you have `node` and all the dependencies installed.

Simply run the command
```shell
npm start
```
in the root directory of the project and navigate to the url in any modern browser.

## Installation
First, clone the repository with the command,
```shell
git clone https://github.com/vnnm404/Cherry.git
```

then install `node` for whichever platform you are on, then install the following dependencies,
`express`, `socket.io`, `ejs`, `http`, `assert` and  `path`. This can be done with the comand,
```shell
npm install express ejs http assert path socket.io
```

`cd` into the repo then run the app with the command,
```shell
npm start
```
to start the app, its locally hosted by default on `PORT` 5500. This can be configured in `./src/index.js` or by setting the `PORT` environment variable.

## Usage
First start the app, then nagivate to the hosted url in modern browser, and wait to find a match or generate a link and play with a friend! This is demonstrated in the followings gifs.

To simply play with another user, both users can simply play as guest and their matches aren't saved on the server.
![play](https://user-images.githubusercontent.com/94549325/207280367-e9eefc57-96ae-4d41-921d-bc855727bcf8.gif)

To play with a friend we can generate a link, this link is shared with your friend and this sets up a match between you both instead of matchmaking with random people.
![links](https://user-images.githubusercontent.com/94549325/207280409-4dba699d-597d-4d09-8306-a893d319f7db.gif)

To login, visit the root `/` page or the `/index` page and either sign up or sign in. No restrictions are imposed other than the password must be non empty and the username can't already exist when signing up. A login produces a session for authentication which expires in a day.
![auth](https://user-images.githubusercontent.com/94549325/207280455-9ea7b0e1-c89a-4679-965a-777bb0a60c86.gif)
