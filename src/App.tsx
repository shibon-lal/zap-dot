import { useState, useEffect, useRef } from 'react'
import StartFinishModal from './components/start-finish-modal';
import './App.css'

function App() {
  const playingAreaRef = useRef<HTMLDivElement>(null);
  const movingObjectRef = useRef<HTMLDivElement>(null);
  const [autoMove, setAutoMove] = useState(true);
  const [moveDirection, setMoveDirection] = useState<"x" | "y">("x");
  const [isIncrement, setIsIncrement] = useState(true); //handle forward / backward
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 10, y: 10 }); //moving object position
  const [positionScore, setPositionScore] = useState({ x: 100, y: 100 }); // score object position
  const [isGameStart, setIsGameStart] = useState(true);
  const [restartGameStart, setRestartGameStart] = useState(false);
  const [delay, setDelay] = useState(500);
  const [scorePostionDelay] = useState(10000);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setAutoMove(false); // stop auto-move on any key press
      switch (event.key) {
        case "ArrowUp":
          setPosition((prev) => ({
            ...prev,
            y: clamp(prev.y - 10, 0, 480),
          }));

          setMoveDirection('y');
          setIsIncrement(false);
          setAutoMove(true);;
          break;
        case "ArrowDown":
          setPosition((prev) => ({
            ...prev,
            y: clamp(prev.y + 10, 0, 480),
          }));

          setMoveDirection('y');
          setIsIncrement(true);
          setAutoMove(true);;
          break;
        case "ArrowLeft":
          setPosition((prev) => ({
            ...prev,
            x: clamp(prev.x - 10, 0, 480),
          }));

          setMoveDirection('x');
          setIsIncrement(false);
          setAutoMove(true);;
          break;
        case "ArrowRight":
          setPosition((prev) => ({
            ...prev,
            x: clamp(prev.x + 10, 0, 480),
          }));
          setMoveDirection('x');
          setIsIncrement(true);
          setAutoMove(true);;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!autoMove || !isGameStart || restartGameStart) return;

    const playingArea = playingAreaRef.current;
    const movingObject = movingObjectRef.current;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = {
          ...prev,
          [moveDirection]: clamp(
            prev[moveDirection] + (isIncrement ? 10 : -10),
            0,
            480
          )
        };

        // Collision detection
        if (playingArea && movingObject) {
          const areaRect = playingArea.getBoundingClientRect();
          const objectRect = movingObject.getBoundingClientRect();

          const isTouchingOrOutside = (
            objectRect.left <= areaRect.left ||
            objectRect.right >= areaRect.right ||
            objectRect.top <= areaRect.top ||
            objectRect.bottom >= areaRect.bottom
          );

          if (isTouchingOrOutside) {
            setRestartGameStart(true);
          }

        }

        // Edge condition using newPos (not stale 'position')
        if (
          newPos.x === 0 || newPos.x === 495 ||
          newPos.y === 0 || newPos.y === 495
        ) {
          setRestartGameStart(true);
        }

        return newPos;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [autoMove, isGameStart, restartGameStart, moveDirection, delay, isIncrement, playingAreaRef, movingObjectRef]);


  //moving the score object radmonly
  useEffect(() => {
    const intervalScorePosition = setInterval(() => {
      const valX = Math.floor(Math.random() * 48) * 10;
      const valY = Math.floor(Math.random() * 48) * 10;

      setPositionScore(() => ({
        x: valX > 10 ? valX : 10,
        y: valY > 10 ? valY : 10,
      }));
    }, scorePostionDelay);
    return () => clearInterval(intervalScorePosition);
  }, [scorePostionDelay]);


  // Check for collision to update score
  useEffect(() => {
    const isCollision = () => {
      const size = 20;
      return (
        position.x < positionScore.x + size &&
        position.x + size > positionScore.x &&
        position.y < positionScore.y + size &&
        position.y + size > positionScore.y
      );
    };

    if (isCollision()) {
      setScore((prev) => prev + 10);
      setPositionScore(() => ({
        x: Math.floor(Math.random() * 48) * 10,
        y: Math.floor(Math.random() * 48) * 10,
      }));
      setDelay((prev) => Math.max(prev - 50, 100)); // Prevent negative or too-fast delay
    }
  }, [position, positionScore]);

  const handleGameStart = () => {
    setIsGameStart(true);
  }

  const handleGameRestart = () => {
    setRestartGameStart(false);
    setIsGameStart(true);
    setPosition({ x: 10, y: 10 });
    setScore(0);
    setDelay(500);
    setAutoMove(true);
    setMoveDirection("x");
    setIsIncrement(true);
  };

  return (
    <>

      <div id="score_card">Score {score} </div>

      {!isGameStart && <StartFinishModal label='Start' buttonAction={handleGameStart} score={score} />}
      {restartGameStart && <StartFinishModal label='ReStart' buttonAction={handleGameRestart} score={score} />}
      {isGameStart && !restartGameStart && <div id="playingArea" ref={playingAreaRef} style={{
        width: '480px',
        height: '480px'
      }}>
        <div id="score_object"
          className='bloom'
          style={{
            position: 'absolute',
            left: positionScore.x,
            top: positionScore.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'orange',
          }}
        ></div>
        <div id="moving_object"
          ref={movingObjectRef}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'blue',
          }}
        >
        </div>
      </div>}
    </>
  )
}

export default App
