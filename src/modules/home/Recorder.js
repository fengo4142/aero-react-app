import React, { Component } from 'react';
import RecorderJS from 'recorder-js';

import { getAudioStream, exportBuffer } from './audio';
import Record from '../../icons/Record.png';
import Mic from '../../icons/mic.png';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      recording: false,
      recorder: null
    };
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }

  async componentDidMount() {
    let stream;

    try {
      stream = await getAudioStream();
    } catch (error) {
      // Users browser doesn't support audio.
      // Add your handler here.
      console.log(error);
    }

    this.setState({ stream });
    this.botName = process.env.REACT_APP_LEX_BOTNAME;
  }

  startRecord() {
    const { stream } = this.state;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new RecorderJS(audioContext);
    recorder.init(stream);

    this.setState(
      {
        recorder,
        recording: true
      },
      () => {
        recorder.start();
      }
    );
    this.props.changeSearchTextFieldReadOnlyStatus(true);
  }

  async stopRecord() {
    const { recorder } = this.state;

    const { buffer } = await recorder.stop()
    const audio = exportBuffer(buffer[0]);

    var params = {
      botAlias: '$LATEST',
      botName: this.botName,
      contentType: 'audio/x-l16; sample-rate=16000',
      accept: 'audio/mpeg',
      inputStream:audio
    };
    this.setState({
      recording: false
    });
    params.inputStream = audio;
    this.props.aeroBotRes(params,"voice");
  }

  render() {
    const { recording, stream } = this.state;
    // Don't show record button if their browser doesn't support it.
    // if (!stream) {
    //   return null;
    // }

    return (
      <div>
        {recording?<img src={Record} style={{width:"25px",height:"25px",cursor:"pointer",position: "absolute",top: "37px",right: "5px"}} onClick={() => {this.stopRecord()}}/>:<img src={Mic} style={{width:"25px",height:"25px",cursor:"pointer",position: "absolute",top: "37px",right: "5px"}}  onClick={() => {this.startRecord()}}/>}
      </div>
    );
  }
}
export default Recorder;
