const db = require('../database/connection');
const utils = require('../utils/utils');

const meshRead = db.collection('meshReads');
 

module.exports = {

    //recieves batchRead, adds timestamp and water quality, saves to firestore
    async postData(req, res) {

        data = req.body;
        //console.log(data)
        sensors = utils.processData(data);
        let createdAt = utils.getTimeStamp();
        data = {sensors,"createdAt":createdAt}
        try {
            const docRef = await meshRead.add(data);
            return res.status(200).json({ "id": docRef.id });
            
        } catch (error) {
            return res.status(400).json({ "status": error });
        }
    },

    //Return newest batch of reads
    async getData(req, res) {
        try {
            const snapshot = await meshRead.orderBy('createdAt', 'desc').limit(1).get();
            snapshot.forEach((doc) => {

                lastBatch = doc.data();
                
                lastBatch["id"] = doc.id;
                return res.json(lastBatch);
            });
        } catch (error) {
            console.log('Error GET: ', error);
            return res.status(400).json({ "status": "GET Failed!" });
        }
    }
}