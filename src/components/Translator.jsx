import React, { useState } from 'react';
import axios from 'axios';
import MotionButton from './MotionButton';
import { FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.continuous = true;

const languages = [
  { code: 'en-US', name: 'English (United States)' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'hi-IN', name: 'Hindi' },
  // Add more languages as needed
];

const Translator = () => {
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('ta-IN');
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  recognition.lang = inputLanguage;

  recognition.onresult = (event) => {
    const currentTranscript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');

    setTranscript(currentTranscript);

    setIsGenerating(true);
    translateText(currentTranscript);
  };

  const handleButtonClick = () => {
    if (isRecording) {
      recognition.stop();
      setIsGenerating(false);
    } else {
      setTranscript('');
      setTranslatedText('');
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  const translateText = (text) => {
    axios.post(`https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`, {
      q: text,
      source: inputLanguage.split('-')[0],
      target: outputLanguage,
      format: 'text',
    })
    .then(response => {
      setTranslatedText(response.data.data.translations[0].translatedText);
      setIsGenerating(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setIsGenerating(false);
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto max-w-4xl p-8 bg-slate-200 rounded-xl shadow-lg mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold mb-4">Configure Languages</h2>
          <label className="block mb-2">Input Language:</label>
          <select
            className="w-full p-2 border rounded"
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          <label className="block mt-4 mb-2">Output Language:</label>
          <select
            className="w-full p-2 border rounded"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code.split('-')[0]} value={lang.code.split('-')[0]}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-between col-span-2 h-full">
          <div className="flex-grow">
            <div className="p-4 bg-white rounded-lg shadow mb-4 relative">
              <h3 className="text-lg font-bold">Original Text</h3>
              <p className="mt-2">{transcript || 'Your spoken text will appear here...'}</p>
              {transcript && (
                <button
                  onClick={() => handleCopy(transcript)}
                  className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700"
                >
                  <FaCopy />
                </button>
              )}
            </div>

            <motion.div
              className="p-4 bg-gray-50 rounded-lg shadow relative"
              initial={{ boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)' }}
              animate={{
                boxShadow: isGenerating
                  ? '0px 0px 20px rgba(0, 162, 255, 0.8)'
                  : '0px 0px 0px rgba(0, 0, 0, 0)',
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold">Translated Text</h3>
              <p className="mt-2">{translatedText || 'Translation will appear here...'}</p>
              {translatedText && (
                <button
                  onClick={() => handleCopy(translatedText)}
                  className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700"
                >
                  <FaCopy />
                </button>
              )}
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center">
            <MotionButton onClick={handleButtonClick} isRecording={isRecording} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
