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
import EquipmentActionMenu from './components/ui/EquipmentActionMenu.jsx';
import VanMenu from './components/ui/VanMenu.jsx';
import DiagnosisPanel from './components/ui/DiagnosisPanel.jsx';
import FeedbackPanel from './components/ui/FeedbackPanel.jsx';
import LoadingSplash from './components/ui/LoadingSplash.jsx';
import ClueToast from './components/ui/ClueToast.jsx';
import MuteToggle from './components/ui/MuteToggle.jsx';
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
import { useLabAudio } from './hooks/useLabAudio.js';
import { setCondenserHumActive } from './logic/labAudio.js';

const HVACWorld = lazy(() => import('./components/world/HVACWorld.jsx'));

const CONDENSER_IDS = new Set([
  'condenser',
  'condenserCoil',
  'compressor',
  'capacitor',
  'fanMotor',
  'contactor',
  'disconnect',
]);

function isNearCondenser(playerPosition, nearbyTarget) {
  if (nearbyTarget && CONDENSER_IDS.has(nearbyTarget.id)) return true;
  const [x, , z] = playerPosition;
  return Math.hypot(x - 4, z + 1) < 4.5;
}

export default function App() {
  const [state, dispatch] = useReducer(missionReducer, initialMissionState);
  const [worldReady, setWorldReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionMenuTargetId, setActionMenuTargetId] = useState(null);
  const [vanMenuOpen, setVanMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const mission = getDefaultMission();
  const prevNearbyId = useRef(null);

  const {
    muted,
    unlocked,
    unlock,
    toggleMute,
    playIfUnlocked,
    sounds,
    prevTechVision,
    prevClueToast,
    prevNearbyCondenser,
  } = useLabAudio(
    state.phase === APP_PHASE.MISSION || state.phase === APP_PHASE.COMPLETE
  );

  const toggleTechVision = useCallback(async () => {
    await unlock();
    dispatch({ type: 'TOGGLE_TECH_VISION' });
  }, [unlock]);

  useTechVisionToggle(toggleTechVision, state.phase === APP_PHASE.MISSION);

  useEffect(() => {
    if (!state.scanPulseTarget) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_SCAN_PULSE' }), 900);
    return () => clearTimeout(timer);
  }, [state.scanPulseTarget]);

  useEffect(() => {
    if (!state.inspectPulseTarget) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_INSPECT_PULSE' }), 500);
    return () => clearTimeout(timer);
  }, [state.inspectPulseTarget]);

  useEffect(() => {
    if (!state.interactionNotice) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_INTERACTION_NOTICE' }), 2500);
    return () => clearTimeout(timer);
  }, [state.interactionNotice]);

  useEffect(() => {
    if (!state.clueToast) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_CLUE_TOAST' }), 4500);
    return () => clearTimeout(timer);
  }, [state.clueToast]);

  useEffect(() => {
    if (state.phase !== APP_PHASE.MISSION || !unlocked) return;
    if (prevTechVision.current === null) {
      prevTechVision.current = state.techVisionEnabled;
      return;
    }
    if (prevTechVision.current !== state.techVisionEnabled) {
      playIfUnlocked(() =>
        state.techVisionEnabled ? sounds.techVisionOn() : sounds.techVisionOff()
      );
      prevTechVision.current = state.techVisionEnabled;
    }
  }, [state.techVisionEnabled, state.phase, unlocked, playIfUnlocked, sounds, prevTechVision]);

  useEffect(() => {
    if (!state.clueToast || state.clueToast === prevClueToast.current) return;
    prevClueToast.current = state.clueToast;
    playIfUnlocked(() => sounds.clueLogged());
  }, [state.clueToast, playIfUnlocked, sounds, prevClueToast]);

  useEffect(() => {
    if (state.phase !== APP_PHASE.MISSION) {
      setCondenserHumActive(false);
      return;
    }
    const nearCondenser = isNearCondenser(state.playerPosition, state.nearbyTarget);
    if (nearCondenser !== prevNearbyCondenser.current) {
      prevNearbyCondenser.current = nearCondenser;
      if (unlocked && !muted) {
        setCondenserHumActive(nearCondenser);
      }
    }
  }, [
    state.playerPosition,
    state.nearbyTarget,
    state.phase,
    unlocked,
    muted,
    prevNearbyCondenser,
  ]);

  useEffect(() => {
    if (muted) {
      setCondenserHumActive(false);
    } else if (
      unlocked &&
      state.phase === APP_PHASE.MISSION &&
      isNearCondenser(state.playerPosition, state.nearbyTarget)
    ) {
      setCondenserHumActive(true);
    }
  }, [muted, unlocked, state.phase, state.playerPosition, state.nearbyTarget]);

  useEffect(() => {
    if (!state.techVisionEnabled || !unlocked) return;
    const id = state.nearbyTarget?.id ?? null;
    if (id && id !== prevNearbyId.current) {
      playIfUnlocked(() => sounds.scanLock());
    }
    prevNearbyId.current = id;
  }, [state.nearbyTarget, state.techVisionEnabled, unlocked, playIfUnlocked, sounds]);

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
        } else if (vanMenuOpen) {
          setVanMenuOpen(false);
        } else if (actionMenuTargetId) {
          setActionMenuTargetId(null);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, state.activeScanResult, sidebarOpen, vanMenuOpen, actionMenuTargetId]);

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

  const handleActiveTargetChange = useCallback((activeTarget) => {
    dispatch({ type: 'SET_NEARBY_TARGET', target: activeTarget });
  }, []);

  const handleSelectTarget = useCallback((targetId) => {
    dispatch({ type: 'SELECT_TARGET', targetId: targetId ?? null });
  }, []);

  const handleScanBlocked = useCallback(() => {
    dispatch({
      type: 'SHOW_INTERACTION_NOTICE',
      message: 'Enable Tech Vision to scan equipment',
    });
  }, []);

  const handleInspect = useCallback(
    (targetId) => {
      dispatch({
        type: 'INSPECT_TARGET',
        targetId,
        equipmentHealth: mission.equipmentHealth,
      });
      setActionMenuTargetId(targetId);
      setSidebarOpen(false);
    },
    [mission.equipmentHealth]
  );

  const handleScan = useCallback(
    (targetId) => {
      if (!state.techVisionEnabled) {
        handleScanBlocked();
        return;
      }
      dispatch({
        type: 'SCAN_TARGET',
        targetId,
        equipmentHealth: mission.equipmentHealth,
      });
      playIfUnlocked(() => sounds.scanComplete());
      setActionMenuTargetId(targetId);
      setSidebarOpen(false);
    },
    [mission.equipmentHealth, state.techVisionEnabled, playIfUnlocked, sounds, handleScanBlocked]
  );

  const handleViewNotes = useCallback(
    (targetId) => {
      dispatch({
        type: 'INSPECT_TARGET',
        targetId,
        equipmentHealth: mission.equipmentHealth,
      });
      setVanMenuOpen(false);
    },
    [mission.equipmentHealth]
  );

  const handleArrivedAtTarget = useCallback((targetId) => {
    setActionMenuTargetId(targetId);
  }, []);

  const handleVanArrival = useCallback(() => {
    setVanMenuOpen(true);
    setActionMenuTargetId(null);
  }, []);

  const handleSubmitDiagnosis = () => {
    playIfUnlocked(() => sounds.diagnosisSubmit());
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
          playIfUnlocked={playIfUnlocked}
          sounds={sounds}
        />
      </div>
    );
  }

  return (
    <div className="app mission-app">
      <header className="app-header desktop-only-header">
        <h1>HVAC Technician World</h1>
        <div className="header-actions">
          <MuteToggle muted={muted} onToggle={toggleMute} />
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
        activeTarget={state.nearbyTarget}
        selectedTargetId={state.selectedTargetId}
        isNavigating={isNavigating}
      />

      <div className="mission-layout world-first">
        <main className="world-container">
          <Suspense fallback={<LoadingSplash message="Loading neighborhood scene…" progress={0.4} />}>
            <HVACWorld
              equipmentHealth={mission.equipmentHealth}
              playerPosition={state.playerPosition}
              onMove={handleMove}
              onActiveTargetChange={handleActiveTargetChange}
              onSelectTarget={handleSelectTarget}
              onInspect={handleInspect}
              onScan={handleScan}
              onScanBlocked={handleScanBlocked}
              onVanArrival={handleVanArrival}
              onArrivedAtTarget={handleArrivedAtTarget}
              techVisionEnabled={state.techVisionEnabled}
              scannedTargets={state.scannedTargets}
              inspectedTargets={state.inspectedTargets}
              selectedTargetId={state.selectedTargetId}
              scanPulseTarget={state.scanPulseTarget}
              inspectPulseTarget={state.inspectPulseTarget}
              technician={state.selectedTechnician}
              appearance={state.selectedAppearance}
              cameraResetKey={state.cameraResetKey}
              onReady={handleWorldReady}
              onNavigatingChange={setIsNavigating}
              uiStable={Boolean(
                state.activeScanResult || vanMenuOpen || actionMenuTargetId
              )}
            />
          </Suspense>
          {!worldReady && (
            <div className="loading-overlay">
              <LoadingSplash message="Preparing service-call environment..." progress={0.85} />
            </div>
          )}
          <WorldControlsOverlay
            techVisionEnabled={state.techVisionEnabled}
            onToggleTechVision={toggleTechVision}
            onResetView={handleResetView}
            muted={muted}
            onToggleMute={toggleMute}
            interactionNotice={state.interactionNotice}
            isNavigating={isNavigating}
            activeTarget={state.nearbyTarget}
          />
          <EquipmentActionMenu
            targetId={state.activeScanResult ? null : actionMenuTargetId}
            techVisionEnabled={state.techVisionEnabled}
            onInspect={handleInspect}
            onScan={handleScan}
            onViewNotes={handleViewNotes}
            onClose={() => setActionMenuTargetId(null)}
          />
          {vanMenuOpen && (
            <div className="van-menu-overlay">
              <VanMenu
                mission={mission}
                onClose={() => setVanMenuOpen(false)}
                onViewNotes={handleViewNotes}
              />
            </div>
          )}
          <ClueToast
            message={state.clueToast}
            onDismiss={() => dispatch({ type: 'CLEAR_CLUE_TOAST' })}
          />
          {state.interactionNotice && (
            <div className="interaction-notice-toast" role="status">
              {state.interactionNotice}
            </div>
          )}
          {state.activeScanResult && (
            <div className="scan-card-overlay">
              <ScanCard
                scanResult={state.activeScanResult}
                interactionMode={state.interactionMode}
                onClose={() => dispatch({ type: 'CLEAR_SCAN' })}
                techVisionEnabled={state.techVisionEnabled}
                onScan={handleScan}
                onViewNotes={handleViewNotes}
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
