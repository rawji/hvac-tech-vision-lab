export default function MissionPanel({ mission }) {
  if (!mission) return null;

  return (
    <div className="panel mission-panel">
      <h2>{mission.title}</h2>
      <p className="panel-label">Job</p>
      <p className="complaint">&ldquo;{mission.customerComplaint}&rdquo;</p>
      <p className="panel-label">Dispatch note</p>
      <p>{mission.objective}</p>
    </div>
  );
}
