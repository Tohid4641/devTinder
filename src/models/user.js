const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minLength: 4,
        maxLength: 10,
        validate: (v) => {
            if (!validator.isAlpha(v)) {
                throw new Error("First name should contain only letters'")
            }
        }
    },
    lastName: {
        type: String,
        trim: true,
        validate: {
            validator: (v) => validator.isAlpha(v),
            message: 'Last name should contain only letters'
        }
    },
    emailId: {
        type: String,
        required: [true, 'Email Id is required'],
        unique: [true, 'email already exists'],
        validate: {
            validator: (v) => validator.isEmail(v), // Checks for valid email format
            message: 'Please provide a valid email address'
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: (v) => validator.isStrongPassword(v, {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }),
            message: 'Password must be strong (include uppercase, lowercase, number, and symbol)'
        }
    },
    age: {
        type: Number,
        min: [18, "Age must be 18 or above"],
        max: [100, 'Maximum age is 100'],
        validate: {
            validator: (v) => validator.isInt(String(v), { min: 18, max: 100 }), // Ensures age is an integer within range
            message: 'Please provide a valid age between 18 and 100'
        }

    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: '{VALUE} is not a valid gender type',
        },
    },
    photoUrl: {
        type: String,
        validate: {
            validator: (v) => validator.isURL(v), // Ensures valid URL format
            message: 'Photo URL must be a valid URL'
        },
        default: "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
    },
    about: {
        type: String,
        minLength: [4, 'About section required 4 minimum characters'],
        maxlength: [200, 'About section cannot exceed 200 characters'],
        default: "This is default about of the user!"
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    subscriptionType: {
        type: String,
    },
    skills: {
        type: [String],
        validate: [
            {
                validator: function (arr) {
                    return arr.length >= 0 && arr.length <= 100;
                },
                message: 'Skills must contain at least 0 skill and at most 100 skills'
            },
            {
                validator: function (arr) {
                    return arr.every(skill => typeof skill === 'string');
                },
                message: 'Each skill must be a string'
            },
            {
                validator: function (arr) {
                    return arr.every(skill => validator.isAlpha(skill)); // Only allows alphabetical characters
                },
                message: 'Each skill must be a non-numeric string without spaces or special characters'
            },
            {
                validator: function (arr) {
                    return new Set(arr).size === arr.length;
                },
                message: 'Skills must not contain duplicate entries'
            }
        ]
    },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now() },
},
    {
        timestamps: true,
    }
);

const allowedFields = ['_id', 'firstName', 'lastName', 'emailId', 'password', 'age', 'gender', 'photoUrl', 'about', 'skills', 'createdAt', 'updatedAt'];

// Pre-hook for validating fields on sign-up (document creation)
userSchema.pre('save', function (next) {

    if (this.skipFieldValidation) {
        return next();
    }
    const newDocumentFields = Object.keys(this.toObject());


    const isAllowed = newDocumentFields.every(field => allowedFields.includes(field));

    if (!isAllowed) {
        return next(new Error('Only specific fields are allowed during sign-up.'));
    }

    next();
});

const allowedFieldsUpdate = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills', 'isOnline', 'isPremium', 'subscriptionType', 'lastSeen'];

// Pre-hook for validating fields on updates
userSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function (next) {

    const update = this.getUpdate();

    // Collect top-level fields (e.g., `skills`, `xyz`)
    const topLevelFields = Object.keys(update).filter(key => !key.startsWith('$'));

    const updateFields = [...topLevelFields];

    const isAllowed = updateFields.every(field => allowedFieldsUpdate.includes(field));

    if (!isAllowed) next(new Error('Updating these fields is not allowed.'));

    next();
});

userSchema.methods.validatePassword = async function (inputPassword) {
    const user = this;

    const hashPassword = user.password;

    const validatedPassword = await bcrypt.compare(inputPassword, hashPassword);

    return validatedPassword;
}

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
}


module.exports = mongoose.model('User', userSchema);