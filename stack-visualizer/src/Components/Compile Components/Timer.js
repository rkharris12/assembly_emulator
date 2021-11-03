import React from 'react';

class Timer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        instructions: parseInt(props.startTimeInSeconds, 10) || 0
      };
    }
  
    tick() {
      if(this.props.run) {
        this.setState(state => ({
          instructions: state.instructions + 1
        }));
        this.props.step();
      }
      else {
        this.props.resetTimer();
      }
    }
  
    componentDidMount() {
      this.interval = setInterval(() => this.tick(), (1000 / this.props.speed));
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    // formatTime(secs) {
    //   let hours   = Math.floor(secs / 3600);
    //   let minutes = Math.floor(secs / 60) % 60;
    //   let seconds = secs % 60;
    //   return [hours, minutes, seconds]
    //       .map(v => ('' + v).padStart(2, '0'))
    //       .filter((v,i) => v !== '00' || i > 0)
    //       .join(':');
    // }
  
    render() {
      return (
        <div>
          {/* <h3><pre style = {{fontSize: "2vh"}}>   Instructions Executed: {this.state.instructions}</pre></h3> */}
        </div>
      );
    }
  }

  export default Timer;
  