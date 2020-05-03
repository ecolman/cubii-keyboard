import React, { useEffect, useState, useRef, useReducer } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { SERVICE_UUID } from 'Constants';
import { actions as settingsActions, selectors as settingsSelectors } from 'Redux/settings';

const useStyles = makeStyles(theme => ({
  container: {
    height: 400
  },
  stepText: {
    paddingBottom: theme.spacing(5)
  },
  step: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 30
  },
  metric: {
    paddingBottom: theme.spacing(4)
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  label: {
    fontSize: 14,
    paddingBottom: 30
  }
}));

function Bluetooth() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const keyIsPressed = useSelector(settingsSelectors.getKeyIsPressed);
  const keyToPress = useSelector(settingsSelectors.getKeyToPress);
  const threshold = useSelector(settingsSelectors.getThreshold);
  const [step, setStep] = useState(null);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const speed = useRef(0);
  const cpm = useRef(0);
  const avgCpm = useRef(0);
  const unknown = useRef();
  const direction = useRef('up');

  const CUBII_MAP = useRef([
    { value: cpm, label: 'Pedals per minute' },
    { value: avgCpm, label: 'Average pedals per minute' },
    { value: unknown, label: 'Unknown', skip: true },
    { value: speed, label: 'Speed' }
  ]);
  
  useEffect(() => {
    const channelEnums = window.api.cubiiBluetooth.channels;
    let peripheral = null;
    let services = [];
    let characteristics = [];

    setStep('Finding Peripheral...');
    window.api.cubiiBluetooth.send(window.api.cubiiBluetooth.channels.findPeripheralRequest, SERVICE_UUID);

    // scan for peripheral
    window.api.cubiiBluetooth.onReceive(channelEnums.foundPeripheralResponse, data => {
      setStep('Found Peripheral!');
      peripheral = data;

      setStep('Discovering Services & Characteristics...');
      window.api.cubiiBluetooth.send(window.api.cubiiBluetooth.channels.discoverServicesCharacteristicsRequest);
    });

    // discover services and characteristics
    window.api.cubiiBluetooth.onReceive(channelEnums.foundServicesCharacteristicsResponse, data => {
      setStep('Discovered services and characteristics, hooking into data...');
      
      services = data.services;
      characteristics = data.characteristics;

      // start watching characteristics
      window.api.cubiiBluetooth.send(channelEnums.watchCharacteristicsRequest);
    });
    
    // window.api.cubiiBluetooth.onReceive(channelEnums.characteristicsReadResponse, ({ index, value }) => {
    //   console.log(`READ | ${value} | ${CUBII_MAP.current[index].label}`);
    // });

    window.api.cubiiBluetooth.onReceive(channelEnums.characteristicsDataResponse, ({ index, value }) => {
      const char = CUBII_MAP.current[index];

      if (step !== 'Connected and streaming data') {
        setStep('Connected and streaming data');
      }

      // console.log(`DATA | ${value} | ${char.label}`);

      if (char) {
        char.value.current = value;0
      }
    });

    // window.api.cubiiBluetooth.onReceive(channelEnums.characteristicsWriteResponse, index => {
    //   console.log(`WRITE | ${CUBII_MAP.current[index].label}`);
    // });

    // window.api.cubiiBluetooth.onReceive(channelEnums.characteristicsNotifyResponse, ({ index, value }) => {
    //   console.log(`NOTIFY | ${value} | ${CUBII_MAP.current[index].label}`);
    // });

    return window.api.cubiiBluetooth.clearRendererBindings;
  }, []);
  
  useEffect(() => {
    // every 100ms, check for value changes to update keyboard
    const bluetoothCheck = setInterval(() => {
      let dir = null;

      if (threshold.selected === 'cpm') {
        if (cpm.current >= threshold.cpm && direction.current === 'up') {
          dir = 'down';
        } else if (cpm.current < threshold.cpm && direction.current === 'down') {
          dir = 'up';
        }  
      } else if (threshold.selected === 'speed') {
        if (speed.current >= threshold.speed && direction.current === 'up') {
          dir = 'down';
        } else if (speed.current < threshold.speed && direction.current === 'down') {
          dir = 'up';
        }  
      }

      if (dir) {
        direction.current = dir;
        window.api.cubiiBluetooth.send(window.api.cubiiBluetooth.channels.pressKeyRequest, {
          key: keyToPress, 
          direction: dir
        });

        dispatch(settingsActions.SET_SETTINGS_OPTION({
          id: 'keyIsPressed',
          value: dir === 'down'
        }));
      }
    }, 100);

    // every second update component to display ref data
    const forceComponentRelaod = setInterval(() => {
      forceUpdate();
    }, 500);

    return () => {
      clearInterval(bluetoothCheck);
      clearInterval(forceComponentRelaod);
    }
  }, []);

  return (
    <Grid className={classes.container}>
      <Grid item xs={12} className={classes.stepText}>
        <Typography align="center"><b>{step}</b></Typography>
      </Grid>

        {CUBII_MAP.current.map(char => !char?.skip && (
          <Grid item xs={12} className={classes.metric} key={char.label}>
            <Typography variant="h4" align="center">{char.value.current}</Typography>
            <Typography variant="h6" align="center">{char.label}</Typography>
          </Grid>
        ))}

        {keyIsPressed && (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">{keyToPress} is being pressed</Typography>
          </Grid>
        )}
    </Grid>
  );
}

export default Bluetooth;
