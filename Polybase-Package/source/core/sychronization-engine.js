/**
 * synchronization-engine.js
 * 
 * manages synchronization of data across diff databases. 
 * Focus on data consistency & resolving conflicts --generates synchronization plans and 
 * applies changes to the target dbs based on these plans.
 * 
 * Layman's: It keeps data in sync across different databases, making sure everything matches up and fixing any differences, by creating and following a plan to update the databases.
 */

function synchronizeData(source, target) {
    // console.log('source/synchronization-engines | running synchronizeData from', source, 'to', target);
    //simulating synchronization
    return { syncResult: `Sync completed between ${source} and ${target}` };
}

module.exports = { synchronizeData };

// amazon checkout
/**
 * DATABASES:
 * 'influxDB' the timestamp of the action : the user id that made the action : the action type
 * 'mongoDB' the user_id, the user_name, geo
 * 'neo4j' 'nodes: the geo: (zipcode) ---> 'type of item (specific items)'
 */

{
    //usser id in mongo ===> new profile of purchase ins Influ
}
//mongo insert new user "davis"

/**
 *  more detail:

Two-way synchronization: Data is updated in both directions between two systems. For instance, 
if you update a record on your local machine, it is synced with the server, and vice versa.
 This ensures that both ends have the most up-to-date information.

One-way synchronization: Data flows in only one direction, from a source system to a target system.
 This is often used in backups, where the local system reflects the data on a central server.

Real-time synchronization: Data is synchronized as soon as changes happen, often using techniques 
like pub/sub (publish-subscribe), websockets, or other forms of communication to keep systems updated immediately.

Batch synchronization: Data is synced at periodic intervals, such as once a day, rather than instantly.
 * 
 * 
 * 
 * 
 */

/*           

User Story: Task Management App
As a user, I want to manage my tasks efficiently, so I can track my progress, collaborate with teammates, and prioritize my work.

Databases and Their Roles with CRUD Operations

1. PostgreSQL (Relational Database for Task Data)
    
Role: Storing task details like task name, due date, and completion status.
CRUD Operations:
    - Create: Add a new task with task_name, due_date, and status.
    - Read: Retrieve tasks for a specific user.
    - Update: Change the status of a task (e.g., when completed).
    - Delete: Remove a task when it’s done or no longer needed.
Example: PostgreSQL stores the task list where each task has a task_id, task_name, and status.

2. Redis (In-Memory Cache for Real-Time Data)

Role: Caching active tasks for quick access and faster display.
CRUD Operations:
    - Create/Update: Cache active tasks for immediate access.
    - Read: Quickly retrieve cached tasks.
    - Delete: Remove the cache when tasks are updated or completed.
Example: Redis caches the user's currently active tasks, making task retrieval instantaneous.

3. MongoDB (Document Store for User Profiles)

Role: Storing user details like preferences, settings, and notification choices.
CRUD Operations:
    - Create: Add a new user profile with details like username, email, and preferences.
    - Read: Retrieve user profile and preferences.
    - Update: Update user settings, such as preferred notification times.
    - Delete: Remove the user profile when the account is deleted.
Example: MongoDB stores the user’s settings and preferences, allowing users to adjust their preferences for notifications.

4. InfluxDB (Time-Series Database for Task Tracking)

Role: Tracking the time when tasks are created, updated, or completed.
CRUD Operations:
    - Create: Log when a task is created or completed with a timestamp.
    - Read: View the history of when tasks were completed.
Example: InfluxDB tracks timestamps of user activities, such as when tasks are marked complete, allowing users to analyze their productivity over time.

5. Neo4j (Graph Database for User-Task Relationships)

Role: Managing relationships between users and tasks, and tracking collaborations or task assignments.
CRUD Operations:
    - Create: Add a relationship between a User and a Task, such as ASSIGNED or COLLABORATING.
    - Read: Retrieve tasks assigned to or shared by a specific user.
    - Update: Modify relationships (e.g., reassign tasks to another user).
    - Delete: Remove relationships when tasks are completed or reassigned.
Example: Neo4j stores the relationships between users and tasks. For instance, it tracks which tasks are assigned to a user or shared among team members.

Flow:
- PostgreSQL: Stores the core task data, including task names, due dates, and statuses.
- Redis: Caches active tasks for quick display and updates.
- MongoDB: Holds user profiles and preferences, enabling customization of the task management experience.
- InfluxDB: Tracks and logs when tasks are created or completed, helping users monitor their productivity over time.
- Neo4j: Manages the relationships between users and tasks, such as task assignments, collaborations, and interactions between team members.


*/






























