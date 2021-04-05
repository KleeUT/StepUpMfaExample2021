This repo is example code for my dev.to post [Adding an extra level of authentication with Step Up MFA](https://dev.to/kleeut/adding-an-extra-level-of-authentication-with-step-up-mfa-95j)

# Directory structure

## api

This directory includes some example code for setting up an Express and Typescript API with 3 endpoints.

- 1 public
- 1 requiring authentication
- 1 requiring recent MFA authentication

### Build and run

To build and run this navigate to the directory:

1. Install dependencies with `npm i`
2. Start the server with `npm start`

## web

A small React application that can be used to access the server. This is built on top of the Create React App. This application knows how to request that Auth0 confront the user with an MFA check before continuing.

## Build and run

To build and run this navigate to the directory:

1. Install dependencies with `npm i`
2. Start the server with `npm start`

# actions

This directory contains the actions for Auth0. These are written in JavaScript and have no dependencies.

## Build and run

These need to be run from within the Auth0 Actions environment.
There is some information for how to create and deploy actions can be found in my post on dev.to [Trying out Auth0 Actions to build Conditional MFA](https://dev.to/kleeut/trying-out-auth0-actions-to-build-conditional-mfa-371k).
