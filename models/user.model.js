import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
      match: [/^\d{10,15}$/, "Please enter a valid mobile number (digits only)"],
    },
    location: {
      /* GeoJSON point. Do NOT set a default 'type' value here — if a document
         gets a `location.type` without `location.coordinates` the 2dsphere
         index will reject the insert. Only set `location` when you have valid
         coordinates (an array: [lng, lat]). */
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create the 2dsphere index only for documents that actually have coordinates.
// This avoids MongoDB complaining when a document contains an incomplete
// GeoJSON object (e.g. type present but coordinates missing).
userSchema.index({ location: '2dsphere' }, { partialFilterExpression: { 'location.coordinates': { $exists: true } } });

userSchema.pre("save", async function(next) {
    if(this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            return next();
        } catch (err) {
            return next(err);
        }
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;