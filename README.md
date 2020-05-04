# Cubii Keyboard
Connects with a [Cubii fitness device](https://www.cubii.com/) via bluetooth to monitor when the device is being used and then presses a key on the keyboard when a use threshold is crossed.  This was done as a test project to see if I could use the Cubii to move forward in a video games by pressing the `W` key.  I've added a few options for threshold limits (speed or cycles per minute) and which key to press.

### Dependencies
* [Noble](https://github.com/noble/noble) - bluetooth connectivity
* [RobotJS](https://robotjs.io/) - keyboard automation
* [secure-electron-template](https://github.com/reZach/secure-electron-template) - base template for the electron/react application
* [Electron](https://www.electronjs.org/) - framework for desktop application
* [React](https://reactjs.org/) - UI framework
* [Material-UI](https://material-ui.com/) - UI components

### How to use
First, make sure to disconnect your phone's bluetooth from the Cubii.
```
git clone https://github.com/ecolman/cubii-keyboard.git
cd cubii-keyboard
npm i
npm run start
```