// /* Amazon User Story 

// As an Amazon customer, I want my checkout process to be fast and reliable, so that I can complete my purchase quickly and securely.

// User Story Flow:
// PostgreSQL holds the product details (Product), including price and stock. During checkout, an Order entity is created for the user, including the total price and shipping details.
// Redis manages the CartSession, storing the user’s cart contents temporarily for fast retrieval as the user adds or removes items during checkout.
// MongoDB retrieves the user's profile (UserProfile), including their shipping address and location (geo_location), to display relevant shipping options and promotions.
// Neo4j identifies relationships between the User and Product, such as previous purchases (BOUGHT) and product reviews (REVIEWED), to recommend additional products the user might want to add to their cart.
// InfluxDB logs every action during the checkout process (ActionLog), tracking when the user adds items, starts the checkout, and completes payment, enabling Amazon to track real-time data flow for performance optimization.

// /**
//  * when usercheckout, add order_id to postgres
//  * 
//  */

// Databases and Their Roles with Nodes and Attributes

// 1. PostgreSQL (Relational Data Storage)

// Role: Storing structured data like product inventory, order details, and payment information.
// Nodes/Entities:
// Order: Attributes: order_id, user_id, total_price, shipping_address, payment_status
// Product: Attributes: product_id, name, price, stock_quantity
// Example: When the user checks out, their selected products, total price, and shipping information are stored as an Order in PostgreSQL, and the Product table is updated to reflect the reduction in stock.

// 2. Redis (In-Memory Cache)
// Role: Storing real-time session data for quick access, such as the shopping cart during the checkout process.
// Nodes/Entities:
// CartSession: Attributes: session_id, user_id, cart_items, expiration_time
// Example: During the checkout, Redis holds the cart session for the user, including the list of cart_items and their quantities, for fast retrieval and updates.

// 3. MongoDB (Document Store for Unstructured Data)
// Role: Storing user profiles, including preferences, geographical data, and personalized settings.
// Nodes/Entities:
// UserProfile: Attributes: user_id, user_name, email, geo_location, preferences
// Example: MongoDB stores detailed information about the user, such as their location (geo_location) and shipping preferences, which is used to tailor shipping options and promotions during checkout.

// 4. Neo4j (Graph Database for Relationships)
// Role: Tracking relationships between users, products, and interactions like reviews and recommendations.
// Nodes/Entities:
// User: Attributes: user_id, user_name
// Product: Attributes: product_id, name
// Review: Attributes: user_id, product_id, rating, comment
// Relationships:
// BOUGHT: Relationship between User and Product, representing a past purchase.
// REVIEWED: Relationship between User and Product, showing user feedback on the product.
// Example: Neo4j helps recommend items to the user by looking at relationships between products they've bought (BOUGHT) and reviewed (REVIEWED), enhancing the checkout experience with personalized suggestions.

// 5. InfluxDB (Time-Series Database for Action Tracking)
// Role: Storing time-series data that tracks user interactions with the platform during the checkout process.
// Nodes/Entities:
// ActionLog: Attributes: timestamp, user_id, action_type
// Example values for action_type: item_added_to_cart, checkout_initiated, payment_completed
// Example: InfluxDB logs every action the user takes during checkout, such as item_added_to_cart or payment_completed, each with a precise timestamp. This allows Amazon to monitor checkout performance and troubleshoot any delays in real-time.



// */




// 

// Purpose: retrieve data 
// Conditional: 
    // Start: 1 - database --> parent [user_id]
    // Next: 2 - database --> child
    // Next: 3 - database --> child
    // etc...

    // userId = mongo || influx || redis || etc...
    

    
/**
 * 
 * SELECT
 * MONGO.user_id
 * MONGO.username, 
 * INFLUX money_spent
 * From Mongo
 * LEFT JOIN on MONGO.user=id INFLUX.user_id
 * 
 * 
 */

//order
//from which database to get each field
//what other table
//what field to join on

/*

- if user pursues mongo query of user_id: 
    - check to see if it exits:
        - if yes:
            - move down the chain 
        - if no: 
            - stop at parent 

    GET all user_id
*/