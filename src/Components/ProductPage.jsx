import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import proBanner from "../Assets/images/Product banner.jpg";
import product1 from "../Assets/images/product1.jpg";
import hatIcon from "../Assets/images/ser-1.png";
import { FaMicrophone } from "react-icons/fa";
import { FaRegStopCircle } from "react-icons/fa";
import { FaStopCircle } from "react-icons/fa";
import iso6391 from "iso-639-1";
import axios from "axios";
import "../Css/Product.css";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

const ProductPage = () => {
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  // const [latitude, setLatitude] = useState('51.1657');
  // const [longitude, setLongitude] = useState('10.4515');
  const [inTrans, setIntrans] = useState(true);
  const [inputTrans, setInputTrans] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const apiKey = "AIzaSyCemA7pZSzNgEfnp77-LLvKJkODkPUGkCU";
  const [recordings, setRecordings] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [comments, setComments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();
  const userLanguage = navigator.language || navigator.languages[0];
  const [currentDate, setCurrentDate] = useState(getDate());
  const date = new Date();
  const showTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Error retrieving location");
        }
      );
    } else {
      setLocation("Geolocation not supported.");
    }
  }, []);

  useEffect(() => {
    if (!latitude || !longitude) return; // Ensure valid coordinates before making API request

    const getLocation = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );

        if (response.data.status === "OK") {
          const results = response.data.results[0].address_components;
          let country = "";
          let state = "";

          results.forEach((component) => {
            if (component.types.includes("country"))
              country = component.long_name;
            if (component.types.includes("administrative_area_level_1"))
              state = component.long_name;
          });

          setLocation(`Country: ${country}, State: ${state}`);

          if (country === "India" && state === "Tamil Nadu") {
            setLanguage("ta");
          } else {
            getCountryLanguages(country);
          }
        } else {
          setLocation("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocation("Error fetching location data");
      }
    };

    getLocation();
  }, [latitude, longitude]);

  useEffect(() => {
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
  }, [latitude, longitude]);

  const getCountryLanguages = async (countryName) => {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      if (response.data.length > 0) {
        const countryData = response.data[0];

        // Extract languages
        const languages = countryData.languages;
        if (languages) {
          let languageKey = Object.keys(languages)[0]; // Get the first language key

          // Convert ISO 639-3 to ISO 639-1
          let iso6391Code = iso6391.getCode(languages[languageKey]);

          if (!iso6391Code) {
            console.warn(
              `No ISO 639-1 mapping for ${languageKey}, defaulting to English.`
            );
            iso6391Code = "en"; // Default fallback
          }

          const countryCode = countryData.cca2; // Country Code (ISO 3166-1 alpha-2)
          setLanguage(`${iso6391Code}`);
        } else {
          setLanguage("en-US"); // Default if no language found
        }
      } else {
        setLanguage("en-US"); // Default if no country data found
      }
    } catch (error) {
      console.error("Error fetching language data:", error);
      setLanguage("en-US"); // Fallback to English on error
    }
  };

  console.log(location);
  console.log(language);
  console.log(transcriptions);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const recordedUrl = URL.createObjectURL(recordedBlob);

        // Store audio comment
        setComments((prev) => [...prev, { type: "audio", url: recordedUrl }]);

        chunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscriptions((prev) => [...prev, newTranscript]); // Save transcript
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const handleTextComment = () => {
    if (inputTrans.trim() !== "") {
      setComments((prev) => [...prev, { type: "text", text: inputTrans }]); // Store text comment
      setTranscriptions((prev) => [...prev, inputTrans]); // Store transcript
      setInputTrans("");
    }
  };

  const downloadAudio = (blob, index) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `recording_${index + 1}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <img src={proBanner}></img>
      </div>
      <div className="d-flex justify-content-center mb-4 mt-4">
        <div className="product-heading">
          <h3>
            Quality in a Service or product is not what we put into it.{" "}
            <span style={{ color: "red" }}>
              It is what Our Customer Gets out of it.
            </span>
          </h3>
        </div>
      </div>
      <div className="row ">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row product-row">
            <div className="col p-0">
              <div className="product-div">
                <img className="product-img" src={product1}></img>
                <img className="setting-icon" src={hatIcon}></img>
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-column p-4">
                <h3>
                  <span style={{ color: "red" }}>Pre-Commissioning</span>{" "}
                  Services
                </h3>
                <ul>
                  <li>Chemical Cleaning</li>
                  <li>Hot Oil flushing</li>
                  <li>Degreasing Services</li>
                  <li>Pickling & passivation</li>
                  <li>High pressure testing – Oil, Hydro & Nitrogen</li>
                  <li>Flange management</li>
                  <li>Hydro/Retro jetting</li>
                  <li>Nitrogen Purging and other related services</li>
                  <li>Pigging services</li>
                  <li>Video Camera & Borescope inspection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-2"></div>
      </div>
      <div className="row mt-5">
        <div className="col-2"></div>
        <div className="col-8 ">
          <div className="product-audio-file d-flex flex-column align-items-center">
            <d iv className="d-flex justify-content-center ">
              <h3>Comments</h3>
            </d>

            {/* Display all recordings */}
            <div className="comment-audio-div d-flex flex-column align-items-center">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="product-single-comment mb-3 d-flex flex-column"
                >
                  <p>
                    {" "}
                    <span>Vishva</span>
                    <span>{currentDate}</span>
                    <span>{showTime}</span>
                  </p>

                  {comment.type === "audio" ? (
                    <audio controls src={comment.url} />
                  ) : (
                    <p>{comment.text}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Single microphone button */}
            <div className="d-flex justify-content-center mb-2">
              <input
                onChange={(e) => {
                  setInputTrans(e.target.value);
                  if (e.target.value.length > 0) {
                    setIntrans(false);
                  } else setIntrans(true);
                }}
              ></input>
              {inTrans ? (
                <button
                  className={
                    isRecording
                      ? "product-start-stop-button"
                      : "product-start-rec-button"
                  }
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <FaStopCircle /> : <FaMicrophone />}
                </button>
              ) : (
                <button onClick={handleTextComment}>ok</button>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2 ">
            <span className="me-2">
              Click this button to see comments in text
            </span>
            <button
              className="product-page-reader-btn"
              onClick={() => navigate("/reader", { state: transcriptions })}
            >
              Reader
            </button>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default ProductPage;
