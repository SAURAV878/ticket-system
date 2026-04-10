import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import logger from "../utils/logger.js";

dotenv.config();

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: 'postgres',
                logging: false, // Set to false to keep logs clean
                pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
            }
        );

        Database.instance = this;
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            logger.info(' PostgreSQL connected successfully!');
        } catch (error) {
            logger.error(' Unable to connect to the database:', error);
            process.exit(1); // Pillar 4: If DB fails, stop the app immediately
        }
    }
}

// Export a single instance
const database = new Database();
export default database;