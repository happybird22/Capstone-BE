import Party from "../models/partySchema.mjs";
import User from "../models/userSchema.mjs";

// @desc create a new party
// @route POST /api/parties/create
// @access Private GM only
export const createParty = async (req, res) => {
    const { name } = req.body;
    const gmId = req.user._id;

    try {
        if (req.user.role !== 'gm') {
            return res.status(403).json({ message: 'Only GMs can create a party'});
        }

        const partyExists = await Party.findOne({ name });
        if (partyExists) return res.status(400).json({ message: 'Party name already exists'});

        const newParty = Party.create({
            name,
            gm: gmId,
            members: [gmId],
        });

        await User.findByIdAndUpdate(gmId, { partyID: newParty._id });

        res.status(201).json(newParty);
    } catch (err) {
        res.status(500).json({ message: 'Oarty creation failed', error: err.message });
    }
};

// @desc join a party
// @route POST /api/parties/join
// @access Private

export const joinParty = async (req, res) => {
    const { partyName } = req.body;
    const userId = req.user._id;

    try {
        const party = await Party.findOne({ name: partyName });
        if (!party) return res.status(404).json({ message: 'Party not found' });

        if (party.members.includes(userId)) {
            return res.status(400).json({ message: 'You are already in this party'}); 
        }

        party.members.push(userId);
        await party.save();

        await User.findByIdAndUpdate(userId, {partyId: party._id });

        res.status(200).json({ message: 'Joined party successfully', partyId: party._id });
    } catch (err) {
        res.status(500).json({ message: 'Join failed' });
    }
};