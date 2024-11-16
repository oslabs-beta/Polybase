![polybase-logo](https://github.com/user-attachments/assets/041ba430-00bc-41bf-8159-dcd3d02a877a)


## About

[![License](https://img.shields.io/badge/License-MIT-008CBA)](#)
[![Release](https://img.shields.io/badge/Release-v1.0.3-00A676)](#)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-FFD700)](#)
[![Polybase Landing Page](https://img.shields.io/badge/Website-polybase.dev-0056D2)](https://www.polybase.dev)

Polybase is a robust Node.js library designed for seamless integration and synchronization across SQL, NoSQL, graph, and time-series databases. With a built-in CLI, developers can easily manage configurations, query databases, and handle cross-database operations efficiently.

<br>

## Technologies 

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

<b>• Multi-Database Support:</b> Handles MongoDB, PostgreSQL, Redis, Neo4j, and InfluxDB with a unified interface.

<b>• Powerful CLI:</b> Supports 10+ commands (e.g., status, retry, clear) for streamlined debugging and database management.

<b>• State Management:</b> Tracks connections and configurations for local and remote databases.

<b>• Circular Dependency Handling:</b> Ensures scalability and maintainability.

<b>• Robust Rollback Mechanism:</b> Guarantees 100% rollback success for critical commands.

<b>• Seamless Configuration Loading:</b> Reads JSON and .env files for environment-based setups.

<br>

## Installation and Usage

<b>Installation</b>

To install Polybase via npm, run:

```
npm install polybase-package
```
<br>

<b>Usage</b>

<b>Step 1:</b> Import Polybase into Your Project

```
const Polybase = require('polybase-package');
```


<b>Step 2:</b> Run the following command to start the Polybase CLI:

```
node userRun.js
```

Once initialized, Polybase provides a command-line interface for managing database configurations and connections. It also performs the following configuration file checks in the current working directory:

<b>Polybase-Config.json:</b>
If not found, the CLI creates a template JSON file with placeholders for supported databases.

```
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
```

<b>.env File:</b>
If not found, the CLI generates a template .env file with key-value placeholders for environment-based configurations to be used in your own Polybase-Config.js file, which you can export via module.exports.

```
# MongoDB Configuration
MONGO_URI=
MONGO_DATABASE=

# PostgreSQL Configuration
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_DATABASE=
POSTGRES_PASSWORD=
POSTGRES_PORT=

# Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=

# InfluxDB Configuration
INFLUX_URL=
INFLUX_TOKEN=
INFLUX_ORG=
INFLUX_BUCKET=

# Neo4j Configuration
NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=
```

```
module.exports = {
  mongoUri: process.env.MONGO_URI || 'your-default-mongo-uri',
  postgresUser: process.env.POSTGRES_USER || 'your-default-postgres-user',
  redisHost: process.env.REDIS_HOST || 'localhost',
  influxToken: process.env.INFLUX_TOKEN || 'your-default-influx-token',
  neo4jUri: process.env.NEO4J_URI || 'your-default-neo4j-uri'
};
```


<b>Ready for Commands</b>

Once configurations are provided, the CLI is fully operational, allowing users to run commands like status, retry, configs, and more.

<b>• status:</b> View the connection status of all configured databases.

<b>• retry:</b> Retry failed database connections.

<b>• clear:</b> Clears the terminal and resets CLI state.

<b>• configs:</b> Displays the current database configurations.

<b>• help:</b> Lists all available commands and potential query executions.

<b>In this version 1.0.3 launch, the package functions to set up and check database configurations. We are actively working on additional functionality to allow developers query databases and handle cross-database operations (see 'help' command). More commands coming soon!</b>

<br>

<b>Supported Databases</b>

<b>• MongoDB:</b> Document-based NoSQL database.

<b>• PostgreSQL:</b> Relational SQL database.

<b>• Redis:</b> Key-value store for caching and real-time operations.

<b>• Neo4j:</b> Graph database for relationship-based data models.

<b>• InfluxDB:</b> Time-series database for metrics and monitoring.

<br>

## The Team

<body>

<table>
  <tr>
    <td>Alazar Aklilu</td>
    <td>Software Engineer</td>
    <td>
      <a href="https://github.com/alazaraklilu">
        <img src="https://img.shields.io/badge/GitHub-%23181717.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" />
      </a>
    </td>
    <td>
      <a href="https://www.linkedin.com/in/alazaraklilu/">
        <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" />
      </a>
    </td>
  </tr>
  <tr>
    <td>Nathan Patterson</td>
    <td>Software Engineer</td>
    <td>
      <a href="https://www.linkedin.com/in/nathandevs/r">
        <img src="https://img.shields.io/badge/GitHub-%23181717.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" />
      </a>
    </td>
    <td>
      <a href="https://github.com/npatt14">
        <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" />
      </a>
    </td>
  </tr>
  <tr>
    <td>Gavin Shadinger</td>
    <td>Software Engineer</td>
    <td>
      <a href="https://github.com/MrGamerGuy24">
        <img src="https://img.shields.io/badge/GitHub-%23181717.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" />
      </a>
    </td>
    <td>
      <a href="https://www.linkedin.com/in/gavin-shadinger/">
        <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" />
      </a>
    </td>
  </tr>
</table>

</body>

<br>

## Contributing

We welcome contributions! To get started:

<b>1. Clone the repository:</b>

```
git clone https://github.com/oslabs-beta/Polybase.git
```

<b>2. Create a new branch for your work:</b>

```
git checkout -b feature-name
```

<b>3. Decide where to contribute:</b>

• Contribute to the Polybase-Package

• Contribute to the Polybase-Platform (Website)

<b>4. Commit your changes:</b>

```
git commit -m 'Add feature'
```

Push your branch:

```
git push origin feature-name
```

<b>5. Submit a pull request to one of the following branches, depending on your work:</b>

• main (requires review)

• dev (requires review)


<b>Note:</b> Please do not push or merge any changes into the following branches: 

• alazar

• nathan

• gavin


<br>

## Acknowledgments 

Polybase was developed with a focus on simplifying multi-database operations and enhancing developer productivity. This project was built through OSLabs, a nonprofit tech accelerator dedicated to advancing open-source software and fostering innovation within the tech community.

<br>

## License

Polybase is licensed under the MIT License. See LICENSE for details.

