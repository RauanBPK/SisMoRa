
//Baseado no PH e SAL retorna se a agua esta boa pra irrigar o arroz


function isWaterGood(PH, TDS) {

        var K = 640
        let EC = TDS/K
        var quality = ""
        if (EC > 2){
                quality = "RUIM"
                return quality
        }
        if (isBetween(PH, 5.5,7)){
                quality = "BOA"
        }else if (isBetween(PH, 5, 5.5) || isBetween(PH, 7, 7.5)){
                quality = "CUIDADO"
        }else{
                quality = "RUIM"
        }

        return quality;
};
function isBetween(value, lim1, lim2){
        if(value >= lim1 && value <= lim2){
                return true
        }else{
                return false
        }
}
function addWaterQuality(obj) {
        newJson = obj;
        for (var prop in newJson) {
                
                if (newJson[prop].PH && newJson[prop].TDS) {
                        PH = newJson[prop].PH;
                        TDS = newJson[prop].TDS;
                        WATER = isWaterGood(PH, TDS);
                        newJson[prop].WATER = WATER;
                }else{
                        console.log("faltando parametros")
                }
        }
        return newJson;
}

exports.getTimeStamp = () => {
        return new Date();
};

exports.processData = (data) => {

        processedData = data;
        processedData = addWaterQuality(processedData);
        return processedData;
};