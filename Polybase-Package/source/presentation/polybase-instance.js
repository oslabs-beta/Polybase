const { logInfo } = require('../service-utils/logging');

const PolyBaseInstance = {
    interfaces: {},

    init(interfaces) {
        this.interfaces = interfaces;
        logInfo('Polybase instance initialized with interfaces', { interfaces });
    },

    getInterface(dbType) {
        return this.interfaces[dbType] || null;
    }
};

module.exports = PolyBaseInstance;