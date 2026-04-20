import User from './user.js';
import database from '../core/database.js';
import Profile from './profile.js';

const models = {User, Profile};

Object.keys(models).forEach(modleName => {
    if(models[modleName].associate) {
        models[modleName].associate(models);
    }
});

export { database, User, Profile};