const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Management API",
            version: "1.0.0",
            description: "API Documentaion for User, Role, Account Status & Auth flows",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Dev Server",
            },
        ],
    },

    // This will load ALL yaml files inside src/swagger/*.yaml
    apis: [path.join(__dirname, "/*.yaml")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;