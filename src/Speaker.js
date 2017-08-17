import React, { Component } from 'react';

export default class Speaker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gain: 1.0,
        };

        this.gainNode = null;
        this.onGainChange = this.onGainChange.bind(this);
    }

    componentWillMount() {
        this.destination = this.props.ctx.destination;
        this.gainNode = this.props.ctx.createGain();
        // this.props.src.connect(this.gainNode);
        this.gainNode.connect(this.destination);
        this.props.in.connect(this.gainNode);
    }

    render() {
        console.log('--- Rendering Speaker ---');
        this.gainNode.gain.value = this.state.gain;

        return (
            <div>
                <div style={ { width: '200px', margin: '0 auto' }}>
                    speaker volume: { this.state.gain }
                </div>
                <input id="gain" type="range" min="0" max="5.0" step="0.2" onChange={ this.onGainChange } value={ this.state.gain }/>
                { this.props.children }
            </div>
        );
    }

    onGainChange(ev) {
        this.setState({
            gain: ev.target.value,
        });
    }
}

