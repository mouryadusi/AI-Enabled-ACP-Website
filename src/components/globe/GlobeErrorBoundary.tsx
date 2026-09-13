import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * WebGL/Three.js can fail for reasons entirely outside our control — a
 * disabled GPU, a strict browser sandbox, an unsupported context. Rather
 * than let that take out the whole "Live Airspace" panel (or the page),
 * this boundary catches it and swaps in the always-available 2D fallback
 * (FlightStatusFallback) so the traffic/risk data is never simply missing.
 */
export class GlobeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Globe3D failed to render, falling back to 2D view:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
