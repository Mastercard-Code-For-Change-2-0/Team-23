import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true,
            lowercase: true
        },
        password: { 
            type: String,
            required: function() {
                return !this.googleId; // Password required only if not Google OAuth
            }
        },
        role: {
            type: String,
            enum: ['admin', 'student'],
            default: 'student'
        },
        googleId: {
            type: String,
        },
        profile: {
            firstName: String,
            lastName: String,
            phone: String,
            college: String,
            yearOfStudy: String,
            fieldOfStudy: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
