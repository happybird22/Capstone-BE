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
        const noteData = {
        campaignTitle,
        sessionDate,
        notes,
        notableNPCs,
        notablePlaces,
        memorableMoments,
        author: req.user._id,
        visibility: visibility || 'private',
        sharedWith: visibility === 'one' ? sharedWith : [],
        };

        if (req.user.partyId) {
            noteData.partyId = req.user.partyId;
        }

        const newNote = await SessionNote.create(noteData);

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

        if (req.query.campaign) {
            filter.campaignTitle = { $regex: req.query.campaign, $options: 'i' };
        }

        if (req.query.partyId) {
            filter.partyId = req.query.partyId;
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

// Delete a note

export const deleteNote = async (req, res) => {
    const noteId = req.params.id;

    try {
        const note = await SessionNote.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (!note.author.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this note' });
        }

        await note.deleteOne();
        res.status(200).json({ message: 'Note successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete note', error: err.message });
    }
};

// Edit Note

export const editNote = async (req, res) => {
    const noteId = req.params.id;

    try {
        const note = await SessionNote.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (!note.author.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to edit this note' });
        }

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

    note.campaignTitle = campaignTitle ?? note.campaignTitle;
    note.sessionDate = sessionDate ?? note.sessionDate;
    note.notes = notes ?? note.notes;
    note.notableNPCs = notableNPCs ?? note.notableNPCs;
    note.notablePlaces = notablePlaces ?? note.notablePlaces;
    note.memorableMoments = memorableMoments ?? note.memorableMoments;
    note.visibility = visibility ?? note.visibility;

    if (visibility === 'one') {
        note.sharedWith = sharedWith ?? note.sharedWith;
    } else {
        note.sharedWith = [];
    }

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update note', error: err.message });
    }
};

// Get one note by ID
export const getSessionNoteById = async (req, res) => {
    const userId = req.user._id;
    const noteId = req.params.id;

    try {
        const note = await SessionNote.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const isOwner = note.user.equals(userId);
        const isGM = req.user.role === 'gm';
        const isShared = note.visibility === 'shared' || note.sharedWith.includes(userId);

        if (!isOwner && !isGM && !isShared) {
            return res.status(403).json({ message: 'Not authorized to view this note' });
        }

        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch note', error: err.message });
    }
};