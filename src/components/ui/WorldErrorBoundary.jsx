import { Component } from 'react';

function isFirefox() {
  return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
}

function errorText(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  return error.message || String(error);
}

/** Catches R3F / WebGL failures and shows the real cause plus recovery tips. */
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
      const detail = errorText(this.state.error);
      const webglFailed = /webgl/i.test(detail);

      return (
        <div className="world-error" role="alert">
          <p className="eyebrow">HVAC Technician World</p>
          <h2>3D view could not start</h2>
          <p>
            {webglFailed
              ? isFirefox()
                ? 'Firefox could not create a WebGL context for this page. Enable hardware acceleration (Settings → General → Performance), disable canvas/fingerprint blockers for this site, confirm https://get.webgl.org/ works, then reload.'
                : 'This browser could not create a WebGL context. Enable hardware acceleration, disable WebGL blockers, or try Edge/Chrome.'
              : 'Something went wrong while starting the neighborhood scene. Try reloading. If it keeps failing in Firefox, Edge or Chrome usually work.'}
          </p>
          <p className="world-error-detail">{detail}</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
