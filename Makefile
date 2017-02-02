NAME=xolocalvendors/chronos-shim-hapi
VERSION=latest

test:
	@istanbul cover node_modules/.bin/lab

debug-test:
	node_modules/.bin/lab --debug-brk --recursive -w

clean:
	@rm -f npm-shrinkwrap.json
	@rm -rf ./node_modules
	npm install --production
	npm prune

install:
	@rm -rf ./node_modules
	npm install

docker-build:
	@docker build -t $(NAME) -f docker/Dockerfile .

run: docker-build
	@docker-compose -f docker/docker-compose.yml run --rm pluginDev

run-debug-test: docker-build
	@docker-compose -f docker/docker-compose.yml run --service-ports --rm pluginDebug

jenkins-run: docker-build
	docker-compose -f docker/docker-compose.yml run --rm pluginJenkins

jenkins-build:
	make jenkins-cover && \
	gulp build

jenkins-cover:
	istanbul cover node_modules/.bin/_mocha -- --debug --recursive && \
	CODECLIMATE_REPO_TOKEN=abcXYZ123 codeclimate-test-reporter < coverage/lcov.info

lint:
	node_modules/.bin/eslint --fix src/ test/

.PHONY: test debug-test clean install docker-build run run-debug-test jenkins-run jenkins-build jenkins-cover lint
