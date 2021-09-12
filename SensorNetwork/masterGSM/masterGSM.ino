
/* 
 *  Problems:  
 *  Implement retries on config messages.
 *  if a batch is expected, but never arrives in time, the lastBatchReceived will not be updated
 *  and the firstDelay will probably be negative, causing mayhem. needs to be fixed
*/   
/* Include "timeSent" field, so leaf nodes can calculate packet trip delay and ajust accordingly //maybe negligeble? works as txTimeout difference?
 *  Premises:
 *  -The "bombaId" field must be sequential, starting from 1
 * 
*/
#include <WideTextFinder.h>
#include <gps.h>
#include <GSM.h>
#include <inetGSM.h>
#include <SIM900.h>
#include <sms.h>
#include <HWSerial.h>
#include <LOG.h>
#include <Streaming.h>
#include <call.h>
#include <RF24Network.h>
#include <RF24.h>
#include <SPI.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>


#define BOMBAS 8                  //Max number of reports to expect
#define WAITFORSENSORS 20000      //Time to wait for other sensors to report in ms, after first one is received
#define AFTERBATCHDISCARD 1000    //Reports received 'AFTERBATCHDISCARD' ms after a batch was sent, are ignored -> kind of prevents a batch with info of only one or two sensors.

#define NRFDATARATE RF24_250KBPS
#define NRFPOWER    RF24_PA_LOW

#define CLOUDHOST "us-central1-sismora-0002.cloudfunctions.net"
#define CLOUDPORT 80
#define CLOUDPATH "/app/sensordata"
#define ERRORPHONENUMBER "" //Phone number to report errors to

#define SENDTOCLOUD //flag to send data to cloud
//#define SMSONERROR  //flag to send sms if POST to cloud fails

//NRF24 GLOBALS-----------------------------------------------//

unsigned short main_channel = 108;
unsigned short backup_channel = 90;
unsigned short current_channel = main_channel;

#define CE 53
#define CSN 48

RF24 radio(CE,CSN);                  // nRF24L01(+) radio attached using Getting Started board 

RF24Network network(radio);       // Network uses that radio
const uint16_t this_node = 00;    // Address of our node in Octal format ( 04,031, etc)

struct _nodeInfo {
    short sensorId;
    short bombaId;
    float PH;
    float TDS;
    float EC;
    int error;
    float battery;  
}nodeInfo;

typedef struct _configNode {
  
    unsigned long firstDelay;
    unsigned long normalDelay;
};

typedef enum MsgType { NEWNODEINFO = 65, SETALARM};
char buff[1]; //buff to read setAlarm from node - empty

unsigned long delayBetweenReads = 0; 
bool newConfigWaiting = false;

bool isWaiting = false;           //Is master is waiting for the others sensors to report data?
unsigned long firstReceivedAt = 0;

//SIM900 GLOBALS-----------------------------------------------//
InetGSM inet;
char msg[1024]; //pode ser reduzido bastante.. so serve pra printar as info na serial
//char inSerial[50];
int i=0;
boolean started=false;

SMSGSM sms;
unsigned long lastConfigCheck = 0;
unsigned long configCheckTimeout = 20000; //in ms
unsigned long lastBatchReceived = 0;
//-----------------------------------------------//

_nodeInfo batchRead[BOMBAS];
char serializedJSON[1024];


void configWhenToReadUnique(uint16_t to_node){

  if(delayBetweenReads > 0){ //master configured
      RF24NetworkHeader header(to_node, (unsigned char)SETALARM);
      _configNode configNode;
    
      long diff = (long)lastBatchReceived + (long)delayBetweenReads - millis();
      if(diff > 0){
        Serial.println((String)"diff>0 -> " + diff);
        configNode.firstDelay = diff;  
      }else{
        if((delayBetweenReads - (diff * -1)) < 0)
          configNode.firstDelay = 0;
        else
          configNode.firstDelay = delayBetweenReads - (diff * -1);
        Serial.println((String)"diff<0 -> " + diff);
        Serial.println(configNode.firstDelay);
      }
      
      if(lastBatchReceived == 0 || configNode.firstDelay < 0 || isWaiting)
        configNode.firstDelay = 0;
        
      configNode.normalDelay = (unsigned long)delayBetweenReads;//delay
    
      bool ok = network.write(header, &configNode, sizeof(configNode));
      if(ok)
        Serial.println((String)"Unique config sent to node: " + to_node);
      else
        Serial.println((String)"Unique config FAILED to node: " + to_node);
    }else{
      Serial.println("Master not yet configured");
    }
     
};

void configWhenToReadMulticast(){

  if(delayBetweenReads > 0){
      RF24NetworkHeader header(01, (unsigned char)SETALARM);
      _configNode configNode;
      
      configNode.firstDelay = 0; //So the nodes read as soon as the message is received
      configNode.normalDelay = delayBetweenReads; //interval between reads
      
      if(network.multicast(header, &configNode, sizeof(configNode), 01)){
        Serial.println("Multicast Sent!");
        newConfigWaiting = false;
        return 0;
      }else{
        Serial.println("Multicast Failed!");
        return 1;
      };
  }else{
    Serial.println("Master not yet configured");
    return 1;
  }

}; 

