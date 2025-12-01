export function BackupControls({ onExport, onImport }) {
  return (
    <div className="list-actions">
      <button onClick={onExport}>备份数据</button>
      <label className="upload-btn">
        <input
          type="file"
          accept="application/json"
          onChange={(event) => onImport(event.target.files?.[0] ?? null)}
        />
        恢复备份
      </label>
    </div>
  );
}
