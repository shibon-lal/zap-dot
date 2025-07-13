type StartFinishModalProps = {
  label: string,
  score: number,
  buttonAction : () => void,
};
const StartFinishModal = ({ label, score, buttonAction }: StartFinishModalProps) => {
  return (
      <div className="modal-backdrop">
        <div className="modal">
          <h2>Collect  Object</h2>
          <h3>Score : {score}</h3>
          <p>Collect the yellow object by using the right/left/top/bottom arrows</p>
          <button onClick={buttonAction}>{label}</button>
        </div>
      </div>
  );
};

export default StartFinishModal;
