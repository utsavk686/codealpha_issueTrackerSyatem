import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Enter unique Email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    project: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project"
        }
    ],
    resetOtp: {
        type: Number,
        select: false
    },
    resetTime: {
        type: Date,
        select: false
    }
})

mongoose.models = {}

export const user = mongoose.model("user", userSchema)