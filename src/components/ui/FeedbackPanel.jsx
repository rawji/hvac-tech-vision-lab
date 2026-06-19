import { useEffect, useRef } from 'react';

export default function FeedbackPanel({ result, onRestart, playIfUnlocked, sounds }) {
  const playedRef = useRef(false);

  useEffect(() => {
    if (!result || playedRef.current || !playIfUnlocked || !sounds) return;
    playedRef.current = true;
    playIfUnlocked(() =>
      result.isCorrect ? sounds.diagnosisCorrect() : sounds.diagnosisIncorrect()
    );
  }, [result, playIfUnlocked, sounds]);

  if (!result) return null;

  return (
    <div className={`panel feedback-panel ${result.isCorrect ? 'correct' : 'incorrect'}`}>
      <h2>{result.isCorrect ? 'Diagnosis Correct' : 'Diagnosis Incorrect'}</h2>
      <p>{result.feedback}</p>
      {!result.isCorrect && (
        <p className="correct-answer">
          Correct diagnosis: <strong>{result.correctDiagnosis}</strong>
        </p>
      )}
      <div className="related-concepts">
        <h4>Related Curriculum Concepts</h4>
        <ul>
          {result.relatedConcepts.map((concept) => (
            <li key={concept}>{concept}</li>
          ))}
        </ul>
        <p className="concept-note">Plain text labels only — no curriculum import in this POC.</p>
      </div>
      <button type="button" className="btn btn-primary" onClick={onRestart}>
        Return to Landing
      </button>
    </div>
  );
}
