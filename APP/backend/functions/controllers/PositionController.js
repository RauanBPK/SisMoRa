const db = require('../database/connection');

const sensorPosition = db.collection('sensorPosition').doc("uniquePositionGroup");

module.exports = {
    async postPosition(req, res) {

        data = req.body;
        
        try {
            const docRef = await sensorPosition.update(data);
            return res.status(200).json({ "status": "Update complete!" });
        } catch (error) {
            return res.status(400).json({ "status": error });
        }
    },
    async getPosition(req, res) {
        try {
            const uniquePositionGroup = await sensorPosition.get();
           
            return res.status(200).json(uniquePositionGroup.data());
         
        } catch (error) {
            console.log('Error GET: ', error);
            return res.status(400).json({ "status": "GET Failed!" });
        }
    }
}