void reportConnectionProblemSMS(int statusCode){ //Reports failed POST through sms
  Serial.println("Error on HTTP POST");
  Serial.println("Status code: " + statusCode);
  #ifdef SMSONERROR
    Serial.println((String)"Reporting to " + ERRORPHONENUMBER + "...");
    if (sms.SendSMS(ERRORPHONENUMBER, (String)"SisMoRA: Error on POST. Status: " + statusCode)){
      Serial.println("\nSMS sent OK");
    }else{
      Serial.println("\nSMS ERROR");
    }
  #endif
    
};

void serializeBatchRead(){// Serializes the batchReadArray [{item},{item}...]
  Serial.println("Serializing...");
  DynamicJsonDocument mainJSON(2048); //Main JSON doc to contain JSONArray              
  JsonArray JSONarray = mainJSON.to<JsonArray>(); //JSONArray
  DynamicJsonDocument sensor(200);
  JsonObject thisDoc;
  bool errorInDoc = false;
  //Serial.println(sizeof(batchRead)/sizeof();
  for(int i = 0; i < BOMBAS; i++){
    if(batchRead[i].sensorId != 0){   // Checks if batchRead[i] was filled by a sensor report
      
        sensor["sensor"]  = String(batchRead[i].sensorId);
        sensor["bomba"]   = String(batchRead[i].bombaId);
        sensor["PH"]      = String(batchRead[i].PH);
        sensor["TDS"]    = String(batchRead[i].TDS);
        sensor["EC"]    = String(batchRead[i].EC);
        sensor["battery"] = String(batchRead[i].battery);
        sensor["error"]   = String(batchRead[i].error);
        JsonObject thisDoc = sensor.as<JsonObject>();
        for (JsonPair keyValue : thisDoc) {
          if(thisDoc[keyValue.key().c_str()].isNull()){
            errorInDoc = true;
            Serial.println((String)"ERROR in " + keyValue.key().c_str());
          }
        }
        if(!errorInDoc){
          JSONarray.add(sensor);
        }else{
          Serial.println("One ore more fields were null. Ignoring this report");
        }
          
        errorInDoc = false;
    }
  }
  serializeJson(JSONarray, serializedJSON);
  mainJSON.clear();
  sensor.clear();
  return;
};  
void postBatchReadToCloud(){// Posts the serialized batchReadArray to the cloud
    Serial.println("Time is up, posting to cloud...");
    serializeBatchRead();
    Serial.println(serializedJSON);
    #ifdef SENDTOCLOUD
      int requestStatus=inet.httpPOST( CLOUDHOST, CLOUDPORT, CLOUDPATH, serializedJSON, msg, 1024);
      delay(4000);
      if(requestStatus != 200){ // http post error
        reportConnectionProblemSMS(requestStatus);
      }
      Serial.println(msg);
      delay(2000);
      Serial.print("Closing connection: ");
      gsm.SimpleWriteln("AT+CIPCLOSE");
      delay(1000);
      gsm.WhileSimpleRead();
      delay(1000);
    #endif

}; 

void initBatchRead( _nodeInfo *arr){
  for(int i = 0; i < BOMBAS; i++){
    arr[i].sensorId = 0;
    arr[i].bombaId = 0;
    arr[i].PH = 0;
    arr[i].TDS = 0;
    arr[i].EC = 0;
    arr[i].error = 0;
    arr[i].battery = 0;  
  }
}
void setupSIM900Shield(){
  Serial.println("GSM Shield testing...");
  if (gsm.begin(9600)){
    Serial.println("[ok] GSM ready");
    started=true;  
    for(int i=0;i<10;i++)
      blink(13);
  }
  else{
    Serial.println("[X] ERROR ON GSM INIT");
    started=false;
  }

  if(started){
   
    //Sync with RTC
//    gsm.SimpleWriteln("AT+CNTP");
//    delay(200);
//    gsm.WhileSimpleRead();
//    gsm.SimpleWriteln("AT+CNTP=\"pool.ntp.org\",-3,1,0"); //pools for timestamp GMT-3 and syncs with local RTC
//    delay(5000);
//    //gsm.WhileSimpleRead();
//    gsm.SimpleWriteln("AT&W"); //saves profile
//    delay(200);
//    gsm.WhileSimpleRead();
//    gsm.SimpleWriteln("AT+CCLK?"); //gets local Date+Time (after sync with ntp server)
//    delay(400);
    //char buff[128] = {0};
    //gsm.SimpleReadToBuffer(buff);
    //char *p = strstr(buff, "+CCLK: ");
    //if(p != NULL) {
      //Serial.println(p+strlen("+CCLK: "));
    //}
  };
}

