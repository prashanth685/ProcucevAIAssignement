import { useEffect, useRef, useState } from "react";

export default function LiveMicButton({ onTranscriptChange, selectedLanguage }) {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Ready to record");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState(selectedLanguage || ""); // Use form language or default to auto-detect

  const recognitionRef = useRef(null);
  const callbackRef = useRef(onTranscriptChange);

  useEffect(() => {
    callbackRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  useEffect(() => {
    if (selectedLanguage !== undefined) {
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setRecording(false);
    setStatus("Recording stopped");
  }

  function startRecording() {
    setError("");
    setStatus("Requesting microphone permission...");

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      setStatus("Browser not supported");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure for continuous, interim results
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set language - use auto-detect if not specified
      recognition.lang = language === "auto" ? "en-US" : getLanguageCode(language);

      recognition.onstart = () => {
        setRecording(true);
        setStatus("Listening — speak now");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setStatus("Error occurred");
        setRecording(false);
      };

      recognition.onend = () => {
        if (recording) {
          // Restart if still supposed to be recording
          try {
            recognition.start();
          } catch (e) {
            setRecording(false);
            setStatus("Recording stopped");
          }
        }
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscriptSinceLast = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscriptSinceLast += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Send only final results to append to textarea
        if (finalTranscriptSinceLast) {
          const text = finalTranscriptSinceLast.trim();
          if (text) {
            console.log("Final transcript:", text);
            callbackRef.current?.(text, true); // true = append mode
          }
        }

        // Optionally show interim results in status
        if (interimTranscript) {
          setStatus(`Listening: ${interimTranscript}`);
        }
      };

      recognition.start();
    } catch (err) {
      setError(err.message || "Could not start speech recognition.");
      setStatus("Unable to start recording");
    }
  }

  // Helper to convert language codes
  function getLanguageCode(lang) {
    const langMap = {
      "en": "en-US",
      "hi": "hi-IN",
      "kn": "kn-IN",
      "es": "es-ES",
      "fr": "fr-FR",
      "de": "de-DE",
      "ja": "ja-JP",
      "zh": "zh-CN",
    };
    return langMap[lang] || "en-US";
  }

  return (
    <div className="live-mic-control">
      <div className="language-selector">
        <label htmlFor="language-select">Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={recording}
        >
          <option value="">Auto-detect (Multilingual)</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="kn">Kannada</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      <button
        type="button"
        className={`mic-button ${recording ? "is-recording" : ""}`}
        onClick={recording ? stopRecording : startRecording}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        {recording ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="2" width="6" height="13" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0M12 17v5M9 22h6" />
          </svg>
        )}

        {recording ? "Stop recording" : "Start speaking"}
      </button>

      <p className="mic-status">
        <span className={`status-dot ${recording ? "mic-active" : ""}`} />
        {status}
      </p>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
