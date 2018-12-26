# HOW TO RUN:

To begin developing the application, go to the main catalog and run:
```
npm install
```

In order to build our project files and start the server, run:
```
npm run dev
```
That will build the application files, start the watcher process and run the server.

To test the project, simply run:
```
npm run test
```

# DOCKER CONTAINER

Project has configured docker container, first you must have installed [docker.](https://www.docker.com/)
Present configuration is suitable only for production.

To build container, in the main catalog run:

```
sudo docker build -t secret-szanta .
```

Then to run container:

```
sudo docker run -p 80:3000 secret-szanta
```

You can go inside of a container thanks to:

```
docker exec -it <containerName> bash
```

# JENKINS

There is jenkins configured for this repository, available at ``a.astralfox.com:8080`` (you need credentials to access it).
It's main purpose for now is to build project and run tests on each pull request to ensure quality.
The files used to configure builds for jenkins are located inside scripts/
