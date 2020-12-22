# Baily.io - My Personal Space

A simple Gatsby app for displaying all things me 💁‍♀️

![Deploy baily.io](https://github.com/BailyTroyer/baily-io/workflows/Deploy%20baily.io/badge.svg?branch=main)

## Getting Started

This repo uses Docker, and Make to simplify the build and run process when developing locally or deploying assets in a CI pipeline. As always if there is anything missing in the documentation, feel free to make a PR with the `docs` label. 

#### 1. Running Locally

Simply run the following Make commands to build and run the dev server. Note, we are using Docker with a volume to allow live updates in a running container. No need to worry about installing anything locally with Node/NPM :)

* `make build` - Build the image
* `make run` - Run the dev server
* `make test` - Run jest unit tests
* `make lint` - Run linting 
* `make build-static-assets` - Build production assets
* `make push-static-assets` - Deploy to S3, updating Cloudfront dist

#### 2. Project Structure

Ignoring all those darn Gatsby config files at the root, this is the codebase layout.

```
├── public          // Static assets
├── src
│   ├── components  // Shared (Atomic) UI elements
│   ├── image       // Image assets
│   └── pages       // Routable site pages
├── Makefile        // Infra commands
└── Package.json    // Dependencies & Scripts
```

#### 3. PR/CI Process

**PR Pipeline:** Github actions will build, lint and test the local app on any PRs.

**Merge Pipeline:** On merge to `main` Github actions will deploy to Vercel for all to see!

## Contributing

You may contribute in several ways by creating/proposing new features, fixing bugs, improving documentation and adding more to the README! Find more information in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Monitoring & Deploying

I am using AWS S3 in combination with CloudFront to deploy static assets on US-EAST edge locations.
