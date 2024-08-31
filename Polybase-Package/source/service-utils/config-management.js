/**
 * config-management.js
 * 
 * manages retrieval/updating of specifically the configuration settings across the system.
 * maintains centralized configuration store accessible by all modules.
 * validates config changes before applying them to ensure no invalid config chagnes screw 
 * up operations (before they try to occur) 
 * (stretch) dynamic configuration --allow updates to be applied on-the-fly w/o requiring system restart.
 * overall, just ensure that Polybase operates according to the settings the user
 * defines and then adatps to changes in the configuration as needed. 
 * 
 *
 */
