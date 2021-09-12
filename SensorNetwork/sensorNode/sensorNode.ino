#include <RF24Network.h>
#include <RF24.h>
#include <SPI.h>
#include <RF24Network_config.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include "GravityTDS.h"


#define THISBOMBA 1             //to what pump does this sensor relate?

#define TdsSensorPin A1
#define pHSensorPin A2           //pH meter Analog output to Arduino Analog Input 0
#define Offset -0.30            //deviation compensate
#define samplingInterval 20
#define printInterval 400
#define ArrayLenth  20    //times of collection


GravityTDS gravityTds;

float temperature = 25,tdsValue = 0;

int pHArray[ArrayLenth];   //Store the average value of the sensor feedback
int pHArrayIndex=0;

RF24 radio(7,8);                    // nRF24L01(+) radio attached using Getting Started board 

RF24Network network(radio);          // Network uses that radio

bool isNodeConfigured = false;       // If node is already configured, by multicast or by asking master directly
bool firstDelay = true;

const uint16_t this_node = 011;        // Address of our node in Octal format
const uint16_t other_node = 00;       // master

unsigned short main_channel = 108;
unsigned short backup_channel = 90;
unsigned short current_channel = main_channel;


typedef struct _configNode {
  
    unsigned long firstDelay;
    unsigned long normalDelay;
    
};

_configNode configNode;

const unsigned long interval = 2000; //ms  // How often to send 'hello world to the other unit

unsigned long last_sent;             // When did we last send?
unsigned long packets_sent;          // How many have we sent already

struct _nodeInfo {
    short sensorId;
    short bombaId;
    float PH;
    float TDS;
    float EC;
    int error;
    float battery;  
}nodeInfo;



typedef enum MsgType { NEWNODEINFO = 65, SETALARM }; //Types of mesage

float readVcc() {
  ADMUX = (B01 << REFS0)    // VCC
        | (0 << ADLAR)      // right-adjusted result
        | (B011110 << MUX0) // 1.1V
        ;
  // enable ADC
  ADCSRA |= (1 << ADEN);
  // seems necessary
  delay(2);
  // start ADC
  ADCSRA |= 1 << ADSC;
  // wait until finished
  while (bit_is_set(ADCSRA, ADSC));
  // first read low, then high!
  long value = ADCL;
  value |= ADCH << 8;
  return 1.1 / value * 1023;
}

double avergearray(int* arr, int number){
  int i;
  int max,min;
  double avg;
  long amount=0;
  if(number<=0){
    Serial.println("Error number for the array to avraging!/n");
    return 0;
  }
  if(number<5){   //less than 5, calculated directly statistics
    for(i=0;i<number;i++){
      amount+=arr[i];
    }
    avg = amount/number;
    return avg;
  }else{
    if(arr[0]<arr[1]){
      min = arr[0];max=arr[1];
    }
    else{
      min=arr[1];max=arr[0];
    }
    for(i=2;i<number;i++){
      if(arr[i]<min){
        amount+=min;        //arr<min
        min=arr[i];
      }else {
        if(arr[i]>max){
          amount+=max;    //arr>max
          max=arr[i];
        }else{
          amount+=arr[i]; //min<=arr<=max
        }
      }//if
    }//for
    avg = (double)amount/(number-2);
  }//if
  return avg;
}

float readTDS(){
  
    //temperature = readTemperature();  //add your temperature sensor and read it
    gravityTds.setTemperature(temperature);  // set the temperature and execute temperature compensation
    gravityTds.update();  //sample and calculate 
    tdsValue = gravityTds.getTdsValue();  // then get the value  
    return tdsValue;
}

float readpH(){
  unsigned long samplingTime = millis();
  unsigned long printTime = millis();
  float pHValue,voltage,finalpH;
  int numOfSamples = 5;
  int n = numOfSamples;
  
  while(numOfSamples > 0){
    if(millis()-samplingTime > samplingInterval)
    {
      pHArray[pHArrayIndex++]=analogRead(pHSensorPin);
      if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
      voltage = avergearray(pHArray, ArrayLenth)*readVcc()/1024;
      pHValue = 3.5*voltage+Offset;
      samplingTime=millis();
    }
    if(millis() - printTime > printInterval)  
    {
      finalpH += pHValue;
      numOfSamples--;
      printTime=millis();
    }  
  }
  return finalpH/n;
}

