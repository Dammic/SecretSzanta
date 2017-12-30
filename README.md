#HOW TO RUN:

To begin developing the application, go to the main catalog and run:
```
npm install
```
That will install all required depencencies

As we build vendor dependencies separately from our project, you need to build them. Run:
```
npm run build:dll
```
You will need to fire that command whenever you add a new library.

Then to build our project files and start the server, run:
```
npm run dev
```
That will build the application files, start the watcher process and run the server.


To test the project, simply run:
```
npm run test
```



#IMPORTANT DEV NOTES:
- everytime you add a new vendor library, make sure to require it inside src/vendors.js file! Otherwise
it will not work inside the project,
- everytime you create a new scss file, make sure to include it inside src/styles/main.scss
