const mongoose = require('mongoose');

const contactShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],            
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,       
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});     
const Contact = mongoose.model('Contact', contactShema);
module.exports = Contact;