import Party from "../models/partySchema.mjs";
import User from "../models/userSchema.mjs";
import { generateInviteCode } from "../utilities/generateInviteCode.mjs";

// @desc create a new party
// @route POST /api/parties/create
// @access Private GM only
export const createParty = async (req, res) => {
    const { name } = req.body;
    const gmId = req.user._id;

    if (req.user.role !== 'gm') {
        return res.status(403).json({ message: 'Only GMs can create a party' });
    }

    let inviteCode;
    let codeExists = true;

    while (codeExists) {
        inviteCode = generateInviteCode();
        codeExists = await Party.findOne({ inviteCode });
    }

    const newParty = await Party.create({
        name,
        gm: gmId,
        inviteCode,
        members: [gmId],
    });

    await User.findByIdAndUpdate(gmId, { partyId: newParty._id });

    res.status(201).json({
        name: newParty.name,
        inviteCode: newParty.inviteCode,
        partyId: newParty._id,
    });
};

// @desc join a party
// @route POST /api/parties/join
// @access Private

export const joinParty = async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    const party = await Party.findOne({ inviteCode });
    if (!party) return res.status(404).json({ message: 'Invalid invite code' });

    if (party.members.includes(userId)) {
        return res.status(400).json({ message: 'Already in party' });
    }

    party.members.push(userId);
    await party.save();
    await User.findByIdAndUpdate(userId, { partyId: party._id });

    res.status(200).json({ message: 'Successfully joined party!', partyId: party._id });
};

// @desc get users parties
// @route GET /api/parties/mine
// @access Private
export const getUserParties = async (req, res) => {
    const userId = req.user._id;
    const role = req.user.role;

    try {
        const query = role === 'gm'
        ? { gm: userId }
        : { members: userId };

        const parties = await Party.find(query).select('_id name');
        res.status(200).json(parties);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch parties', error: err.message });
    }
};

