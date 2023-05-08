# NestJS App with Docker

This is an example NestJS app that can be run using Docker. The app allows users to upload and store files, and includes Swagger documentation for exploring the API.

## Prerequisites

Before you begin, you will need to have the following installed on your system:

- Docker
- docker-compose

## Getting Started

1. Clone the repository to your local machine.

2. Open the docker-compose.yml file then head for line: (device: Copy path from your system) and replace the path for the uploads volume with the path to the directory on your local machine where you want to store uploaded files.

3. Build and start the Docker containers by running the following command from the project directory:

```sh
docker-compose up --build
```

> This will build the and start the containers.

Once the containers are running, you can access the app at: ` http://localhost:3000`.

To explore the Swagger documentation, navigate to `http://localhost:3000/api` in your web browser.
