const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate'); // Pra validacao dos parametros das rotas

const SensorController = require('./controllers/SensorController');
const ContactController = require('./controllers/ContactController');
const HistoryController = require('./controllers/HistoryController');
const SpecificController = require('./controllers/SpecificController');
const PositionController = require('./controllers/PositionController');

const routes = express.Router();

//schema of items of the array received. _nodeInfo
let nodeInfoSchema = Joi.object().keys({
    sensor: Joi.string().required(),
    bomba: Joi.string().required(),
    PH: Joi.string().required(),
    TDS: Joi.string().required(),
    EC: Joi.string().required(),
    error: Joi.string().required(),
    battery: Joi.string().required() 
}).unknown(false);

routes.get('/', (req, res) => {
    res.status(200).send("Keep it hot ;)");
});

routes.get('/specific', SpecificController.getSpecific);
routes.post('/sensordata', celebrate({
    [Segments.BODY]: Joi.array().items(nodeInfoSchema)
}), SensorController.postData);
routes.get('/sensordata', SensorController.getData);
routes.get('/contact', ContactController.getContact);
routes.post('/history', HistoryController.getHistory);
routes.get('/position', PositionController.getPosition);
routes.post('/position', PositionController.postPosition);

module.exports = routes;

