# Documentation for the folder structure.

## The structure follows a simple pattern:

- ## src:
  - Has all the source code
- ## documentation:
  - Will have all the documetation regarding the project.
- ## test:
  - Not yet implemented but the plan is to have the tests as in the same structure as the files they are testing.

---

## Folders inside the src

- ## config:
  - **Has all the code for connecting to the database, currently that means the MongoDB Atlas online hosted database.**
  - Also has a MySQL directory which is still in progress to create a database.
  - Has the configuration file for the npm passport middleware.
- ## helpers:
  - **Has the useful functions which are needed all around the project.**
  - For example:
    - Capitalizing a string
    - The constants for the game and the strings
    - _TODO: maybe create a directory called language and use the descriptions and lines here like an android projects string.xml_
- ## middlewares:
  - **Has all the applications middlewares which aren't installed via npm.**
  - Inside there are 4 folders:
    - common: Has the render middleware
    - error: Has the error handling components
    - game: Has the game specific middlewares separeted by when they are needed in time.
    - webauth: The authentication middlewares
- ## models:
  - **User and Lobby Schema for mongoose**
- ## routes:
  - **The routing**
- ## services:
  - **Has all the code which is somewhere else is needed but in order to have clear code and readable middlewares the huge codes can be found here**
- ## views:
  - **Contains the frontend**
  - Currently static html and ejs

---

## Files that are needed but not included:

- The node_moules, can be installed by:
  > `npm i`
- A .env file with the attributes:

  > MONGODB\_URL= _A local MongoDB server link for testing_

  > PORT= _The port via which the application is hosted_

  > MONGODB\_DATABASE\_NAME= _Name of the local database_

  > DB\_CONNECTION\_STRING= _The real database's connection url_

  > PRODUCTION= **true** / **false** _Depending on which database we use if the local production is false if the cloud than it is true_
