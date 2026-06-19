import { LOT_SIZE } from '../../data/worldLayout.js';

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
      <planeGeometry args={[LOT_SIZE.width, LOT_SIZE.depth]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}
