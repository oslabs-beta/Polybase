# Polybase CLI Query Format
**`Living Document`**

## Overview 
Living doc to outline CLI-query structure used in Polybase CLI interface. 


- 08/31: Current setup designed to handle mock database operations only --simulating unconnected interactions with the various database types such as MongoDB, Redis, PostgreSQL, and InfluxDB.

## Query Structure

Each query entered into the Polybase CLI follows this general format:

### Components

- **`dbType`**: specifies type of database you are interacting with -determines which database adapter will handle the operation - ex `mongo`, `redis`, `postgres`, and `influxdb` (need to standardize)

- **`operation`**: specific database operation you want to perform - either vary depending on the database type or a set of universal operations - `find`, `get`, `select`, and `query`.

- **`params...`**: any additional para s required to execute the operatioin -e.g. collection names, query conditions, SQL statements, etc.

## Example Queries

### 1. **MongoDB** 

    ```bash
    mongo find users name="Harley Davidson"
    ```

### 2. **Redis**: 

    ```bash
    postgres select * from users where id=69
    ```

## 3. **PostgreSQL**:

    ```bash
    influxdb query 'SELECT withdrawss FROM user_acounts WHERE time > now() - 1h'
    ```

## 4. **InfluxDB** 

    ```bash
    mongo find users name="Mia Khalifa"
    ```

