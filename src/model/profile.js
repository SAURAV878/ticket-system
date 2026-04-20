import { DataTypes } from "sequelize";
import database from "../core/database";

const Profile = database.sequelize.define('Profile', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        defaultValue: 'Other'
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'https://ui-avatars.com/api/?name=User&background=random',
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
    });
};

export default Profile;