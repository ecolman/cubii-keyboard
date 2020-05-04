const findPeripheralRequest = "findPeripheral-Request";
const foundPeripheralResponse = "FoundPeripheral-Response";
const discoverServicesCharacteristicsRequest = "DiscoverServicesCharacteristics-Request";
const foundServicesCharacteristicsResponse = "FoundServicesCharacteristics-Response";
const watchCharacteristicsRequest = "WatchCharacteristics-Request";
const pressKeyRequest = "PressKey-Request";

const characteristicsReadResponse = "CharacteristicsRead-Response";
const characteristicsDataResponse = "CharacteristicsData-Response";
const characteristicsWriteResponse = "CharacteristicsWrite-Response";
const characteristicsNotifyResponse = "CharacteristicsNotify-Response";

const debug = false;

const validSendChannels = [
  findPeripheralRequest,
  discoverServicesCharacteristicsRequest,
  watchCharacteristicsRequest,
  pressKeyRequest
];

const validReceiveChannels = [
  foundPeripheralResponse,
  foundServicesCharacteristicsResponse,
  characteristicsReadResponse,
  characteristicsDataResponse,
  characteristicsWriteResponse,
  characteristicsNotifyResponse
];

module.exports = {
  mainBindings: function (ipcMain, browserWindow, noble, robot, isDev) {
    let foundPeripheral;
    let foundServiceUuid;
    let foundServices;
    let foundCharacteristics;

    ipcMain.on(findPeripheralRequest, (event, serviceUuid) => {
      noble.on('stateChange', function(state) {
        debug ? console.log('State Change:', state) : null;
        if (state === 'poweredOn') {
          debug ? console.log('Start Scanning') : null;
          noble.startScanning([serviceUuid], false);
        } else {
          debug ? console.log('Stop Scanning') : null;
          noble.stopScanning();
        }
      });

      noble.on('discover', function(peripheral) {
        debug ? console.log('Discover', peripheral.uuid) : null;
        noble.stopScanning();
      
        foundPeripheral = peripheral;
        foundServiceUuid = serviceUuid;

        event.sender.send(foundPeripheralResponse, foundPeripheral);
      });          
    });

    ipcMain.on(discoverServicesCharacteristicsRequest, (event) => {
      debug ? console.log('Discover Services Characteristics') : null;
      if (foundPeripheral && foundServiceUuid) {
        foundPeripheral.connect(function(err) {
          debug ? console.log('Connecting to', foundPeripheral.uuid) : null;
          foundPeripheral.discoverServices([foundServiceUuid], function(err, services) {
            foundServices = services;

            services.forEach(function(service) {
              debug ? console.log('found service:', service.uuid) : null;
      
              service.discoverCharacteristics([], function(err, characteristics) {
                foundCharacteristics = characteristics;

                debug ? console.log('Characteristics length', characteristics.length) : null;
                
                event.sender.send(foundServicesCharacteristicsResponse, { services: foundServices, characteristics: foundCharacteristics });
              });
            });
          });
        });
      }
    });

    ipcMain.on(watchCharacteristicsRequest, (event) => {
      if (foundCharacteristics) {
        foundCharacteristics.forEach(function(characteristic, index) {
          debug ? console.log('found characteristic:', characteristic) : null;
    
          characteristic.subscribe(function(err) {
            // characteristic.on('read', function(data, isNotification) {
            //   var result = data.readUInt8(0);

            //   debug ? console.log(`READ - ${result}`, data.toString()) : null;

            //   event.sender.send(characteristicsReadResponse, {
            //     index,
            //     value: result
            //   });
            // });
            
            characteristic.on('data', function(data, isNotification) {
              const result = data.readUInt8(0);

              debug ? console.log(`DATA - ${result}`, data.toString()) : null;

              event.sender.send(characteristicsDataResponse, {
                index,
                value: result
              });
            });
  
          //   characteristic.on('write', function() {
          //     debug ? console.log('WRITE', state) : null;
              
          //     event.sender.send(characteristicsWriteResponse, index);
          //   });
  
          //   characteristic.on('notify', function(state) {
          //     debug ? console.log('NOTIFY', state) : null;
              
          //     event.sender.send(characteristicsNotifyResponse, {
          //       index,
          //       value: state
          //     });
          //   });

          //   debug ? console.log('SUBSCRIBE') : null;

          //   if (debug) {
          //     console.log('');
          //   }
          });
        });
      }
    });

    ipcMain.on(pressKeyRequest, (event, { key, direction }) => {
      if (debug) {
        console.log(`${direction === 'up' ? 'Releasing' : 'Pressing'} ${key} key`);
      }

      robot?.keyToggle(key, direction);
    });
  },
  // Clears ipcMain bindings;
  clearMainBindings(ipcMain) {        
    validSendChannels.forEach(rc => ipcRenderer.removeAllListeners(rc));
  },
  preloadBindings: function (ipcRenderer) {
    return {
      channels: {
        findPeripheralRequest,
        discoverServicesCharacteristicsRequest,
        watchCharacteristicsRequest,
        pressKeyRequest,
        foundPeripheralResponse,
        foundServicesCharacteristicsResponse,
        characteristicsReadResponse,
        characteristicsDataResponse,
        characteristicsWriteResponse,
        characteristicsNotifyResponse
      },
      send: (channel, data) => {
        if (validSendChannels.includes(channel)) {
          debug ? console.log('ON SEND:', channel, data) : null;

          ipcRenderer.send(channel, data);
        }
      },
      onReceive: (channel, func) => {
        if (validReceiveChannels.includes(channel)) {
          debug ? console.log('ON RECEIEVE:', channel) : null;

          ipcRenderer.on(channel, (event, args) => {
            func(args);
          });
        }
      },
      clearRendererBindings: () => {
        // Clears all listeners
        debug ? console.log(`clearing all ipcRenderer listeners.`) : null;

        validReceiveChannels.forEach(rc => ipcRenderer.removeAllListeners(rc));
      }
    }
  }
}
