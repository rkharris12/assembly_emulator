import React from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Grid from '@material-ui/core/Grid';
import "../../App.css";

class StepTab extends React.Component {
    render() {
        return(
            <Grid container className="StepTab">
                <Grid container className="StepStartButton">
                    <Grid item>
                        {this.props.step || this.props.visualize ? null: <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "4vw", minHeight: "2vw", width: "4vw", height: "2vw"}} variant="contained" color="primary" onClick={this.props.startStep}>Start</Button>}
                    </Grid>
                </Grid>

                <Grid container className="StepButtons">
                    <Grid item>
                        {this.props.step ? <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "5vw", minHeight: "2vw", width: "5vw", height: "2vw"}} variant="contained" color="primary" onClick={this.props.handleStep}>Step <ArrowForwardIcon style={{width: "1.5vw", height: "1.5vw"}}></ArrowForwardIcon></Button>: null}
                    </Grid>
                    <Grid item>
                        {this.props.step ? <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "7vw", minHeight: "2vw", width: "7vw", height: "2vw"}} variant="contained" color="primary" onClick={this.props.handleReset}>Terminate</Button>: null}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default StepTab;