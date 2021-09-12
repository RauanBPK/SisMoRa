#include <RF24Network.h>
#include <RF24.h>
#include <SPI.h>
#include <RF24Network_config.h>
#include <OneWire.h>
#include <DallasTemperature.h>

RF24 radio(7,8);                    // nRF24L01(+) radio attached using Getting Started board 

RF24Network network(radio);          // Network uses that radio

bool isNodeConfigured = false;       // If node is already configured, by multicast or by asking master directly
bool firstDelay = true;

const uint16_t this_node = 01;        // Address of our node in Octal format
const uint16_t other_node = 00;       // Address of the other node in Octal format

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

//struct _nodeInfo {
//    short sensorId;
//    short bombaId;
//    float PH;
//    float SALT;
//    int error;
//    float battery;  
//}nodeInfo;



typedef enum MsgType { NEWNODEINFO = 65, SETALARM }; //Types of mesage
//
//float readVcc() {
//  ADMUX = (B01 << REFS0)    // VCC
//        | (0 << ADLAR)      // right-adjusted result
//        | (B011110 << MUX0) // 1.1V
//        ;
//  // enable ADC
//  ADCSRA |= (1 << ADEN);
//  // seems necessary
//  delay(2);
//  // start ADC
//  ADCSRA |= 1 << ADSC;
//  // wait until finished
//  while (bit_is_set(ADCSRA, ADSC));
//  // first read low, then high!
//  long value = ADCL;
//  value |= ADCH << 8;
//  return 1.1 / value * 1023;
//}
//
//void collectData(){ //Reads data from sensors (pH, condutivimeter...)
//    nodeInfo.sensorId = (short)this_node;
//    nodeInfo.bombaId  = (int)random(1,9);
//    nodeInfo.PH       = (float)random(0,14);
//    nodeInfo.SALT     = (float)random(0,100);
//    nodeInfo.battery  = readVcc();
//    nodeInfo.error    = 0;
//};

//void sendNodeInfo(){ //Sends data to gateway (master)
//    
//    collectData();   
//    Serial.print((String)"11 -Sending-> " + nodeInfo.sensorId + " " + nodeInfo.bombaId + " " + nodeInfo.PH + " " + nodeInfo.SALT + " " + nodeInfo.battery + " " + nodeInfo.error);
//    RF24NetworkHeader header(/*to node*/ other_node, (unsigned char)NEWNODEINFO);
//    bool ok = network.write(header,&nodeInfo,sizeof(nodeInfo));
//    if (ok)
//      Serial.println("ok = data.");
//    else
//      Serial.println("failed = data."); 
//    
//};

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
  //randomSeed(analogRead(0));
  Serial.println("Nó intermediário 01");
 
  SPI.begin();
  radio.begin();
  network.begin(/*channel*/ main_channel, /*node address*/ this_node);
  
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_LOW) ;
  //network.txTimeout = 302;
  //radio.setRetries(12,15);
  network.multicastRelay = true; // check if necessary
  if(radio.isChipConnected()){
    Serial.println("nrf24 ready");
  }else{
    Serial.println("nrf24 not connected");
  }
  
  configNode.firstDelay = 0;
  configNode.normalDelay = 0;
  
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
          configNode.firstDelay += 20;
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
//     if(firstDelay){
//        if(now-last_sent >= configNode.firstDelay){
//          last_sent = now;
//          sendNodeInfo();  
//          firstDelay = false;
//        } 
//     }else{
//        if(now-last_sent >= configNode.normalDelay){
//          last_sent = now;
//          sendNodeInfo();
//        }
//     }
  }else{
    if(now - last_sent > interval){
      last_sent = now;
      Serial.print(this_node, OCT);
      Serial.println("-Node not yet configured. Press button to ask for alarm or wait for a multicast from Master");
        askForAlarm(); 
    }
      
  }
}
