import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import proBanner from "../Assets/images/Product banner.jpg";
import product1 from "../Assets/images/product1.jpg";
import hatIcon from "../Assets/images/ser-1.png";
import "../Css/ReaderPage.css";

const GOOGLE_API_KEY = "AIzaSyCCh8LR2CZEAfKDQbgByZKJy53MXldqQP0"; // Replace with your API key

const ReaderPage = () => {
  const location = useLocation();
  const text = location.state;
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedSentences, setTranslatedSentences] = useState([]);

  useEffect(() => {
    translateSentences();
  }, [selectedLanguage]);

  // Function to translate sentences using Google Cloud Translation API
  const translateSentences = async () => {
    try {
      const translations = await Promise.all(
        text?.map(async (sentence) => {
          const url = `https://translation.googleapis.com/language/translate/v2`;
          const res = await axios.post(
            url,
            {
              q: sentence,
              target: selectedLanguage,
              format: "text",
            },
            {
              params: {
                key: GOOGLE_API_KEY,
              },
            }
          );

          return res.data?.data?.translations[0]?.translatedText || "Translation Error";
        })
      );

      setTranslatedSentences(translations);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedSentences(["Translation failed."]);
    }
  };

  // Function to convert text to speech using Google Cloud Text-to-Speech API
  const speakText = async (text, lang) => {
    try {
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;
      const response = await axios.post(url, {
        input: { text },
        voice: {
          languageCode: lang,
          ssmlGender: "NEUTRAL",
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      });

      const audioContent = response.data?.audioContent;
      if (audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.play();
      } else {
        console.error("Error: No audio content returned.");
      }
    } catch (error) {
      console.error("Text-to-Speech error:", error);
    }
  };

  return (
    <div>
      <div>
        <img src={proBanner} alt="Product Banner" />
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
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row product-row">
            <div className="col p-0">
              <div className="product-div">
                <img className="product-img" src={product1} alt="Product" />
                <img className="setting-icon" src={hatIcon} alt="Icon" />
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-column p-4">
                <h3>
                  <span style={{ color: "red" }}>Pre-Commissioning</span> Services
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
        <h3 className="text-center">Comments</h3>
        <div className="d-flex justify-content-center mb-2">
          <span className="me-2">Select language to translate</span>
          <select
            onChange={(e) => setSelectedLanguage(e.target.value)}
            value={selectedLanguage}
          >
             <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="ta">Tamil</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="zh">Chinese</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="ar">Arabic</option>
        <option value="hi">Hindi</option>
        <option value="bn">Bengali</option>
        <option value="pa">Punjabi</option>
        <option value="tr">Turkish</option>
        <option value="nl">Dutch</option>
        <option value="sv">Swedish</option>
        <option value="pl">Polish</option>
        <option value="uk">Ukrainian</option>
        <option value="he">Hebrew</option>
        <option value="id">Indonesian</option>
        <option value="vi">Vietnamese</option>
        <option value="th">Thai</option>
        <option value="el">Greek</option>
        <option value="cs">Czech</option>
        <option value="da">Danish</option>
        <option value="fi">Finnish</option>
        <option value="no">Norwegian</option>
        <option value="ro">Romanian</option>
        <option value="sr">Serbian</option>
        <option value="sk">Slovak</option>
        <option value="hu">Hungarian</option>
        <option value="hr">Croatian</option>
        <option value="lt">Lithuanian</option>
        <option value="lv">Latvian</option>
        <option value="et">Estonian</option>
        <option value="mt">Maltese</option>
        <option value="is">Icelandic</option>
        <option value="tl">Tagalog</option>
          </select>
        </div>
        <div className="col-1"></div>
        <div className="col-10 readers-page-comments-div">
          <div className="row">
            <div className="col readers-page-comment-1st-col">
              <div>
                <h4 className="text-center">Original comments</h4>
                <ul>
                  {text?.map((sentence, index) => (
                    <li key={index}>{sentence}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col">
              <div>
                <h4 className="text-center">Translated comments</h4>
                <ul>
                  {translatedSentences?.map((sentence, index) => (
                    <li key={index} className="mb-1">
                      {sentence}
                      <button
                        onClick={() => speakText(sentence, selectedLanguage)}
                        className="comment-translated-speaker-btn ms-2"
                      >
                        🔊
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-1"></div>
      </div>
    </div>
  );
};

export default ReaderPage;
