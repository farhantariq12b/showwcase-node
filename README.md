# SHOWCASE

This project is a Nodejs application.

## Prerequisites

Before running the project, make sure you have the following software installed on your machine:

- Node.js v16: You can use NVM (Node Version Manager) to install Node.js v16.
- You need mongo db setup to run this project. You can install mongodb from here [Mongo DB installation](https://www.mongodb.com/docs/manual/installation/) as per you machine.
  

## Installation

### Installing Node.js v16 using NVM

1. Install NVM (Node Version Manager) by following the instructions at [NVM repository](https://github.com/nvm-sh/nvm#installation). Choose the installation method that is suitable for your operating system.

2. Once NVM is installed, open a new terminal window or restart your terminal.

3. Install Node.js v16 by running the following command:

   ```bash
   nvm install 16
   ```

4. Verify that Node.js v16 is installed by running the following command:

   ```bash
   node --version
   ```

   You should see the version number of Node.js v16.

### Starting the APPLICATION

1. Install project dependencies by navigating to the project directory in your terminal and running the following command:

   ```bash
   npm install
   ```

2. To update the environemt variable. open config/default.json file and update it accordingly  Ensure database credentials are correct.


3. Once the installation is complete, you can start the application by running the following command:

   ```bash
   npm run dev
   ```

   This command will start the development server and provide you with a local URL where you can access the application in your browser.

## Running Tests

To run tests for the project, use the following command:

```bash
npm run test
```

This command will execute the tests and display the test results in the terminal.

## Postman

Postman collection is added in order to test
[ShowCase Postman](https://github.com/farhantariq12b/showwcase-node/blob/main/ShowCase.postman_collection.json)
