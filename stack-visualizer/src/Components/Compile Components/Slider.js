import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import './../../App.css';

const useStyles = makeStyles({
  root: {
    width: "13vw",
  },
});

export default function ContinuousSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.speed);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.changeSpeed(newValue);
  };

  return (
    <div className={classes.root}>
      
      <Grid container className="VisualizeSlider">

        <Grid item>
            <Typography style = {{fontSize: "1.5vh"}}>
                Instructions / sec
            </Typography>
        </Grid>

        <Grid item>
          <pre>  </pre>
        </Grid>

        <Grid item xs style = {{fontSize: "1vh"}}>
          <Slider min={1} step={1} max={6} defaultValue={props.speed} valueLabelDisplay="on" value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
      
      </Grid>
    </div>
  );
}