import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArmInfo from './Components/ArmInfo.js';
import RegisterFile from './Components/RegisterFile.js';
import X86Control from './Components/X86Control.js';
import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
    margin: 0
  },
}));

export default function SelectTab(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>

      <AppBar style={{boxShadow: "0 0 0 0", margin: "0vh"}} position="static"> 
        <Tabs TabIndicatorProps={{style: {height: "0.3vw"}}} style={{minHeight: "2.5vw", height: "2.5vw"}} centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab style = {{fontSize: "1vw", minHeight: "2.5vw", height: "2.5vw", minWidth: "17vw", width: "17vw"}} label="About" {...a11yProps(0)} />
          <Tab style = {{fontSize: "1vw", minHeight: "2.5vw", height: "2.5vw", minWidth: "17vw", width: "17vw"}} label="Arm" {...a11yProps(1)} />
          <Tab style = {{fontSize: "1vw", minHeight: "2.5vw", height: "2.5vw", minWidth: "17vw", width: "17vw"}} label="x86-64" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <ArmInfo/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <RegisterFile/>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <X86Control/>
      </TabPanel>

    </div>
  );
}