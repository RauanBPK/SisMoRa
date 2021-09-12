const db = require('../database/connection');
const utils = require('../utils/utils');

const meshRead = db.collection('meshReads');

const getLimit = 4;

// Returns meshReads for a specific day
// req.query.specificDate = dd-mm-yyyy

module.exports = {
    async getSpecific(req, res) {
        const specificDate = req.query.specificDate;
        if (specificDate) {

            const startDate = new Date(specificDate);
            const endDate = new Date(startDate.getTime() + 86400000) // adds one day
            var batch = []

            try {
                const snapshot = await meshRead.where("createdAt", ">", startDate).where("createdAt", "<", endDate).orderBy("createdAt", "desc").limit(getLimit).get(); //remover limit?
                snapshot.forEach((doc) => {
                    let lastBatch = doc.data();
                    lastBatch["id"] = doc.id;
                    batch.push(lastBatch);
                });
                return res.status(200).json(batch);
            } catch (error) {
                console.log('Error GET: ', error);
                return res.status(400).json({ "status": "GET Failed!" });
            }
        } else {
            return res.status(400).json({ "status": "GET Failed!" });
        }
    }
}
