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

  const handleKeyDown = () => {
    if (!gameActive) {
      startGame();
    }
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

  const getBackgroundColor = (wpm) => {
    if (wpm < 30) return `hsl(0, 70%, 85%)`; 
    if (wpm > 90) return `hsl(120, 70%, 85%)`; 
    const step = ((wpm - 30) / 60) * 120; 
    return `hsl(${step}, 70%, 85%)`;
  };

  const speedLegend = [];
  speedLegend.push({ color: "hsl(0, 70%, 85%)", label: "<30 WPM" });
  for (let wpm = 30; wpm <= 90; wpm += 5) {
    const hue = ((wpm - 30) / 60) * 120; 
    speedLegend.push({ color: `hsl(${hue}, 70%, 85%)`, label: `${wpm} WPM` });
  }
  speedLegend.push({ color: "hsl(120, 70%, 85%)", label: ">90 WPM" });

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-between p-4"
      style={{ backgroundColor: getBackgroundColor(typingSpeed) }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col md:flex-row flex-wrap items-start">
        {speedLegend.map((item, idx) => (
          <div key={idx} className="flex items-center mb-1">
            <div
              style={{ backgroundColor: item.color }}
              className="w-6 h-6 border border-black mr-2"
            ></div>
            <span>{item.label}</span>
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
        placeholder={gameActive ? "Start typing..." : "Press any key to start"}
        disabled={timeLeft <= 0}
        rows={5}
        cols={60}
        className="w-full max-w-4xl p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="mt-4 text-lg">
        <p>Speed: {typingSpeed.toFixed(0)} WPM</p>
        <p>Time Left: {timeLeft} sec</p>
      </div>
    </div>
  );
}
