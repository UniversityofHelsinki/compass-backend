## Setting Necessary Headers Locally

When developing or testing the application locally, you need to set the necessary headers to simulate the authentication process handled by Shibboleth in a production environment.

- `eppn`: The unique identifier for the user.
- `eduPersonAffiliation`: The user's affiliation (optional).
- `preferredlanguage`: The user's preferred language (optional).
- `hyGroupCn`: The user's group (optional).
- `displayName`: The user's display name (optional).

## Installation

After cloning the repository, navigate to the project directory and run:
npm install

This will install all the necessary dependencies.

## Usage
Create .env.development.local file to host environment variables
DB_HOST=http://localhost:8000
ALLOWED_ORIGIN=http://localhost:3000
NODE_ENV=development


# Node Express template project

This project is based on a GitLab [Project Template](https://docs.gitlab.com/ee/user/project/#create-a-project-from-a-built-in-template).

Improvements can be proposed in the [original project](https://gitlab.com/gitlab-org/project-templates/express).

## CI/CD with Auto DevOps

This template is compatible with [Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/).

If Auto DevOps is not already enabled for this project, you can [turn it on](https://docs.gitlab.com/ee/topics/autodevops/#enable-or-disable-auto-devops) in the project settings.

### Developing with Gitpod

This template has a fully-automated dev setup for [Gitpod](https://docs.gitlab.com/ee/integration/gitpod.html).

If you open this project in Gitpod, you'll get all Node dependencies pre-installed.
