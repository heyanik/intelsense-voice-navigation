import React, { useState, useEffect } from 'react';
import Scroll from '../logic/Scroll';
import SearchList from '../logic/SearchList';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdKeyboardVoice } from 'react-icons/md';
import "../../styles/Searchbar.css";
import Navbar from '../navbar/Navbar';
import annyang from 'annyang';
import { mimeType } from 'audio-recorder-polyfill'; 
import audioBufferToWav from 'audiobuffer-to-wav';
import { AudioContext } from 'standardized-audio-context';




function interleave(leftChannel, rightChannel) {
  const length = leftChannel.length + rightChannel.length;
  const result = new Float32Array(length);

  let inputIndex = 0;

  for (let index = 0; index < length;) {
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }

  return result;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}



function Search({ details }) {
  const [searchField, setSearchField] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcribedAudioUrl, setTranscribedAudioUrl] = useState(null);
  const audioContext = new AudioContext();
  const [transcription, setTranscription] = useState("");


  useEffect(() => {
    if (annyang) {
      annyang.addCallback('result', function (phrases) {
        const recognizedSpeech = phrases[0];
        const audioBlobPlaceholder = new Blob([recognizedSpeech], { type: 'audio/mpeg' });
        setAudioBlob(audioBlobPlaceholder);
        sendVoiceToAPI(audioBlobPlaceholder);
        annyang.abort();
      });
    }
  }, []);

  const handleChange = e => {
    setSearchField(e.target.value);
  };

  function audioBufferToWavBlob(audioBuffer) {
    // ... (conversion code, same as previous response)
    return new Promise(resolve => {
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const interleaved = interleave(audioBuffer.getChannelData(0));

      const wavBuffer = new ArrayBuffer(44 + interleaved.length * 2);
      const view = new DataView(wavBuffer);

      // RIFF identifier
      writeString(view, 0, 'RIFF');
      // RIFF chunk length
      view.setUint32(4, 36 + interleaved.length * 2, true);
      // RIFF type
      writeString(view, 8, 'WAVE');
      // format chunk identifier
      writeString(view, 12, 'fmt ');
      // format chunk length
      view.setUint32(16, 16, true);
      // sample format (1 for PCM)
      view.setUint16(20, 1, true);
      // channel count
      view.setUint16(22, numberOfChannels, true);
      // sample rate
      view.setUint32(24, sampleRate, true);
      // byte rate (sample rate * block align)
      view.setUint32(28, sampleRate * 4, true);
      // block align (channel count * bytes per sample)
      view.setUint16(32, numberOfChannels * 2, true);
      // bits per sample
      view.setUint16(34, 16, true);
      // data chunk identifier
      writeString(view, 36, 'data');
      // data chunk length
      view.setUint32(40, interleaved.length * 2, true);

      // write the PCM samples
      let offset = 44;
      for (let i = 0; i < interleaved.length; i++, offset += 2) {
        view.setInt16(offset, interleaved[i], true);
      }

      resolve(new Blob([view], { type: 'audio/wav' }));
    });
  }

  const sendVoiceToAPI = async (audioBlob) => {
    console.log("Received audioBlob:", audioBlob);
    console.log("Blob type:", audioBlob.type);
  
    try {
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
  
      if (!audioBuffer) {
        console.error("Failed to decode audio data");
        return;
      }
  
      const apiUrl = 'http://20.212.151.32:7860/transcribe';
      const wavAudioBlob = await convertToWav(audioBuffer);
      const formData = new FormData();
      formData.append('file', wavAudioBlob, 'audio.wav');
  
      // Decode and play the audioBlob locally for testing
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 200) {
        const data = await response.json();
        const transcribedText = data.content.transcription;
  
        // Update the transcription state with the received text
        setTranscription(transcribedText);
  
        // Set the transcription text as the search field value
        setSearchField(transcribedText);
      } else {
        console.error('API error:', response.status);
      }
    } catch (error) {
      console.error('Error sending voice to API:', error);
      if (error.response) {
        const responseBody = await error.response.text();
        console.error('API response:', responseBody);
      }
    }
  };
  






  
  const startVoiceRecognition = () => {
    if (annyang) {
      annyang.start({ autoRestart: false, continuous: false });
    }
  };

  const handleVoiceButtonClick = () => {
    startVoiceRecognition();
  };

  async function convertToWav(audioBlob) {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
    const wavAudioBlob = await audioBufferToWavBlob(audioBuffer);
    return wavAudioBlob;
  }

  

  function searchList() {
    const filteredPersons = details.filter(
      person => {
        return (
          person
            .name
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      }
    );
    return (
      <Scroll>
        <SearchList filteredPersons={filteredPersons} />
      </Scroll>
    );
  }

  return (
    <section>
      <Navbar />
      <div className="input-icons">
      <p>{transcription}</p>
        <span className="icon1">
          <AiOutlineSearch />
        </span>
        <input
          className="input-field"
          type="search"
          placeholder="Search for offers and features"
          value={searchField}
          onChange={handleChange}
        />
        <span className="icon2">
          <button onClick={handleVoiceButtonClick}>
            <MdKeyboardVoice />
          </button>
        </span>
      </div>
      {searchList()}
    </section>
  );
}

export default Search;
