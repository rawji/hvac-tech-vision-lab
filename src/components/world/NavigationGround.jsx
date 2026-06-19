export default function NavigationGround({ onNavigate, pointerDragRef }) {
  const handleClick = (e) => {
    if (pointerDragRef?.current?.didDrag) return;
    e.stopPropagation();
    onNavigate?.([e.point.x, e.point.z]);
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.018, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[18, 18]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}
