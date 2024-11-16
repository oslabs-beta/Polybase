![Polybase Logo](./polybase.png)


<b><h2>About</h2></b>
___

[![License](https://img.shields.io/badge/License-MIT-orange)](#)
[![Release](https://img.shields.io/badge/Release-v1.0.3-blue)](#)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](#)
[![Coverage](https://img.shields.io/badge/Coverage-95%25-yellowgreen)](#)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange)](#)

Polybase is a robust Node.js library designed for seamless integration and synchronization across SQL, NoSQL, graph, and time-series databases. With a built-in CLI, developers can easily manage configurations, query databases, and handle cross-database operations efficiently.

<b>Features</b>
- <b>Multi-Database Support:</b> Handles MongoDB, PostgreSQL, Redis, Neo4j, and InfluxDB with a unified interface.
- <b>Powerful CLI:</b> Supports 10+ commands (e.g., status, retry, clear) for streamlined debugging and database management.
- <b>State Management:</b> Tracks connections and configurations for local and remote databases.
- <b>Circular Dependency Handling:</b> Ensures scalability and maintainability.
- <b>Robust Rollback Mechanism:</b> Guarantees 100% rollback success for critical commands.
- <b>Seamless Configuration Loading:</b> Reads JSON and .env files for environment-based setups.

<h1>Installation</h1>

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
