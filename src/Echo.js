import React, { Component } from 'react';

export default class Echo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            echo: 0.0,
            gain: 0.0,
        };

        this.delay = null;
        this.onEchoChange = this.onEchoChange.bind(this);
        this.onGainChange = this.onGainChange.bind(this);
    }

    componentWillMount() {
        this.delay = this.props.ctx.createDelay(5.0);

        this.feedback = this.props.ctx.createGain();
        this.feedback.gain.value = this.state.gain;

        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);

        this.props.in.connect(this.delay);
        // this.props.src.connect(this.props.ctx.destination);

        // this.delay.connect(this.props.ctx.destination);
    }

    render() {
        this.delay.delayTime.value = this.state.echo;
        this.feedback.gain.value = this.state.gain;

        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                in: this.delay,
                ctx: this.props.ctx,
              });
          });

        return (
            <div className="echo">
                <h2>
                    Echo
                </h2>
                <div style={ { width: '200px', margin: '0 auto' }}>
                    time (ms): { this.state.echo }
                    <br/>
                    <input id="echo" type="range" min="0" max="5.0" step="0.2" onChange={ this.onEchoChange } value={ this.state.echo }/>
                </div>
                <div style={ { width: '200px', margin: '0 auto' }}>
                    gain: { this.state.gain }
                    <br/>
                    <input id="gain" type="range" min="0" max="1.0" step="0.1" onChange={ this.onGainChange } value={ this.state.gain }/>
                </div>
                { children }
            </div>
        );
    }

    onEchoChange(ev) {
        this.setState({
            echo: ev.target.value,
        });
    }

    onGainChange(ev) {
        this.setState({
            gain: ev.target.value,
        });
    }
}

