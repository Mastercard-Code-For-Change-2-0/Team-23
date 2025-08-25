import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
    {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId:{
        type : String,
    },
  },
  { timestamps: true }
)

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

const User = mongoose.model("User",userSchema);

export default User;