void collectData(){ //Reads data from sensors (pH, condutivimeter...)
    nodeInfo.sensorId = this_node;
    Serial.println(this_node, OCT);
    nodeInfo.bombaId  = THISBOMBA;//(int)random(1,9); //THISBOMBA
    nodeInfo.PH       = readpH();
    nodeInfo.TDS      = readTDS();
    nodeInfo.EC       = (float)readTDS()/640;
    nodeInfo.battery  = readVcc();
    nodeInfo.error    = 0;
};

void sendNodeInfo(){ //Sends data to gateway (master)
    
    collectData();   
    Serial.print((String)"01-Sending-> " + nodeInfo.sensorId + " " + nodeInfo.bombaId + " " + nodeInfo.PH + " " + nodeInfo.TDS + " " + nodeInfo.battery + " " + nodeInfo.error);
    RF24NetworkHeader header(/*to node*/ other_node, (unsigned char)NEWNODEINFO);
    bool ok = network.write(header,&nodeInfo,sizeof(nodeInfo));
    if (ok)
      Serial.println("ok = data.");
    else
      Serial.println("failed = data.");
    
};

void askForAlarm(){
    RF24NetworkHeader header(/*to node*/ other_node, (unsigned char)SETALARM);
    bool ok = network.write(header,"",0);
    if (ok)
      Serial.println("ok = alarm.");
    else
      Serial.println("failed = alarm.");
}

void setup(void)
{

  Serial.begin(115200);
  randomSeed(analogRead(0));
  gravityTds.setPin(TdsSensorPin);
  gravityTds.setAref(readVcc());
  gravityTds.setAdcRange(1024);  //1024 for 10bit ADC;4096 for 12bit ADC
  gravityTds.begin();  //initialization
  SPI.begin(); 
  radio.begin();
  network.begin(main_channel, this_node);
  
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_LOW) ;
  //radio.setRetries(14,15);
  //network.txTimeout = 246;
  network.multicastRelay = true; // check if necessary
  if(radio.isChipConnected()){
    Serial.println("nrf24 ready");
  }else{
    Serial.println("nrf24 not connected");
  }
  
  configNode.firstDelay = 0;
  configNode.normalDelay = 0;
  sendNodeInfo();
}

void loop() {
  network.update();                          // Check the network regularly

  while(network.available()){                // New msg for us
    
    RF24NetworkHeader header;        // If so, grab it and print it out
    network.peek(header);
    Serial.println(header.from_node);
    Serial.println(header.to_node);
    Serial.println(header.type);
    switch (header.type){
      case (unsigned char)SETALARM:
          network.read(header, &configNode, sizeof(configNode));
          Serial.print("Received New Config: ");
          Serial.println((String)"First delay: " + configNode.firstDelay);
          Serial.println((String)"Normal delay: " + configNode.normalDelay);
          isNodeConfigured = true;
          firstDelay = true;
          break;
      default:
          Serial.println("Unkown message type received");
          char buff[10];
          network.read(header, &buff, sizeof(buff));
          break;
    }    
  }
  unsigned long now = millis();
  if(isNodeConfigured){
     if(firstDelay){
        if(now-last_sent >= configNode.firstDelay){
          last_sent = now;
          sendNodeInfo();  
          firstDelay = false;
        } 
     }else{
        if(now-last_sent >= configNode.normalDelay){
          last_sent = now;
          sendNodeInfo();
        }
     }
  }else{
    if(now - last_sent > interval){
      last_sent = now;
      Serial.print(this_node, OCT);
      Serial.println("-Node not yet configured. Press button to ask for alarm or wait for a multicast from Master"); //no button yet
        askForAlarm(); 
    }
      
  }
}
