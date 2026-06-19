import { useCallback, useReducer, useRef } from 'react';
import LabLanding from './components/ui/LabLanding.jsx';
import TechnicianSelect from './components/ui/TechnicianSelect.jsx';
import MissionPanel from './components/ui/MissionPanel.jsx';
import QuickStartPanel from './components/ui/QuickStartPanel.jsx';
import MissionGuidance from './components/ui/MissionGuidance.jsx';
import ControlsHelpPanel from './components/ui/ControlsHelpPanel.jsx';
import ResetViewButton from './components/ui/ResetViewButton.jsx';
import DiagnosticScannerButton from './components/ui/DiagnosticScannerButton.jsx';
import ScanCard from './components/ui/ScanCard.jsx';
import DiagnosisPanel from './components/ui/DiagnosisPanel.jsx';
import FeedbackPanel from './components/ui/FeedbackPanel.jsx';
import ModeHUD from './components/ui/ModeHUD.jsx';
import InteractionPrompt from './components/interactions/InteractionPrompt.jsx';
import TouchMovePad from './components/interactions/TouchMovePad.jsx';
import HVACWorld from './components/world/HVACWorld.jsx';
import { getDefaultMission } from './data/missions.js';
import {
  APP_PHASE,
  initialMissionState,
  missionReducer,
  canSubmitDiagnosis,
} from './logic/missionState.js';
import { evaluateDiagnosis, getDiagnosisHint } from './logic/diagnosisEvaluator.js';
import { useTechVisionToggle } from './components/interactions/useKeyboardControls.js';
import { useTouchMovement } from './components/interactions/useTouchMovement.js';
import { applyMovementDelta } from './logic/worldBounds.js';

export default function App() {
  const [state, dispatch] = useReducer(missionReducer, initialMissionState);
  const mission = getDefaultMission();
  const posRef = useRef(state.playerPosition);
  posRef.current = state.playerPosition;

  const toggleTechVision = useCallback(() => {
    dispatch({ type: 'TOGGLE_TECH_VISION' });
  }, []);

  useTechVisionToggle(toggleTechVision, state.phase === APP_PHASE.MISSION);

  const handleStart = () => dispatch({ type: 'SET_PHASE', phase: APP_PHASE.TECHNICIAN_SELECT });

  const handleSelectTechnician = (technician, appearance) => {
    dispatch({
      type: 'SELECT_TECHNICIAN',
      technician,
      appearance,
      missionId: mission.id,
    });
  };

  const handleMove = useCallback((position) => {
    dispatch({ type: 'SET_PLAYER_POSITION', position });
  }, []);

  const handleMoveDelta = useCallback(
    ([dx, dz]) => {
      dispatch({
        type: 'SET_PLAYER_POSITION',
        position: applyMovementDelta(posRef.current, dx, dz),
      });
    },
    []
  );

  const { setDirection } = useTouchMovement(
    handleMoveDelta,
    state.phase === APP_PHASE.MISSION
  );

  const handleNearbyChange = useCallback((target) => {
    dispatch({ type: 'SET_NEARBY_TARGET', target });
  }, []);

  const handleInspect = useCallback(
    (targetId) => {
      dispatch({
        type: 'INSPECT_TARGET',
        targetId,
        equipmentHealth: mission.equipmentHealth,
      });
    },
    [mission.equipmentHealth]
  );

  const handleScan = useCallback(
    (targetId) => {
      if (!state.techVisionEnabled) return;
      dispatch({
        type: 'SCAN_TARGET',
        targetId,
        equipmentHealth: mission.equipmentHealth,
      });
    },
    [mission.equipmentHealth, state.techVisionEnabled]
  );

  const handleSubmitDiagnosis = () => {
    const result = evaluateDiagnosis(mission, state.selectedDiagnosis);
    dispatch({ type: 'SUBMIT_DIAGNOSIS', feedback: result });
  };

  const handleResetView = () => dispatch({ type: 'RESET_VIEW' });

  if (state.phase === APP_PHASE.LANDING) {
    return <LabLanding onStart={handleStart} />;
  }

  if (state.phase === APP_PHASE.TECHNICIAN_SELECT) {
    return (
      <TechnicianSelect
        onSelect={handleSelectTechnician}
        onBack={() => dispatch({ type: 'SET_PHASE', phase: APP_PHASE.LANDING })}
      />
    );
  }

  if (state.phase === APP_PHASE.COMPLETE && state.feedback) {
    return (
      <div className="screen complete-screen">
        <FeedbackPanel
          result={state.feedback}
          onRestart={() => dispatch({ type: 'RESET_MISSION' })}
        />
      </div>
    );
  }

  return (
    <div className="app mission-app">
      <header className="app-header">
        <h1>HVAC Technician World</h1>
        <div className="header-actions">
          <ResetViewButton onReset={handleResetView} />
          <DiagnosticScannerButton
            enabled={state.techVisionEnabled}
            onToggle={toggleTechVision}
          />
        </div>
      </header>

      <div className="mission-layout">
        <aside className="sidebar">
          <MissionPanel mission={mission} />
          <QuickStartPanel />
          <MissionGuidance state={state} />
          <ControlsHelpPanel />
          <ModeHUD
            techVisionEnabled={state.techVisionEnabled}
            scannedCount={state.scannedTargets.length}
            discoveredCount={state.discoveredClues.length}
            nearbyTarget={state.nearbyTarget}
          />
          <InteractionPrompt
            target={state.nearbyTarget}
            techVisionEnabled={state.techVisionEnabled}
            onInspect={handleInspect}
            onScan={handleScan}
          />
          <ScanCard
            scanResult={state.activeScanResult}
            interactionMode={state.interactionMode}
            onClose={() => dispatch({ type: 'CLEAR_SCAN' })}
          />
          <DiagnosisPanel
            options={mission.diagnosisOptions}
            selectedDiagnosis={state.selectedDiagnosis}
            onSelect={(diagnosis) => dispatch({ type: 'SELECT_DIAGNOSIS', diagnosis })}
            onSubmit={handleSubmitDiagnosis}
            canSubmit={canSubmitDiagnosis(state)}
            hint={getDiagnosisHint(state.scannedTargets.length)}
          />
        </aside>

        <main className="world-container">
          <HVACWorld
            equipmentHealth={mission.equipmentHealth}
            playerPosition={state.playerPosition}
            onMove={handleMove}
            onNearbyChange={handleNearbyChange}
            onInspect={handleInspect}
            onScan={handleScan}
            techVisionEnabled={state.techVisionEnabled}
            scannedTargets={state.scannedTargets}
            technician={state.selectedTechnician}
            appearance={state.selectedAppearance}
            cameraResetKey={state.cameraResetKey}
          />
          <TouchMovePad setDirection={setDirection} />
        </main>
      </div>
    </div>
  );
}
