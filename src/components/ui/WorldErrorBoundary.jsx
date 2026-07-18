import { Component } from 'react';

function isFirefox() {
  return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
}

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
            {isFirefox()
              ? 'Firefox blocked or failed WebGL for this page. Enable hardware acceleration (Settings → General → Performance), turn off canvas/fingerprint blockers for this site, then reload. The scene already works in Edge.'
              : 'This browser could not create a WebGL context. Try updating graphics drivers, enabling hardware acceleration, or using Edge/Chrome.'}
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
