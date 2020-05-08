import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Slider,
  Switch,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { actions as settingsActions, selectors as settingsSelectors } from 'Redux/settings';

const useStyles = makeStyles(theme => ({
  keyCard: {
    marginTop: theme.spacing(3)
  },
  keySetButton: {
    cursor: 'pointer',
  },
  keySetText: {
    padding: theme.spacing(0.75, 0)
  }
})); 

function Settings() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const threshold = useSelector(settingsSelectors.getThreshold);
  const keyToPress = useSelector(settingsSelectors.getKeyToPress);

  const [cpm, setCpm] = useState(threshold?.cpm || 1);
  const [cpmSelected, setCpmSelected] = useState(threshold?.selected === 'cpm');
  const [speed, setSpeed] = useState(threshold?.speed || 1);
  const [speedSelected, setSpeedSelected] = useState(threshold?.selected === 'speed');
  const [settingKey, setSettingKey] = useState(false);

  function setThreshold(newCpm, newSpeed, newSelected) {
    dispatch(settingsActions.SET_SETTINGS_OPTION({
      id: 'threshold',
      value: {
        speed: newSpeed,
        cpm: newCpm,
        selected: newSelected
      }
    }));
  }

  function handleKeySet() {
    setSettingKey(true);

    const listener = event => {
      setSettingKey(false);
      const key = event.key.toLowerCase().replace('arrow', '');

      dispatch(settingsActions.SET_SETTINGS_OPTION({
        id: 'keyToPress',
        value: key
      }));

      window.removeEventListener('keyup', listener, true);
    }

    window.addEventListener('keyup', listener, true)
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Threshold"
            subheader={
              cpmSelected && (<span>{cpm} Cycle{cpm > 1 ? 's' : ''} per Minute</span>) ||
              speedSelected && (<span>Speed of {speed}</span>)
            }
            subheaderTypographyProps={{
              variant: 'h6'
            }}
          />
          <Divider />
          <CardContent>
            <Typography>
              <b>Speed</b>
              <Switch
                checked={speedSelected}
                onChange={event => {
                  setSpeedSelected(event.target.checked);
                  setCpmSelected(!event.target.checked);
                  setThreshold(cpm, speed, 'speed');
                }}
              />
            </Typography>
            <Slider
              onChange={(event, value) => setSpeed(value)}
              onChangeCommitted={(event, value) => {
                setThreshold(cpm, value, threshold.selected)
              }}
              max={5}
              min={1}
              marks
              value={speed}
              valueLabelDisplay="auto"
            />

            <Typography variant="h5" align="center">
              OR
            </Typography>

            <Typography>
              <b>Cycles Per Minute</b>
              <Switch
                name="cpm"
                checked={cpmSelected}
                onChange={event => {
                  setCpmSelected(event.target.checked);
                  setSpeedSelected(!event.target.checked);
                  setThreshold(cpm, speed, 'cpm');
                }}
              />
            </Typography>
            <Slider
              onChange={(event, value) => setCpm(value)}
              onChangeCommitted={(event, value) => {
                setThreshold(value, speed, threshold.selected)
              }}
              max={150}
              min={1}
              value={cpm}
              valueLabelDisplay="auto"
            />
          </CardContent>
        </Card>

        <Card className={classes.keyCard}>
          <CardHeader
            title="Key to Press"
            subheader={keyToPress}
            subheaderTypographyProps={{
              variant: 'h6'
            }}
          />
          <Divider />
          <CardContent>
            {!settingKey && (
              <Button
                color="primary"
                className={classes.keySetButton}
                onClick={handleKeySet}
                variant="outlined"
              >
                SET NEW KEY
              </Button>
            )}
            {settingKey && (
              <Typography className={classes.keySetText}>
                <b>Press any key to set key</b>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Settings;