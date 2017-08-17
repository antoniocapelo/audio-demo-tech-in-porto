import React, { Component } from 'react';

export default class AudioSource extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sound: undefined,
            src: undefined,
            gain: 1.0,
        };

        this.onGainChange = this.onGainChange.bind(this);
    }

    componentDidMount() {
        try {
            // Fix up for prefixing
            this.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();

            if (this.props.file) {
                const request = new XMLHttpRequest();

                request.open('GET', this.props.file, true);
                request.responseType = 'arraybuffer';
                request.onload = () => {
                    this.context.decodeAudioData(request.response, (buffer) => {
                        // Create the AudioBufferSourceNode
                        const sourceBuffer = this.context.createBufferSource();

                        // Tell the AudioBufferSourceNode to use this AudioBuffer.
                        sourceBuffer.buffer = buffer;
                        sourceBuffer.connect(this.gainNode);

                        this.setState({ src: this.gainNode, ctx: this.context});
                        sourceBuffer.start(this.context.currentTime);
                    }, () => {});
                }
                request.send();
            } else {
                navigator.webkitGetUserMedia({audio: true}, (stream) => {
                    const microphone = this.context.createMediaStreamSource(stream);
                    microphone.connect(this.gainNode);
                    this.setState({ src: this.gainNode, ctx: this.context});
                }, () => window.alert('Failed getting user media'));

            }
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
    }

    componentDidUpdate() {
        this.gainNode.gain.value = this.state.gain;
    }

    render() {
        console.log('-- Rendering Audio Source ---');

        const hasSrcAndContext = !!(this.state.src && this.state.ctx);

        const children = hasSrcAndContext ? React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                in: this.state.src,
                ctx: this.state.ctx,
              });
          }) : null;

        return (
            <div style={{ background: '#19a974', color: '#444'}}>
            <label>
            input gain
            </label>
            <input id="gain" type="range" min="0" max="5.0" step="0.2" onChange={ this.onGainChange } value={ this.state.gain }/>
            { children }
            </div>
        )
    }

    onGainChange(ev) {
        this.setState({
            gain: ev.target.value,
        });
    }
}

