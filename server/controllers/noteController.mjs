import SessionNote from "../models/notesSchema.mjs";

export const createSessionNote = async (req, res) => {
    const {
        campaignTitle,
        sessionDate,
        notes,
        notableNPCs,
        notablePlaces,
        memorableMoments,
        visibility,
        sharedWith,
    } = req.body;

    try {
        const newNote = SessionNote.create({
        campaignTitle,
        sessionDate,
        notes,
        notableNPCs,
        notablePlaces,
        memorableMoments,
        author: req.user._id,
        partyId: req.user.partyId,
        visibility: visibility || 'private',
        sharedWith: visibility === 'one' ? shareWith : [],
        });

        res.status(201).json(newNote);
    } catch {
        res.status(500).json({ message: 'Error creating session note', error: err.message });
    }
};

// Get session notes with filters

export const getSessionNotes = async (req, res) => {
    const userId = req.user._id;
    const partyId = req.user.partyId;
    const isGM = req.user.role === 'gm';

    const { date, npc, place } = req.query;

    try {
        const filter = {
            partyId,
            $or: [
                { visibility: 'all' },
                { visibility: 'private', author: userId },
                { visibility: 'one', sharedWith: userId },
                ...(isGM ? [{ author: userId, visibility: 'private' }] : []),
            ],
        };

        if (date) {
            filter.sessionDate = new Date(date);
        }

        if (npc) {
            filter.notableNPCs = { $regex: npc, $options: 'i'};
        }

        if (place) {
            filter.notablePlaces = { $regex: place, $options: 'i' };
        }

        const notes = await SessionNote.find(filter)
        .sort({ sessionDate: -1 })
        .populate('author', 'username')
        .populate('sharedWith', 'username');

        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Failed to find notes', error: err.message });
    }
};