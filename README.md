## How to run app

To build app in a Docker container run:
```sh
make build
```

To run app in a Docker container run:
```sh
make run
```

Deploy on Heroku:
```sh
heroku login
heroku container:login
heroku container:push web -a scrumpokerbackend
heroku container:release web -a scrumpokerbackend
```