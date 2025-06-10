import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        campaignTitle: {
            type: String,
            required: true,
        },
        sessionDate: {
            type: Date,
            required: true,
            default: Date.now,
        },        
        notes: {
            type: String,
            required: true,
        },
        notableNPCs: [{ type: String }],
        notablePlaces: [{ type: String}],

        memorableMoments: {
            type: String,
        },

        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: false },

        visibility: {
            type: String,
            enum: ['private', 'all', 'one'],
            default: 'private',
        },
        sharedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],        
    },
    { timestamps: true }
);

const SessionNote = mongoose.model('SessionNote', noteSchema);
export default SessionNote;