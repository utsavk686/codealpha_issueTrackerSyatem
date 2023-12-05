import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    link: {
        type: String
    },
    team: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    issues: [
        {
            message: {
                type: String,
                required: [true, "message is required"]
            },
            issuesType: {
                type: String,
                required: [true, "Issue type is required"]
            },
            priority: {
                type: String,
                required: [true, "priority is required"]
            },
            isResolve: {
                type: Boolean,
                default: false
            },
            file: {
                type: String,
                default: "file attech"
            },
            issueAuther: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        }
    ]
})

mongoose.models = {}

export const project = mongoose.model("project", projectSchema)