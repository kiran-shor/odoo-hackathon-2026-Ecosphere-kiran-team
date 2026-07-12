import { API_BASE_URL, API_MODES, getApiMode, setApiMode } from '../api/client';

export default function ApiModeToggle() {
  const currentMode = getApiMode();

  function handleChange(event) {
    setApiMode(event.target.value);
    window.location.reload();
  }

  return (
    <label className="api-mode-toggle" title={`Backend URL: ${API_BASE_URL}`}>
      <span>API</span>
      <select value={currentMode} onChange={handleChange}>
        <option value={API_MODES.backend}>Backend</option>
        <option value={API_MODES.mock}>Mock</option>
      </select>
    </label>
  );
}
