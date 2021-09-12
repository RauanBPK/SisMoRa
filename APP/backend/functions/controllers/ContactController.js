const db = require('../database/connection');

const contact = db.collection('contactInfo');

// Returns info for contact - name email whatsapp
module.exports = {
    async getContact(req, res) {
        try {
            const snapshot = await contact.limit(1).get()
            snapshot.forEach((doc) => {
                console.log(doc.data())
                return res.json({ "name": doc.data().name, "whatsapp": doc.data().whatsapp, "email": doc.data().email });
            });
        } catch (error) {
            console.log('Error GET: ', error);
            return res.json({ "status": "GET Failed!" });
        }
    }
}