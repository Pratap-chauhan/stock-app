const  bcrypt  = require("bcrypt-nodejs");
// import { NextFunction } from "express";
const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
}
);



/**
 * Password hash middleware.
 */
user.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    // @ts-ignore
    this.password = this.createPassword(this.password);
    next();
});

/**
 * Helper method for validating user's password.
 */
user.methods.comparePassword = function (password) {
    try {
        return bcrypt.compareSync(password, this.password);
    } catch (error) {
        error = new Error("Please reset password.");
        error.code = "noPassword";
        throw error;
    }
};

user.methods.createPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

const userModel = mongoose.model("User", user);
module.exports = userModel;
