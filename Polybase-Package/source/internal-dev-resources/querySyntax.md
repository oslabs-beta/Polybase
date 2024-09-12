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
    # mongo find users name="Harley Davidson"
    $Polybase: mongo find polybase_mongo_collection _id="66dcc19369d2d12812633326" name
    ```


### 2. **Redis**: 

    ```bash
    $Polybase: redis json.get sample_bicycle:1001
    ``

## 3. **PostgreSQL**:

      ```bash
    $Polybase: postgres select polybase_postgres customer_id=7 name
    ```

## 4. **InfluxDB** 

    ```bash
    QUERY
    $Polybase: influx query air_temp_degc station_id=41052 _value

    # WRITE
    # $Polybase: influx write air_temp_degc station_id=41052 station_name="South of St. John, VI" _value=-2.5

    # DELETE
    # $Polybase: influx delete air_temp_degc station_id=41052 start=2024-09-10T00:00:00Z stop=2024-09-11T00:00:00Z

    ```

### 5. **Neo4j** 

    ```bash
    # mongo find users name="Harley Davidson"
    $Polybase: neo4j match Movie title="Joker"
    ```