void checkForConfigSMS(){


  char sms_position;
  char phone_number[20]; // array for the phone number string
  char sms_text[100];

  Serial.println("Checking for config...");
  delay(100);
  sms_position=sms.IsSMSPresent(SMS_UNREAD);
        if ((int)sms_position) 
        {
            // read new SMS
            Serial.print("SMS postion:");
            Serial.println(sms_position,DEC);
            sms.GetSMS((int)sms_position, phone_number, sms_text, 100);
            Serial.println((String)"Received from: " + phone_number);
            Serial.println(sms_text);
            sms.DeleteSMS((int)sms_position);

            if(strcmp(ERRORPHONENUMBER, phone_number)){
                char *p = strstr(sms_text,"CAI: "); //Configure Alarm Interval -> CAI: (hours),(minutes),(seconds)
                if(p != NULL){
                    char *buff = malloc(10*sizeof(char));
                    int configArr[4];
                    strcpy(buff, sms_text + sizeof("CAI: ") - 1);

                    Serial.println(buff); 
                    char *token;
                    int i = 0;
                    while((token = strsep(&buff,",")) != NULL){
                      configArr[i] = atol(token);
                      i++;
                      if(i>4)
                        break;  
                    }
                    free(buff);
                    Serial.println(configArr[0]);
                    Serial.println(configArr[1]);
                    Serial.println(configArr[2]);
                    Serial.println(configArr[3]);
                    //TODO: check ranges and variable types to ensure that no garbage is sent to nodes
                    unsigned long hours   = (unsigned long)(configArr[0]) * 60UL * 60UL * 1000UL;
                    unsigned long minutes = (unsigned long)(configArr[1]) * 60UL * 1000UL;
                    unsigned long seconds = (unsigned long)(configArr[2]) * 1000UL;
                    Serial.println(hours);
                    Serial.println(minutes);
                    Serial.println(seconds);
                    unsigned long totalDelay = hours+minutes+seconds;
                    Serial.println((String)"Total delay: " + totalDelay);
                    delayBetweenReads = totalDelay;
                    if(configArr[3] == 1){ //Send now
                      configWhenToReadMulticast();
                    }else{ //Waits to send after a batch is received - nodes should be awake
                      newConfigWaiting = true;
                    }
                    return 0;
                }else{
                    Serial.println("Unknown message type received");  
                }
            }else{
              Serial.println("Received from unauthorized phone, ignoring...");  
            }
            
        }   
}


void setupNRF24(){
  pinMode(CSN,OUTPUT);
  SPI.begin();
  radio.begin();
  network.begin(/*channel*/ main_channel, /*node address*/ this_node);
  radio.setDataRate(NRFDATARATE);
  radio.setPALevel(NRFPOWER) ;
  //network.txTimeout = 333;
  //radio.setRetries(15,15);
  
  initBatchRead(batchRead);
  if(radio.isChipConnected()){
    Serial.println("[ok] nRF24 ready");
  }else{
    Serial.println("[X] nRF24 not connected");
  }
  
}

void setup(void)
{
  Serial.begin(115200); 
  pinMode(13,OUTPUT);
  setupNRF24();
  setupSIM900Shield();
}

void blink(int pin){
  digitalWrite(pin, HIGH);
  delay(200);
  digitalWrite(pin, LOW);
  delay(200);
}

void loop(void){
  
  network.update();                  // Check the network regularly

  unsigned long now = millis();
  if(isWaiting){
    if(now - firstReceivedAt >= WAITFORSENSORS){ //Time is up
      lastBatchReceived = millis();
      radio.stopListening();
      postBatchReadToCloud();   //Post data to cloud
      radio.startListening();
      isWaiting = false;        //Ready for new batch
      initBatchRead(batchRead); //cleans batchRead array
      if(newConfigWaiting){ //If there is a config waiting.. Send when the batch is received cuz the nodes are probably awake
        configWhenToReadMulticast();
      }
    }
  }
  now = millis();
  while ( network.available() ) {     // Is there anything ready for us?

    RF24NetworkHeader header;         // If so, grab it and print it out
    network.peek(header);
    switch (header.type){
        case (unsigned char)NEWNODEINFO:
             network.read(header,&nodeInfo,sizeof(nodeInfo));
             Serial.print((String)"From node " );
             Serial.println(header.from_node, DEC);
             Serial.println((String)nodeInfo.sensorId + " " + nodeInfo.bombaId + " " + nodeInfo.PH + " " + nodeInfo.TDS + " " + nodeInfo.battery);
             delay(10);
             if(now - lastBatchReceived > AFTERBATCHDISCARD){
               if(!isWaiting){   //The first sensor report
                  isWaiting = true;
                  firstReceivedAt = millis();
                  initBatchRead(batchRead);     //Cleans the batchRead array
               }
               batchRead[nodeInfo.bombaId - 1] = nodeInfo;  //Adds the received report to the batchRead array
             }

             break;
        case (unsigned char)SETALARM:
             Serial.println("Node asking for alarm");
             {  
                network.read(header,&buff,sizeof(buff));
                delay(100); //avoids collision
                configWhenToReadUnique(header.from_node);    
             }
             break;
        default:
             Serial.println("Unknown message type");
             network.read(header,&buff,sizeof(buff));
             
    }
  }

  // check for config through sms every 'configCheckTimeout' ms
  if( now - lastConfigCheck > configCheckTimeout && !isWaiting){ 
    lastConfigCheck = now;
    checkForConfigSMS();  
  }
} 
