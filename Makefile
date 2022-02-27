image-name="alxbckr/scrumpokerbackend"

build:
	docker build -t $(image-name) .

run:
	docker run -p 3000:80 -d $(image-name)