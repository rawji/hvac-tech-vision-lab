import { Html } from '@react-three/drei';
import { useTechVision } from './TechVisionProvider.jsx';

export default function DiagnosticTextCard({ title, lines, position }) {
  const { enabled } = useTechVision();
  if (!enabled) return null;

  return (
    <Html position={position} center distanceFactor={14} zIndexRange={[100, 0]}>
      <div className="diagnostic-text-card">
        <pre className="ascii-border">|||||||||||||</pre>
        <pre className="ascii-title">{`|| ${title} ||`}</pre>
        <pre className="ascii-border">|||||||||||||</pre>
        {lines.map((line) => (
          <p key={line} className="diag-line">{line}</p>
        ))}
      </div>
    </Html>
  );
}
