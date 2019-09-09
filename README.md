# Api Rest Nodejs, Mongodb, Express, Sage pay

Api Rest Nodejs, Mongodb, Express, Sage pay frontend: https://github.com/edwindhc/ipc-electron

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
[Node v10.16.3+](https://nodejs.org "Nodejs.org")
[Yarn](https://yarnpkg.com "Yarnpkg.com")
```

### Installing

Clone the repo and make it yours:

```bash
git clone --depth 1 https://github.com/edwindhc/ipc-api-sagepay.git
cd ipc-api-sagepay
```

Install dependencies:

```bash
yarn
```

Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn start
```

## Docker

```bash
# run container locally
yarn docker:dev
or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Lint

```bash
# lint code with ESLint
yarn lint
```

## Running the data faker

```bash
# run user and product with data faker
yarn faker
```
### Credentials test

Credential generate by data faker: username: Edwin@gmail.com password: 123456

## Documentation

```bash
# generate and open api documentation
yarn docs
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
