CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS presentation (
    version INT NOT NULL,
    content TEXT NOT NULL,
    UNIQUE(version)
);

CREATE TABLE IF NOT EXISTS report (
    kmom INT NOT NULL,
    content TEXT NOT NULL,
    UNIQUE (kmom)
);

DELETE FROM users;
DELETE FROM presentation;
DELETE FROM report;

INSERT INTO presentation (version, content)
VALUES
(1,
"My name is David Jeppsson, I was raised in the city of Malmö.
I live together with my girlfirend Ingrid and our dog Bilbo.
We might soon move to Stockholm but that is another story.

I enjoy playing different kinds of board games together with my firends.
I also enjoy being outdoors in nature. A hobby that i share with my dog.

During my youth I played a plethera of sports, including American Fotball and Ice Hockey.
I still play hockey, in a beer league.
Which is basically an amature league and we don't drink beer while playing... yet.

Ave!"
);

INSERT INTO report(kmom, content)
VALUES
(1,
"## README, report-vue-app
### Project setup
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```
### Lints and fixes files
```
npm run lint
```
### Customize configuration
```
See Configuration Reference
```
###GitHub
[Repo on GitHub](https://github.com/DavidJeppsson/report-vue-app)
"),
(2,
"Prutt");
