import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import RunTab from './RunTab.js';
import StepTab from './StepTab.js';
import VisualizeTab from './VisualizeTab.js';

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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "25vw",
  },
}));

export default function RunOptions(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar style={{boxShadow: "0 0 0 0"}} position="static">
        <Tabs TabIndicatorProps={{style: {height: "0.1vw"}}} style={{minHeight: "2vw", height: "2vw"}} centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab style = {{fontSize: "0.7vw", height: "2vw", minHeight: "2vw", minWidth: "7vw", width: "7vw"}} label="Run" {...a11yProps(0)} />
          <Tab style = {{fontSize: "0.7vw", height: "2vw", minHeight: "2vw", minWidth: "7vw", width: "7vw"}} label="Step" {...a11yProps(1)} />
          <Tab style = {{fontSize: "0.7vw", height: "2vw", minHeight: "2vw", minWidth: "7vw", width: "7vw"}} label="Visualize" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <RunTab handleRun={props.handleRun} visualize={props.visualize} step={props.step} handleStep={props.handleStep} handleContinue={props.handleContinue}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StepTab handleStep={props.handleStep} startStep={props.startStep} step={props.step} visualize={props.visualize} handleReset={props.handleReset}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <VisualizeTab visualize={props.visualize} step={props.step} startVisualize={props.startVisualize} handleReset={props.handleReset} handleVisualize={props.handleVisualize} speed={props.speed} changeSpeed={props.changeSpeed}/>
      </TabPanel>
    </div>
  );
}