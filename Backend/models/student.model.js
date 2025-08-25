import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const studentSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    college: { type: String, required: true },
    year: { type: String, required: true },
    field_of_study: { type: String, enum: ['computer science', 'information technology', 'entc', 'others'], required: true },
    event:[{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
  },
  { timestamps: true }
)

const Student = mongoose.model("Student",studentSchema);

export default Student;
