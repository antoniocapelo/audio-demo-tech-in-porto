import React, { Component } from 'react';

import './Filter.css';

const maxFrequency = 1000;
const maxGain = 25;

export default class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'lowshelf',
            value: 0,
            gain: 0,
            x: 'calc(50% - 5px)',
            y: 'calc(50% - 5px)',
        };

        this.filter = null;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
    }

    componentDidMount() {
        this.w = this.panel.offsetWidth/2;
        this.h = this.panel.offsetHeight/2;
    }

    componentWillMount() {
        this.filter = this.props.ctx.createBiquadFilter();

        this.props.in.connect(this.filter);
    }

    render() {
        this.filter.type = this.state.type;
        this.filter.frequency.value = this.state.value;
        this.filter.gain.value = this.state.gain;

        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                in: this.filter,
                ctx: this.props.ctx,
              });
          });

        return (
            <div className="filter">
                <div style={{ width: '100%', height: '100%', position: 'relative'}} onMouseMove={ this.onMouseMove } ref={ (d ) => this.panel = d } onClick={ this.onMouseClick }>
                    <span style={{ position: 'absolute', borderTop: '2px solid #19a974', top: '50%', left: 0, right: 0}} />
                    <span style={{ position: 'absolute', borderRight: '2px solid #19a974', left: '50%', top: 0, bottom: 0}} />
                    <span className="point" style={{ top: this.state.y, left: this.state.x}} />
                </div>
                { children }
            </div>
        );
    }

    onMouseMove(e) {
        const w = this.w;
        const h = this.h;
        this.mouseX = (e.pageX - w);
        this.mouseY = -(e.pageY - this.panel.offsetTop - h);
    }

    onMouseClick(e) {
        let type;
        const w = this.w;
        const h = this.h;
        const value = Math.abs(this.mouseY/h) * maxFrequency;
        const gain = Math.abs(this.mouseX/w) * maxGain;
        const x =  w + this.mouseX;
        const y =  h - this.mouseY;

        if (this.mouseX > 0) {
            type = this.mouseY > 0 ? 'highshelf' : 'lowshelf';
        } else {
            type = this.mouseY > 0 ? 'highpass' : 'lowpass';
        }

        this.setState({
            type,
            value,
            gain,
            x,
            y
        });
        

        console.log('value:: ', value, 'gain:::', gain, 'type:::', type);
    }
}

