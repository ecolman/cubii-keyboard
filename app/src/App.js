import React, { Suspense } from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider as StoreProvider } from "react-redux";
import { CssBaseline, LinearProgress } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/styles';

import Routes from './routes';
import theme from 'Theme';
import NavBar from 'Components/NavBar';

import "./App.css";
import 'Mixins/styles';

function AppWrapper({ store, history }) {
  return (
    <StoreProvider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ConnectedRouter>
    </StoreProvider>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  content: {
    minHeight: '100vh',
    flexGrow: 1,
    padding: theme.spacing(3),
    maxWidth: '100%',
    '@media all and (-ms-high-contrast:none)': {
      height: 0 // IE11 fix
    }
  }
}));

function App() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <NavBar />
        <div className={classes.content}>
          <Suspense fallback={<LinearProgress />}>
            <Routes />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default AppWrapper;