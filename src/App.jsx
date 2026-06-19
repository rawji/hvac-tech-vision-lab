import { useCallback, useEffect, useReducer, useRef, useState, lazy, Suspense } from 'react';
import LabLanding from './components/ui/LabLanding.jsx';
import TechnicianSelect from './components/ui/TechnicianSelect.jsx';
import MissionPanel from './components/ui/MissionPanel.jsx';
import MissionGuidance from './components/ui/MissionGuidance.jsx';
import ControlsHelpPanel from './components/ui/ControlsHelpPanel.jsx';
import CompactMissionBar from './components/ui/CompactMissionBar.jsx';
import WorldControlsOverlay from './components/ui/WorldControlsOverlay.jsx';
import DiagnosticScannerButton from './components/ui/DiagnosticScannerButton.jsx';
import ScanCard from './components/ui/ScanCard.jsx';
import DiagnosisPanel from './components/ui/DiagnosisPanel.jsx';
import FeedbackPanel from './components/ui/FeedbackPanel.jsx';
import InteractionPrompt from './components/interactions/InteractionPrompt.jsx';
import TouchMovePad from './components/interactions/TouchMovePad.jsx';
import LoadingSplash from './components/ui/LoadingSplash.jsx';
import ClueToast from './components/ui/ClueToast.jsx';
import QuickStartPanel from './components/ui/QuickStartPanel.jsx';
import { getDefaultMission } from './data/missions.js';
import {
  APP_PHASE,
  initialMissionState,
  missionReducer,
  canSubmitDiagnosis,
} from './logic/missionState.js';
import { evaluateDiagnosis, getDiagnosisHint } from './logic/diagnosisEvaluator.js';
import { shouldDismissQuickStart } from './logic/clueToast.js';
import { useTechVisionToggle } from './components/interactions/useKeyboardControls.js';
import { useTouchMovement } from './components/interactions/useTouchMovement.js';
import { applyMovementDelta } from './logic/worldBounds.js';

const HVACWorld = lazy(() => import('./components/world/HVACWorld.jsx'));

