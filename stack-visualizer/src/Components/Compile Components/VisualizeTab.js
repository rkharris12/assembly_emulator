import React from 'react';
import Button from '@material-ui/core/Button';
import Timer from './Timer.js';
// import Slider from './Slider.js';
import Grid from '@material-ui/core/Grid';
import './../../App.css';

class VisualizeTab extends React.Component {
    render() {
        return(
            <Grid container className="VisualizeTab">

                <Grid item>
                    {this.props.visualize || this.props.step ? null: <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "4vw", minHeight: "2vw", width: "4vw", height: "2vw"}} variant="contained" color="primary" onClick={this.props.startVisualize}>Start</Button>}
                    {this.props.visualize ? <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "7vw", minHeight: "2vw", width: "7vw", height: "2vw"}} variant="contained" color="primary" onClick={this.props.handleReset}>Terminate</Button>: null}
                </Grid>

                <Grid item style={{position: "absolute"}}>       
                    <h3><pre>{this.props.visualize ? <Timer style = {{fontSize: "0.9vw"}} startTimeInSeconds="0" step={this.props.handleVisualize} speed={this.props.speed} run={this.props.visualize}/>: null}</pre></h3>
                    {/* {this.props.visualize ? null: <Slider style = {{fontSize: "1.7vh"}} changeSpeed={this.props.changeSpeed} speed={this.props.speed}/>} */}
                </Grid>

            </Grid>
        )
    }
}

export default VisualizeTab;