import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Parserx86 from './x86/Parserx86.js'
import StackOperations from './StackOperations.js';
import './../App.css';

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

export default function SelectTab(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>

      <AppBar style={{boxShadow: "0 0 0 0"}} position="static">
        <Tabs TabIndicatorProps={{style: {height: "0.1vw"}}} style={{minHeight: "2vw", height: "2vw"}} centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab style = {{fontSize: "0.7vw", height: "2vw", minHeight: "2vw", minWidth: "12vw", width: "12vw"}} label="Text Editor" {...a11yProps(0)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Grid container className="Row">
            <Grid item>
              <Parserx86 register={props.register} mov={props.mov} add={props.add} sub={props.sub} mult={props.mult} push={props.push} pop={props.pop} bitwise={props.bitwise} ldr={props.ldr} str={props.str} bl={props.bl} setPc={props.setPc} clear={props.clear}/>
            </Grid>
        </Grid>
      </TabPanel>

      

    </div>
  );
}