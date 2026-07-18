import { Component } from 'react';

/** Catches WebGL / R3F render failures so the mission view is not a silent blue void. */
export default class WorldErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="world-error" role="alert">
          <p className="eyebrow">HVAC Technician World</p>
          <h2>3D view could not start</h2>
          <p>
            This browser could not create a WebGL context. Try updating your graphics drivers, using
            Chrome or Edge, or disabling hardware-acceleration blockers.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
