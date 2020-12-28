# ============================================================================
# Globals
# ============================================================================
DOCKER_IMAGE:=baily-io
VERSION:=latest
S3_URL:=s3://baily.io

.DEFAULT_GOAL:=build

# ============================================================================
# Development Commands
# ============================================================================

.PHONY: build
build:
	docker build -t $(DOCKER_IMAGE):$(VERSION) .

.PHONY: test
test:
	docker-compose run --rm $(DOCKER_IMAGE) yarn test

.PHONY: lint
lint:
	docker-compose run --rm $(DOCKER_IMAGE) yarn lint

.PHONY: run
run:
	docker-compose down
	docker-compose up

.PHONY: lock-dependencies
lock-dependencies:
	docker run \
		-v $(shell pwd):/node \
		-it $(DOCKER_IMAGE):$(VERSION) yarn install

.PHONY: clean
clean:
	rm -rf public .cache node_modules test_output

# ============================================================================
# CI/CD Commands
# ============================================================================

.PHONY: build-static-assets
build-static-assets:
	docker-compose run --rm $(DOCKER_IMAGE) yarn build

.PHONY: push-static-assets
push-static-assets:
	aws s3 sync public $(S3_URL) --cache-control max-age=30
