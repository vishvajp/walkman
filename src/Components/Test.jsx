import React, { useState, useRef } from "react";
import Recorder from "recorder-js";
import axios from "axios";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const audioContextRef = useRef(null);
  const recorderRef = useRef(null);
  
  const GOOGLE_CLOUD_API_KEY = "AIzaSyCCh8LR2CZEAfKDQbgByZKJy53MXldqQP0"; // Replace with your key

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      const sampleRate = audioContextRef.current.sampleRate; // ✅ Detect sample rate
      console.log("Detected Sample Rate:", sampleRate);
  
      recorderRef.current = new Recorder(audioContextRef.current);
      recorderRef.current.init(stream, { numChannels: 1 }); // ✅ Force mono recording
      recorderRef.current.start();
  
      setIsRecording(true);
      setError("");
      localStorage.setItem("sampleRate", sampleRate); // Save for API request
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Failed to access microphone.");
    }
  };
  
  
  // Stop recording and process audio
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const { blob } = await recorderRef.current.stop();
      const audioBase64 = await convertBlobToBase64(blob);
      sendToGoogleCloud(audioBase64);
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError("Failed to stop recording.");
    }
  };

  const audioBufferToWav = (audioBuffer) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const numOfFrames = audioBuffer.length;
    const bytesPerSample = 2; // 16-bit PCM
  
    // WAV file size calculation
    const bufferSize = 44 + numOfFrames * numOfChannels * bytesPerSample;
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);
  
    // Write WAV header
    let offset = 0;
    const writeString = (str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };
  
    writeString("RIFF"); // RIFF identifier
    view.setUint32(offset, bufferSize - 8, true); offset += 4; // File size
    writeString("WAVE"); // WAVE format
    writeString("fmt "); // Format chunk
    view.setUint32(offset, 16, true); offset += 4; // Sub-chunk size (16 for PCM)
    view.setUint16(offset, 1, true); offset += 2; // Audio format (1 = PCM)
    view.setUint16(offset, numOfChannels, true); offset += 2; // Number of channels
    view.setUint32(offset, sampleRate, true); offset += 4; // Sample rate
    view.setUint32(offset, sampleRate * numOfChannels * bytesPerSample, true); offset += 4; // Byte rate
    view.setUint16(offset, numOfChannels * bytesPerSample, true); offset += 2; // Block align
    view.setUint16(offset, 16, true); offset += 2; // Bits per sample (16-bit PCM)
    writeString("data"); // Data chunk
    view.setUint32(offset, numOfFrames * numOfChannels * bytesPerSample, true); offset += 4; // Data size
  
    // Write PCM samples
    for (let i = 0; i < numOfFrames; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
  
    return new Blob([buffer], { type: "audio/wav" });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]); // Extract Base64 part
      };
      reader.onerror = reject;
    });
  };
  

  // Convert Blob to Base64 for Google Cloud
  const convertBlobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = async () => {
        try {
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(reader.result);
  
          // ✅ Convert stereo to mono (if needed)
          const monoBuffer = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
          const monoData = monoBuffer.getChannelData(0);
          const leftChannel = audioBuffer.getChannelData(0);
  
          for (let i = 0; i < audioBuffer.length; i++) {
            monoData[i] = leftChannel[i]; // Copy left channel (or average both channels)
          }
  
          // ✅ Convert mono buffer to WAV format
          const wavBlob = audioBufferToWav(monoBuffer);
  
          // ✅ Convert WAV to Base64
          const base64String = await blobToBase64(wavBlob);
          resolve(base64String);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
    });
  };
  
  
  // Send audio to Google Cloud Speech-to-Text API
  const sendToGoogleCloud = async (audioBase64) => {
    const sampleRate = localStorage.getItem("sampleRate") || 48000;
  
    const requestData = {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: parseInt(sampleRate),
        // languageCode: "en-US", // ✅ Set a default language
        alternativeLanguageCodes: ["ta-IN", "es-ES", "fr-FR", "de-DE"],// ✅ Add multiple languages
        enableAutomaticPunctuation: true,
      },
      audio: {
        content: audioBase64,
      },
    };
  
    try {
      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`,
        requestData
      );
      console.log("Full API Response:", response.data);
      const transcript = response.data.results
        ?.map((result) => result.alternatives[0].transcript)
        .join(" ");
      setTranscription(transcript || "No speech detected.");
    } catch (error) {
      console.error("Google Cloud Error:", error.response?.data || error.message);
      setError("Error transcribing audio.");
    }
  };
  
  
  

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Voice Recorder & Transcription</h2>
      <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: "10px 20px", fontSize: "16px" }}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p><strong>Transcription:</strong> {transcription}</p>
      {error && <p style={{ color: "red" }}><strong>Error:</strong> {error}</p>}
    </div>
  );
};

export default AudioRecorder;
