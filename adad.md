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


function Search({ details }) {
  const [searchField, setSearchField] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const audioContext = new AudioContext();
  const [transcription, setTranscription] = useState("");



  useEffect(() => {
    if (annyang) {
      annyang.addCallback('result', function (phrases) {
        const recognizedSpeech = phrases[0];
        const audioBlobPlaceholder = new Blob([recognizedSpeech], { type: 'audio/wav' });
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
  }

  const sendVoiceToAPI = async (audioBlob) => {
    console.log("Received audioBlob:", audioBlob);
    // console.log("Blob type:", audioBlob.type);
  
    try {
      const apiUrl = 'http://20.212.151.32:7860/transcribe';
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav'); // Use 'audio.mp3' as the filename
  
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
