import React, { Component } from 'react';
import './App.css';

import Echo from './Echo';
import AudioSource from './AudioSource';
import Speaker from './Speaker';
import Graph from './Graph';
import Filter from './Filter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AudioSource file="3.mp3">
            <Graph>
                <Filter>
                    <Echo>
                        <Speaker /> 
                    </Echo>
                </Filter>
            </Graph>
        </AudioSource>
      </div>
    );
  }
}

export default App;
