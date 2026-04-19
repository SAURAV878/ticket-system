import User from './user.js';
import database from '../core/database.js';

const models = {User};

Object.keys(models).forEach(modleName => {
    if(models[modleName].associate) {
        models[modleName].associate(models);
    }
});

export { database, User};