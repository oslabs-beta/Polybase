![polybase-logo](https://github.com/user-attachments/assets/041ba430-00bc-41bf-8159-dcd3d02a877a)


## About
___

[![License](https://img.shields.io/badge/License-MIT-008CBA)](#)
[![Release](https://img.shields.io/badge/Release-v1.0.3-00A676)](#)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-FFD700)](#)
[![Polybase Landing Page](https://img.shields.io/badge/Website-polybase.dev-0056D2)](https://www.polybase.dev)

Polybase is a robust Node.js library designed for seamless integration and synchronization across SQL, NoSQL, graph, and time-series databases. With a built-in CLI, developers can easily manage configurations, query databases, and handle cross-database operations efficiently.

<br>

## Technologies 
___

### Core Backend 
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?logo=neo4j&logoColor=white)
![InfluxDB](https://img.shields.io/badge/InfluxDB-22ADF6?logo=influxdb&logoColor=white)


### Frontend and Presentation
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)


### Build and Deployment Tools
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=white)
![Rollup](https://img.shields.io/badge/Rollup-EC4A3F?logo=rollup.js&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black)
![Babel](https://img.shields.io/badge/Babel-F9DC3E?logo=babel&logoColor=black)
![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white)

<br>

## Features 
___

<b>• Multi-Database Support:</b> Handles MongoDB, PostgreSQL, Redis, Neo4j, and InfluxDB with a unified interface.

<b>• Powerful CLI:</b> Supports 10+ commands (e.g., status, retry, clear) for streamlined debugging and database management.

<b>• State Management:</b> Tracks connections and configurations for local and remote databases.

<b>• Circular Dependency Handling:</b> Ensures scalability and maintainability.

<b>• Robust Rollback Mechanism:</b> Guarantees 100% rollback success for critical commands.

<b>• Seamless Configuration Loading:</b> Reads JSON and .env files for environment-based setups.

<br>

## Installation 
___

Install Polybase via npm:
<b>npm install polybase-package</b>

<b>Usage</b>

Import Polybase in Your Project
const Polybase = require('polybase-package');

To start the Polybase CLI, use <b>node userRun.js</b>. 

The Polybase CLI is initialized, providing a command-line interface for managing database configurations and connections. 

Checks for Configuration Files:
    - Polybase-Config.json: The program checks if this file exists in the current working directory. If not found, it creates a template JSON file with placeholders for supported databases.
    - .env File: Similarly, checks if a .env file exists. If missing, generates a template .env file with key-value placeholders for environment-based configurations.

<b>Provides Templates for Configuration</b>

For Polybase-Config.json:


{

    "mongo": {
        "url": "url",
        "database": "your-database-name"
    },

    "postgres": {
        "host": "localhost",
        "port": port,
        "user": "your-username",
        "password": "your-password",
        "database": "your-database-name"
    },

    "redis": {
        "host": "localhost",
        "port": port
    },

    "neo4j": {
        "url": "url",
        "username": "your-username",
        "password": "your-password"
    },

    "influx": {
        "url": "url",
        "token": "your-token",
        "bucket": "your-bucket",
        "org": "your-org"
    }

}

For .env:

<b>MongoDB Configuration</b>

MONGO_URI=

MONGO_DATABASE=

<b>PostgreSQL Configuration</b>

POSTGRES_USER=

POSTGRES_HOST=

POSTGRES_DATABASE=

POSTGRES_PASSWORD=

POSTGRES_PORT=

<b>Redis Configuration</b>

REDIS_HOST=

REDIS_PORT=

REDIS_USERNAME=

REDIS_PASSWORD=

<b>InfluxDB Configuration</b>

INFLUX_URL=

INFLUX_TOKEN=

INFLUX_ORG=

INFLUX_BUCKET=


<b>Neo4j Configuration</b>

NEO4J_URI=

NEO4J_USERNAME=

NEO4J_PASSWORD=

Prompts for Manual Configuration: Logs instructions for filling in the placeholder values in the JSON or .env file to set up the required database configurations.

Ready for Commands: Once configurations are provided, the CLI is fully operational, allowing users to run commands like status, retry, configs, and more.

<b>CLI Overview</b>

Polybase includes a CLI for direct database interaction. Run the CLI with: <b>node userRun.js</b>

<b>Available Commands</b>
- <b>status:</b> View the connection status of all configured databases.
- <b>retry:</b> Retry failed database connections.
- <b>clear:</b> Clears the terminal and resets CLI state.
- <b>configs:</b> Displays the current database configurations.
- <b>help:</b> Lists all available commands and potential query executions.


<b>Supported Databases</b>
- <b>MongoDB:</b> Document-based NoSQL database.
- <b>PostgreSQL:</b> Relational SQL database.
- <b>Redis:</b> Key-value store for caching and real-time operations.
- <b>Neo4j:</b> Graph database for relationship-based data models.
- <b>InfluxDB:</b> Time-series database for metrics and monitoring.


<b>Contributing</b>

We welcome contributions! To get started:
- Fork the repository.
- Create a new branch: git checkout -b feature-name.
- Commit your changes: git commit -m 'Add feature'.
- Push to the branch: git push origin feature-name.
- Submit a pull request.

<b>License</b>

Polybase is licensed under the MIT License. See LICENSE for details.

<b>Acknowledgments</b>

Polybase was developed with a focus on simplifying multi-database operations and enhancing developer productivity. Special thanks to the contributors and supporters who made this project possible.


<body>

  <h1>Meet The Devs!</h1>
  <ul class="name-list">
    <li class="name-item">
      <span>Alazar Aklilu</span>
      <div class="badges">
        <a href="https://www.linkedin.com/in/alazaraklilu/">
          <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
        </a>
      </div>
    </li>
    <li class="name-item">
      <span>Nathan Patterson</span>
      <div class="badges">
        <a href="https://www.linkedin.com/in/nathan-patterson-aba798251/">
          <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
        </a>
      </div>
    </li>
    <li class="name-item">
      <span>Gavin Shadinger</span>
      <div class="badges">
        <a href="https://www.linkedin.com/in/gavin-shadinger/">
          <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
        </a>
      </div>
    </li>
    <!-- Add more names as needed -->
  </ul>

</body>
