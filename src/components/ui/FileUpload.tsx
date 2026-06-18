"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type === "application/pdf") {
    return (
      <span className="fu-type-icon fu-type-icon--pdf" aria-hidden>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" /><line x1="9" y1="11" x2="15" y2="11" />
        </svg>
        PDF
      </span>
    );
  }
  return (
    <span className="fu-type-icon fu-type-icon--img" aria-hidden>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      IMG
    </span>
  );
}

interface FileEntry {
  file: File;
  preview?: string;
}

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string | null;
  onError: (msg: string | null) => void;
}

export default function FileUpload({ files, onChange, error, onError }: FileUploadProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [shown, setShown] = useState(false);

  // Keep entries in sync with files prop (handles external resets)
  useEffect(() => {
    if (files.length === 0) {
      entries.forEach((e) => { if (e.preview) URL.revokeObjectURL(e.preview); });
      setEntries([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  // Revoke preview URLs on unmount
  useEffect(() => {
    return () => { entries.forEach((e) => { if (e.preview) URL.revokeObjectURL(e.preview); }); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length > 0) {
      const msgs = rejected.flatMap((r) => r.errors.map((e) => e.message));
      onError(msgs[0] ?? "One or more files were rejected.");
      return;
    }

    const next = [...entries, ...accepted.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))];

    const total = next.reduce((s, e) => s + e.file.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      onError("Total file size must be under 20 MB.");
      return;
    }

    onError(null);
    setEntries(next);
    onChange(next.map((e) => e.file));
  }, [entries, onChange, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_TOTAL_BYTES,
    validator: (file) => {
      const totalAfter = entries.reduce((s, e) => s + e.file.size, 0) + file.size;
      if (totalAfter > MAX_TOTAL_BYTES) {
        return { code: "total-too-large", message: "Adding this file would exceed the 20 MB total limit." };
      }
      return null;
    },
  });

  function remove(i: number) {
    const next = entries.filter((_, idx) => idx !== i);
    if (entries[i].preview) URL.revokeObjectURL(entries[i].preview!);
    setEntries(next);
    onChange(next.map((e) => e.file));
    onError(null);
  }

  return (
    <div className="fu-root">
      {/* Toggle */}
      <label className="fu-toggle">
        <input
          type="checkbox"
          className="fu-toggle-cb"
          checked={shown}
          onChange={(e) => {
            setShown(e.target.checked);
            if (!e.target.checked) {
              entries.forEach((e) => { if (e.preview) URL.revokeObjectURL(e.preview); });
              setEntries([]);
              onChange([]);
              onError(null);
            }
          }}
        />
        <span className="fu-toggle-box" aria-hidden />
        <span className="fu-toggle-label">
          Attach design references
          <span className="fu-toggle-hint">photos, sketches, PDF mood boards</span>
        </span>
      </label>

      {/* Expandable zone */}
      {shown && (
        <div className="fu-zone-wrap">
          <div
            {...getRootProps()}
            className={`fu-zone${isDragActive ? " fu-zone--active" : ""}${error ? " fu-zone--error" : ""}`}
          >
            <input {...getInputProps()} />
            <span className="fu-zone-icon" aria-hidden>
              {isDragActive ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8 17 12 21 16 17" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              )}
            </span>
            <p className="fu-zone-text">
              {isDragActive ? "Drop files here" : <><strong>Click to browse</strong> or drag and drop</>}
            </p>
            <p className="fu-zone-sub">JPG, PNG, WebP, PDF · max 20 MB total</p>
          </div>

          {/* File list */}
          {entries.length > 0 && (
            <ul className="fu-list">
              {entries.map((entry, i) => (
                <li key={i} className="fu-file">
                  {entry.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.preview} alt="" className="fu-thumb" aria-hidden />
                  ) : (
                    <span className="fu-thumb fu-thumb--placeholder" aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                    </span>
                  )}
                  <div className="fu-file-info">
                    <span className="fu-file-name">{entry.file.name}</span>
                    <span className="fu-file-meta">
                      <FileIcon type={entry.file.type} />
                      {fmtSize(entry.file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="fu-remove"
                    onClick={() => remove(i)}
                    aria-label={`Remove ${entry.file.name}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
