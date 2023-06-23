const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE', 'SUPER_ADMIN'],
    message: '{VALUE} no es un role valido'
};
let Schema = mongoose.Schema;
let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    imagen: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

userSchema.method.toJSON = function() {
    let user = this;
    let userObject = user.object;
    delete userObject.password;
    return userObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('User', userSchema);