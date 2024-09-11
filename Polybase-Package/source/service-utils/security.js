/**
 * security.js
 * 
 * manages auth, encryption (stretch), and access control within the application.
 * 
 * takes care of validating user creds to makes sure only authorized users can perform operations.
 * (stretch) encrypts sensitive data in transit/at rest using some db encryption alg. 
 * implemetns role-based access control (RBAC) in order to restrict access to certain ops based on user role
 * logs security-related events --e..g login attempts and access violations --auditing support.
 * need to make sure that cache/memory fully flushed and no prior instance can carry btwn uses
 */
