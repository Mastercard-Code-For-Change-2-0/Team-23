import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
)

adminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

adminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
