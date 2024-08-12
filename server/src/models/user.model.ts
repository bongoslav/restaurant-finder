import mongoose, { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  name: string;
  // array -> user can stay logged in on many devices
  // also, adds "log out from all devices" functionality
  refreshTokens: string[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          // ensures the username is a single word
          // allows letters, numbers, underscores, and hyphens
          return /^[a-zA-Z0-9_-]+$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid username. Username must be a single word without spaces.`,
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    name: {
      type: String,
      default: "First Last",
      trim: true,
    },
    refreshTokens: [{ type: [String] }],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
