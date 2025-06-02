import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        inviteCode: {
            type: String,
            required: true,
            unique: true,
        },
        gm: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Party = mongoose.model('Party', partySchema);
export default Party;