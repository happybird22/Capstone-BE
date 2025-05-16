import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
    itmeName: {type: String, required: true},
    desc: {type: String},
    qty: {type: Number, default: 1, min: 1},
    value: {type: Number},
    magic: {type: Boolean, required: true, default: false},
    date: {type: Date, default: Date.now}
});

const inventorySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: {inventoryItemSchema},
});

export default mongoose.model("Inventory", inventorySchema)