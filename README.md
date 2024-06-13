# 2048 game with JS.

Use arrows or **WASD** to play.

- [DEMO LINK](https://kostyaniekrasov.github.io/2048-game/)

This project requires Node.js version 14. Please follow the steps below to set up the project locally.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup

### 1. **Check Node.js version**

First, check if you have Node.js installed and if it's version 14. Open your terminal and run:

```
node -v
```

If the output shows a different version than 14, proceed to the next step. Otherwise, skip to step 3.

### 2. **Install NVM (Node Version Manager)**

If you don't have Node.js version 14 installed, you can use NVM to install and manage multiple Node.js versions. Follow the instructions on the [NVM GitHub repository](https://github.com/nvm-sh/nvm#installing-and-updating) to install NVM for your operating system.

After installing NVM, run the following command to install Node.js version 14:

```
nvm install 14
```

**Use Node.js version 14**
Once you have Node.js version 14 installed, you need to tell NVM to use it for this project:

```
nvm use 14
```

### 3. **Run project locally**

Navigate to the project directory and install the dependencies:

```
npm install
```

After installing the dependencies, you can start the development server:

```
npm start
```

This will start the server and make the project available at `http://localhost:3000` (or a different port specified in the project configuration).

**Now you should have the project running locally with Node.js version 14.**
