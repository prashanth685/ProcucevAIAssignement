export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a href="/" className="brand">
          <span className="brand-icon">S</span>
          <span>
            <strong>SpeechFlow</strong>
            <small>Speech workspace</small>
          </span>
        </a>

        <div className="connection-status">
          <span className="status-dot" />
          API connected
        </div>
      </div>
    </header>
  );
}
