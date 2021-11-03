import React from 'react';
import Button from '@material-ui/core/Button';
//import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Grid from '@material-ui/core/Grid';
import './../../App.css';

class RunTab extends React.Component {
    render() {
        return(
            <Grid container className="RunTab">
                <Grid item>
                    {this.props.step || this.props.visualize ? null : <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "4vw", minHeight: "2vw", width: "4vw", height: "2vw"}} variant="contained" color="primary" onClick={this.props.handleRun}>Run</Button>}
                </Grid>
                {/* {this.props.step ? <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleStep}>Step <ArrowForwardIcon></ArrowForwardIcon></Button>: null}  */}
                {/* {this.props.step ? <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleContinue}>Continue </Button>: null}  */}
            </Grid>
        )
    }
}

export default RunTab;
