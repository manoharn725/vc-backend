const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Multi Tenant Auth Management API",
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
    apis: [path.join(__dirname, "*.yaml")],// This will load all YAML files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;