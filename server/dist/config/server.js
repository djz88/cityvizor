"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var environment = require("../environment");
exports.default = {
    apiRoot: environment.apiRoot,
    cors: {
        enabled: environment.cors,
        origin: environment.corsOrigin,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        exposedHeaders: ["Location"],
        allowedHeaders: ["Authorization", "Content-Type"]
    },
    cron: {
        cronTime: "00 00 07 * * *",
        runOnInit: false
    },
    database: environment.database,
    server: {
        host: environment.host,
        port: environment.port
    },
    static: {
        dir: environment.staticFiles,
        index: path.join(environment.staticFiles, "index.html")
    },
    storage: {
        tmp: path.resolve(environment.tmpDir),
        avatars: path.resolve(environment.storageDir, "avatars")
    },
    jwt: {
        secret: environment.keys.jwt.secret,
        expiration: "1d",
        credentialsRequired: false,
        getToken: function (req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            }
            else if (req.cookies && req.cookies["access_token"]) {
                return req.cookies.access_token;
            }
            return null;
        },
        cookieName: "access_token",
        cookieMaxAge: 1000 * 60 * 60 * 24
    },
};