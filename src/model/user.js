import { DataTypes, UUIDV4 } from "sequelize";
import database from "../core/database.js";
import bcrypt from "bcrypt";

const User = database.sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Customer', 'Vendor', 'Admin'),
        defaultValue: 'Customer'
    }

}, {
    hooks: {
        beforeCreate: async (user) => {
            if(user.password) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        }
    }
});

export default User;