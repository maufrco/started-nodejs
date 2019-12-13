const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelizer, DataTypes) => {
    const User = sequelizer.define("User", {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        password: DataTypes.VIRTUAL
    }, {
        hooks:{
            beforeSave: async user => {
                if(user.password){
                   user.password_hash =  await bcrypt.hash(user.password, 8)
                }
            }
        }
    });

    //fazer do uso de function para possibilitar ter acesso a instancia desse User pelo this
    User.prototype.checkPassword = function(password) { 
        return bcrypt.compare(password, this.password_hash)
    }

    User.prototype.generateToken = function() { 
        return jwt.sign({id: this.id}, process.env.APP_SECRET)
    }
    return User;
}