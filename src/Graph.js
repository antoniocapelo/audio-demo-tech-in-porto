import React, { Component } from 'react';

const WIDTH = window.innerWidth;
const HEIGHT =  window.innerHeight;


export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.draw = this.draw.bind(this);
    }

    componentDidMount() {
        this.analyser = this.props.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        this.props.in.connect(this.analyser);

        this.draw();
    }

    draw() {
        requestAnimationFrame(this.draw);
        this.analyser.getByteTimeDomainData(this.dataArray);

        this.canvasCtx.fillStyle = '#19a974';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        this.canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / this.bufferLength;
        var x = 0;

        for(var i = 0; i < this.bufferLength; i++) {

            var v = this.dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(WIDTH, HEIGHT/2);
        this.canvasCtx.stroke();
    }

    render() {
        const { ctx, src } = this.props;
        console.log('-- Rendering Audio Graph ---');

        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                in: this.props.in,
                ctx: this.props.ctx,
              });
          });

        return (
            <div style={{ width: '100%', height: '100vh' }}>
                <canvas ref={(c) => this.canvas = c } width={ WIDTH } height={ HEIGHT }/>
                { children }
            </div>
        );
    }
}

