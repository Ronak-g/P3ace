import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateAccessAndRefreshTokens } from "../services/Jwt.Services.ts";


interface User {
  name: string;
  email: string;
  password: string;
  refreshToken?: string,
  checkPassword: (password: string) => Promise<boolean>,
  generateAccessAndRefreshTokens: () => Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessAndRefreshTokens = async function(){

  return generateAccessAndRefreshTokens(this._id, this.name, this.email)
};



export default mongoose.model<User>("User", userSchema);
