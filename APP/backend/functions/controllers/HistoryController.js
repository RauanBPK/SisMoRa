const db = require('../database/connection');

const meshRead = db.collection('meshReads');
const getLimit = 4;

// Returns 4 elements older than the startAtTimestamp provided
// The timestamp of the older element of the batch fetched is appended to the response as: "lastDocTimestamp" (so the next request can fetch the next 4)
// Necessary to do this workaround because cloud functions are stateless and can't maintain variables between calls
// This route should  be called with a req.body.startAtTimestamp defined, otherwise the timestamp will be defined as the timestamp of the call
/**
 * startAtTimestamp:{
 *     _seconds: 00000000,
 *     _milliseconds: 0000000
 * }
 */

module.exports = {
    async getHistory(req, res) {
        const startAtTimestamp = req.body.startAtTimestamp;
        var startDate = new Date();
        var history = []
        var lastDocId = 0;

        if (startAtTimestamp) {
            startDate = new Date(startAtTimestamp._seconds * 1000);
            
        }
        try {
            const snapshot = await meshRead.where("createdAt", "<", startDate).orderBy("createdAt", "desc").limit(getLimit).get();
            //console.log(snapshot)
            snapshot.forEach((doc) => {

                lastBatch = doc.data();
                lastBatch["id"] = doc.id;
                lastDocId = doc.data().createdAt;
                history.push(lastBatch);

            });
            history.push({ "lastDocTimestamp": lastDocId });
            return res.status(200).json({history});
        } catch (error) {
            console.log('Error GET: ', error);
            return res.status(400).json({ "status": "GET Failed!" });
        }

    }
}