export default function App() {
  const [state, dispatch] = useReducer(missionReducer, initialMissionState);
  const [worldReady, setWorldReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mission = getDefaultMission();
  const posRef = useRef(state.playerPosition);
  const cameraBasisRef = useRef({ forward: [0, -1], right: [1, 0] });
  posRef.current = state.playerPosition;

  const toggleTechVision = useCallback(() => {
    dispatch({ type: 'TOGGLE_TECH_VISION' });
  }, []);

  useTechVisionToggle(toggleTechVision, state.phase === APP_PHASE.MISSION);

  useEffect(() => {
    if (!state.scanPulseTarget) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_SCAN_PULSE' }), 600);
    return () => clearTimeout(timer);
  }, [state.scanPulseTarget]);

  useEffect(() => {
    if (!state.clueToast) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_CLUE_TOAST' }), 4000);
    return () => clearTimeout(timer);
  }, [state.clueToast]);

  useEffect(() => {
    if (state.phase === APP_PHASE.MISSION) {
      setWorldReady(false);
    }
  }, [state.phase, state.selectedTechnician, state.selectedAppearance]);

  useEffect(() => {
    if (state.phase !== APP_PHASE.MISSION) return undefined;

    const onKeyDown = (e) => {
      if (e.code === 'Escape') {
        if (state.activeScanResult) {
          dispatch({ type: 'CLEAR_SCAN' });
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, state.activeScanResult, sidebarOpen]);

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

  const handleMoveDelta = useCallback(([dx, dz]) => {
    dispatch({
      type: 'SET_PLAYER_POSITION',
      position: applyMovementDelta(posRef.current, dx, dz),
    });
  }, []);

  const { setDirection } = useTouchMovement(
    handleMoveDelta,
    state.phase === APP_PHASE.MISSION,
    cameraBasisRef
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
      setSidebarOpen(true);
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
      setSidebarOpen(true);
    },
    [mission.equipmentHealth, state.techVisionEnabled]
  );

  const handleSubmitDiagnosis = () => {
    const result = evaluateDiagnosis(mission, state.selectedDiagnosis);
    dispatch({ type: 'SUBMIT_DIAGNOSIS', feedback: result });
  };

  const handleResetView = () => dispatch({ type: 'RESET_VIEW' });
  const handleWorldReady = useCallback(() => setWorldReady(true), []);
  const showQuickStart = !shouldDismissQuickStart(state);
  const showDiagnosis = state.scannedTargets.length >= 1 || state.selectedDiagnosis;
  const immersiveMode = shouldDismissQuickStart(state);

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
      <header className="app-header desktop-only-header">
        <h1>HVAC Technician World</h1>
        <div className="header-actions">
          <DiagnosticScannerButton
            enabled={state.techVisionEnabled}
            onToggle={toggleTechVision}
          />
        </div>
      </header>

      <CompactMissionBar
        mission={mission}
        scannedCount={state.scannedTargets.length}
        techVisionEnabled={state.techVisionEnabled}
      />

      <div className="mission-layout world-first">
        <main className="world-container">
          <Suspense fallback={<LoadingSplash message="Loading WebGL modules..." progress={0.4} />}>
            <HVACWorld
              equipmentHealth={mission.equipmentHealth}
              playerPosition={state.playerPosition}
              onMove={handleMove}
              onNearbyChange={handleNearbyChange}
              onInspect={handleInspect}
              onScan={handleScan}
              techVisionEnabled={state.techVisionEnabled}
              scannedTargets={state.scannedTargets}
              scanPulseTarget={state.scanPulseTarget}
              technician={state.selectedTechnician}
              appearance={state.selectedAppearance}
              cameraResetKey={state.cameraResetKey}
              onReady={handleWorldReady}
              cameraBasisRef={cameraBasisRef}
            />
          </Suspense>
          {!worldReady && (
            <div className="loading-overlay">
              <LoadingSplash message="Preparing service-call environment..." progress={0.85} />
            </div>
          )}
          <WorldControlsOverlay
            nearbyTarget={state.nearbyTarget}
            techVisionEnabled={state.techVisionEnabled}
            onToggleTechVision={toggleTechVision}
            onInspect={handleInspect}
            onScan={handleScan}
            onResetView={handleResetView}
          />
          <TouchMovePad setDirection={setDirection} />
          <ClueToast
            message={state.clueToast}
            onDismiss={() => dispatch({ type: 'CLEAR_CLUE_TOAST' })}
          />
          {state.activeScanResult && (
            <div className="scan-card-overlay">
              <ScanCard
                scanResult={state.activeScanResult}
                interactionMode={state.interactionMode}
                onClose={() => dispatch({ type: 'CLEAR_SCAN' })}
              />
            </div>
          )}
        </main>

        <button
          type="button"
          className="sidebar-toggle mobile-only"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? 'Hide Details' : 'Mission Details'}
        </button>

        <aside className={`sidebar sidebar-compact ${sidebarOpen ? 'open' : ''} ${immersiveMode ? 'immersive' : ''}`}>
          {!immersiveMode && <MissionPanel mission={mission} />}
          {showQuickStart && <QuickStartPanel />}
          <MissionGuidance state={state} />
          <InteractionPrompt
            target={state.nearbyTarget}
            techVisionEnabled={state.techVisionEnabled}
            onInspect={handleInspect}
            onScan={handleScan}
          />
          {showDiagnosis && (
            <div className="diagnosis-drawer">
              <DiagnosisPanel
                options={mission.diagnosisOptions}
                selectedDiagnosis={state.selectedDiagnosis}
                onSelect={(diagnosis) => dispatch({ type: 'SELECT_DIAGNOSIS', diagnosis })}
                onSubmit={handleSubmitDiagnosis}
                canSubmit={canSubmitDiagnosis(state)}
                hint={getDiagnosisHint(state.scannedTargets.length)}
              />
            </div>
          )}
          <ControlsHelpPanel />
        </aside>
      </div>
    </div>
  );
}
