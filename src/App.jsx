import { useState, useEffect, useRef } from "react";
import sentences from "./sentences";

export default function App() {
  const [text, setText] = useState(""); 
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [typingSpeed, setTypingSpeed] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(60); 
  const [gameActive, setGameActive] = useState(false);

  const textareaRef = useRef(null);

  const generateParagraph = () => {
    let paragraph = "";
    while (paragraph.length < 200) {
      const random = sentences[Math.floor(Math.random() * sentences.length)];
      paragraph += random + " ";
    }
    return paragraph.trim();
  };

  const startGame = () => {
    setText(generateParagraph());
    setUserInput("");
    setStartTime(Date.now());
    setTypingSpeed(0);
    setTimeLeft(60);
    setGameActive(true);
    textareaRef.current.focus();
  };

  useEffect(() => {
    if (!gameActive || !userInput) return;

    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    const wpm = userInput.length / 5 / elapsedMinutes;
    setTypingSpeed(wpm);

    if (userInput.length >= text.length - 1) {
      setText((prev) => prev + " " + generateParagraph());
    }
  }, [userInput]);

  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const bgColors = {
    30: "#f06292",     
    40: "#ff8a65",     
    50: "#ffb74d",  
    60: "#fff176",        
    70: "#aed581",   
    80: "#3dc1b4ff",   
    90: "#76d2f1ff",      
  };
  
  const getBackgroundColor = (wpm) => {
    if (wpm < 30) return bgColors[30];
    if (wpm >= 90) return bgColors[90];

    if (wpm < 40) return bgColors[30];
    if (wpm < 50) return bgColors[40];
    if (wpm < 60) return bgColors[50];
    if (wpm < 70) return bgColors[60];
    if (wpm < 80) return bgColors[70];
    if (wpm < 90) return bgColors[80];
  };

  const speedLegend = [
    { color: bgColors[30], label: "<30 WPM" },
    { color: bgColors[40], label: "40 WPM" },
    { color: bgColors[50], label: "50 WPM" },
    { color: bgColors[60], label: "60 WPM" },
    { color: bgColors[70], label: "70 WPM" },
    { color: bgColors[80], label: "80 WPM" },
    { color: bgColors[90], label: ">90 WPM" },
  ];

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-between"
      style={{ backgroundColor: getBackgroundColor(typingSpeed) }}
    >
      <div className="flex flex-wrap justify-center gap-2 mb-4 w-full ">
        {speedLegend.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-1 px-1 py-0.5 rounded-md text-xs"
          >
            <div
              style={{ backgroundColor: item.color }}
              className="w-4 h-4 rounded-sm border border-black"
            ></div>
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>

      <h1 className="text-3xl mb-6">Typing Game</h1>

      <div className="w-full max-w-4xl mb-4 p-4">
        <p className="text-lg leading-relaxed">
          {text.split("").map((char, idx) => {
            let color = "#000"; 
            if (idx < userInput.length) {
              color = userInput[idx] === char ? "green" : "red";
            }
            return (
              <span key={idx} style={{ color }}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      <textarea
        ref={textareaRef}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={gameActive ? "Start typing..." : "Click start to begin"}
        disabled={timeLeft <= 0}
        rows={5}
        cols={60}
        className="w-full max-w-4xl p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="w-full flex justify-center">
        <div className="flex items-center gap-4 px-3 py-1 w-full rounded-md bg-white/40 border border-black/20 text-sm">
          <button
            onClick={startGame}
            className="hover:scale-110 transition"
          >
            {gameActive ? "[ Restart ]" : "[ Start ]"}
          </button>

          <p className="whitespace-nowrap">
            Speed: {typingSpeed.toFixed(0)} WPM
          </p>

          <p className="whitespace-nowrap">
            Time Left: {timeLeft} sec
          </p>
        </div>
      </div>


    </div>
  );
}
