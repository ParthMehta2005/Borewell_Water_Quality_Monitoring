import { useState, useRef, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const BASE = "http://localhost:3000/api";

type StatusType = "idle" | "loading" | "ok" | "err";
interface StatusState { type: StatusType; msg: string; }
interface Metrics { min: number; avg: number; max: number; }

// ── Flatten any Gradio response shape into a number[] ─────────────────────────
function flattenNumbers(raw: unknown): number[] {
  if (raw === null || raw === undefined) return [];
  if (typeof raw === "number" && !isNaN(raw)) return [raw];
  if (typeof raw === "string" && !isNaN(Number(raw))) return [Number(raw)];
  if (Array.isArray(raw)) {
    const out: number[] = [];
    for (const item of raw) out.push(...flattenNumbers(item));
    return out;
  }
  if (typeof raw === "object") {
    const out: number[] = [];
    for (const v of Object.values(raw as Record<string, unknown>)) out.push(...flattenNumbers(v));
    return out;
  }
  return [];
}

// ── Upload Zone ────────────────────────────────────────────────────────────────
function UploadZone({ id, file, onFile }: { id: string; file: File | null; onFile: (f: File) => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handle = (f: File | undefined) => { if (!f || !f.name.endsWith(".csv")) return; onFile(f); };
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      style={{
        border: `1.5px dashed ${file ? "#68d391" : drag ? "#63b3ed" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12, padding: "1.75rem 1rem", textAlign: "center", cursor: "pointer",
        background: file ? "rgba(104,211,145,0.06)" : drag ? "rgba(99,179,237,0.06)" : "transparent",
        transition: "all 0.2s",
      }}
    >
      <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }}
        onChange={(e) => handle(e.target.files?.[0])} />
      <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{file ? "✅" : "📂"}</div>
      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e8edf5" }}>
        {file ? file.name : "Drop CSV or click to browse"}
      </div>
      <div style={{ fontSize: "0.7rem", color: "#6b7a96", marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>
        {file ? `${(file.size / 1024).toFixed(1)} KB` : `${id} · .csv only`}
      </div>
    </div>
  );
}

// ── Status Bar ─────────────────────────────────────────────────────────────────
function StatusBar({ status }: { status: StatusState }) {
  const colors: Record<StatusType, { bg: string; border: string; color: string }> = {
    idle:    { bg: "transparent",              border: "transparent",             color: "#3d4a63" },
    loading: { bg: "rgba(99,179,237,0.1)",      border: "rgba(99,179,237,0.3)",    color: "#63b3ed" },
    ok:      { bg: "rgba(104,211,145,0.1)",     border: "rgba(104,211,145,0.3)",   color: "#68d391" },
    err:     { bg: "rgba(252,129,129,0.1)",     border: "rgba(252,129,129,0.3)",   color: "#fc8181" },
  };
  const c = colors[status.type];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, marginTop: 12,
      background: c.bg, border: `0.5px solid ${c.border}`, color: c.color,
      fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace", minHeight: 36, transition: "all 0.3s",
    }}>
      {status.type === "loading" && (
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          border: "1.5px solid currentColor", borderTopColor: "transparent",
          animation: "spin 0.7s linear infinite", flexShrink: 0,
        }} />
      )}
      {status.msg}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "1.5rem", ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, fontSize: "0.62rem",
      fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.14em",
      textTransform: "uppercase", color: "#3d4a63", marginBottom: "1rem",
    }}>
      {children}
      <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 12, height: 12, border: "1.5px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [csvFile, setCsvFile]         = useState<File | null>(null);
  const [steps, setSteps]             = useState(5);
  const [trained, setTrained]         = useState(false);
  const [trainStatus, setTrainStatus] = useState<StatusState>({ type: "idle", msg: "upload a CSV above, then click Run Training" });
  const [predStatus,  setPredStatus]  = useState<StatusState>({ type: "idle", msg: "train the model first…" });
  const [trainLoading, setTrainLoading] = useState(false);
  const [predLoading,  setPredLoading]  = useState(false);
  const [metrics,   setMetrics]   = useState<Metrics | null>(null);
  const [tableRows, setTableRows] = useState<{ step: number; value: number }[]>([]);
  const [chartVals, setChartVals] = useState<number[]>([]);
  const [rawDebug,  setRawDebug]  = useState<string>("");

  const handleNewFile = (f: File) => {
    setCsvFile(f);
    setTrained(false);
    setTrainStatus({ type: "idle", msg: "new file loaded — click Run Training" });
    setPredStatus({ type: "idle", msg: "train the model first…" });
    setMetrics(null); setTableRows([]); setChartVals([]); setRawDebug("");
  };

  const runTrain = useCallback(async () => {
    if (!csvFile) return;
    setTrainLoading(true);
    setTrainStatus({ type: "loading", msg: "Training model on Gradio space…" });
    const fd = new FormData();
    fd.append("csv", csvFile);
    try {
      const r = await fetch(`${BASE}/train`, { method: "POST", body: fd });
      const d = await r.json();
      if (d.success) {
        setTrained(true);
        setTrainStatus({ type: "ok", msg: "Training complete ✓" });
        setPredStatus({ type: "idle", msg: "ready — set steps and click Generate Forecast" });
      } else {
        setTrainStatus({ type: "err", msg: d.error || "Training failed" });
      }
    } catch {
      setTrainStatus({ type: "err", msg: "Network error — is the backend running?" });
    }
    setTrainLoading(false);
  }, [csvFile]);

  const runPredict = useCallback(async () => {
    if (!csvFile) return;
    setPredLoading(true);
    setPredStatus({ type: "loading", msg: "Generating forecast…" });
    setMetrics(null); setTableRows([]); setChartVals([]); setRawDebug("");

    const fd = new FormData();
    fd.append("csv", csvFile);
    fd.append("steps", String(Math.max(1, steps)));
    try {
      const r = await fetch(`${BASE}/predict`, { method: "POST", body: fd });
      const d = await r.json();

      // Always capture raw for debugging if parsing fails
      setRawDebug(JSON.stringify(d.result ?? d, null, 2));

      if (d.success) {
        const vals = flattenNumbers(d.result);
        if (vals.length) {
          setMetrics({
            min: Math.min(...vals),
            avg: vals.reduce((a, b) => a + b, 0) / vals.length,
            max: Math.max(...vals),
          });
          setTableRows(vals.map((v, i) => ({ step: i + 1, value: v })));
          setChartVals(vals);
          setRawDebug(""); // clear debug — results rendered successfully
          setPredStatus({ type: "ok", msg: `Forecast ready — ${vals.length} values returned` });
        } else {
          setPredStatus({ type: "err", msg: "No numeric values found — see raw output below" });
        }
      } else {
        setPredStatus({ type: "err", msg: d.error || "Prediction failed" });
      }
    } catch (e) {
      setPredStatus({ type: "err", msg: `Network error — ${String(e)}` });
    }
    setPredLoading(false);
  }, [csvFile, steps]);

  const btnStyle = (variant: "primary" | "success", disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%", padding: "0.85rem 1.25rem", borderRadius: 10,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Syne', sans-serif", fontSize: "0.85rem", fontWeight: 600,
    opacity: disabled ? 0.35 : 1, transition: "all 0.2s",
    border: variant === "primary" ? "0.5px solid rgba(99,179,237,0.4)" : "0.5px solid rgba(104,211,145,0.4)",
    background: variant === "primary" ? "rgba(99,179,237,0.1)" : "rgba(104,211,145,0.1)",
    color: variant === "primary" ? "#63b3ed" : "#68d391",
  });

  const chartData = {
    labels: chartVals.map((_, i) => `+${i + 1}`),
    datasets: [{
      data: chartVals,
      borderColor: "#63b3ed", backgroundColor: "rgba(99,179,237,0.08)",
      borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: "#63b3ed",
      fill: true, tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(9,12,20,0.9)", borderColor: "rgba(99,179,237,0.3)", borderWidth: 0.5,
        titleColor: "#6b7a96", bodyColor: "#76e4f7",
        bodyFont: { family: "JetBrains Mono", size: 11 },
        titleFont: { family: "JetBrains Mono", size: 10 },
      },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#3d4a63", font: { family: "JetBrains Mono", size: 9 } } },
      y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#3d4a63", font: { family: "JetBrains Mono", size: 9 } } },
    },
  } as const;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#090c14", color: "#e8edf5", fontFamily: "'Syne', sans-serif", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
                ML <span style={{ color: "#63b3ed" }}>Borewell</span> Studio
              </h1>
              <p style={{ fontSize: "0.72rem", color: "#6b7a96", marginTop: 6, fontFamily: "JetBrains Mono, monospace" }}>
                train · predict · analyse
              </p>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, fontSize: "0.7rem",
              fontFamily: "JetBrains Mono, monospace", color: "#6b7a96",
              background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 999, padding: "6px 14px", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#68d391", boxShadow: "0 0 6px #68d391", animation: "pulse-dot 2s infinite" }} />
              Rover-X1 active
            </div>
          </div>

          {/* Step 0: Single CSV upload */}
          <Card style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Dataset</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace", padding: "3px 10px", borderRadius: 999,
                background: csvFile ? "rgba(99,179,237,0.1)" : "rgba(255,255,255,0.04)",
                color: csvFile ? "#63b3ed" : "#3d4a63",
                border: csvFile ? "0.5px solid rgba(99,179,237,0.3)" : "0.5px solid rgba(255,255,255,0.08)",
              }}>
                {csvFile ? `● ${csvFile.name}` : "● no file selected"}
              </div>
            </div>
            <SectionLabel>upload once — reused for training and prediction</SectionLabel>
            <UploadZone id="dataset" file={csvFile} onFile={handleNewFile} />
          </Card>

          {/* Steps 1 & 2: Train + Predict */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>

            {/* Train */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Train Model</div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace", padding: "3px 8px", borderRadius: 999,
                  background: trained ? "rgba(104,211,145,0.1)" : "rgba(246,224,94,0.1)",
                  color: trained ? "#68d391" : "#f6e05e",
                  border: trained ? "0.5px solid rgba(104,211,145,0.3)" : "0.5px solid rgba(246,224,94,0.3)",
                }}>
                  ● {trained ? "trained" : "untrained"}
                </div>
              </div>
              <SectionLabel>step 1 — fit the model</SectionLabel>
              <div style={{ fontSize: "0.72rem", color: "#6b7a96", fontFamily: "JetBrains Mono, monospace", marginBottom: "1rem", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                {csvFile ? `📄 ${csvFile.name} · ${(csvFile.size / 1024).toFixed(1)} KB` : "⚠ upload a CSV above first"}
              </div>
              <button style={btnStyle("primary", !csvFile || trainLoading)} disabled={!csvFile || trainLoading} onClick={runTrain}>
                {trainLoading ? <Spinner /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                {trainLoading ? "Training…" : "Run Training"}
              </button>
              <StatusBar status={trainStatus} />
            </Card>

            {/* Predict */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Predict</div>
                <div style={{ fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace", color: "#3d4a63" }}>steps ahead</div>
              </div>
              <SectionLabel>step 2 — generate forecast</SectionLabel>
              <div style={{ fontSize: "0.72rem", color: "#6b7a96", fontFamily: "JetBrains Mono, monospace", marginBottom: "1rem", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                {csvFile ? `📄 ${csvFile.name} · ${(csvFile.size / 1024).toFixed(1)} KB` : "⚠ upload a CSV above first"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: "#6b7a96", whiteSpace: "nowrap" }}>
                  forecast steps
                </label>
                <input
                  type="number" min={1} max={100} value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, color: "#e8edf5", fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.85rem", padding: "8px 12px", width: 90, outline: "none",
                  }}
                />
              </div>
              <button style={btnStyle("success", !csvFile || !trained || predLoading)} disabled={!csvFile || !trained || predLoading} onClick={runPredict}>
                {predLoading ? <Spinner /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>}
                {predLoading ? "Forecasting…" : "Generate Forecast"}
              </button>
              <StatusBar status={predStatus} />
            </Card>
          </div>

          {/* Results */}
          {chartVals.length > 0 && metrics ? (
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Forecast Results</div>
                <div style={{ fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace", color: "#6b7a96" }}>
                  {chartVals.length} values · {steps} steps
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "min", val: metrics.min, color: "#76e4f7" },
                  { label: "avg", val: metrics.avg, color: "#63b3ed" },
                  { label: "max", val: metrics.max, color: "#68d391" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color }}>{val.toFixed(4)}</div>
                    <div style={{ fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace", color: "#3d4a63", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              <SectionLabel>predicted values</SectionLabel>
              <div style={{ maxHeight: 240, overflowY: "auto", marginBottom: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem" }}>
                  <thead style={{ position: "sticky", top: 0, background: "#0d1120" }}>
                    <tr>
                      {["#", "Step", "Value"].map((h) => (
                        <th key={h} style={{ color: "#3d4a63", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 10px", textAlign: "left", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map(({ step, value }) => (
                      <tr key={step}>
                        <td style={{ padding: "8px 10px", borderBottom: "0.5px solid rgba(255,255,255,0.03)", color: "#3d4a63" }}>{String(step).padStart(2, "0")}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "0.5px solid rgba(255,255,255,0.03)", color: "#e8edf5" }}>Step +{step}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "0.5px solid rgba(255,255,255,0.03)", color: "#76e4f7", textAlign: "right" }}>{value.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "1rem 0" }} />
              <SectionLabel>trend</SectionLabel>
              <div style={{ height: 180 }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card>
          ) : (
            <Card>
              {rawDebug ? (
                <>
                  <div style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: "#fc8181", marginBottom: 8 }}>
                    No numeric values parsed. Raw Gradio response — use this to adjust <code>flattenNumbers()</code>:
                  </div>
                  <pre style={{
                    fontSize: "0.65rem", fontFamily: "JetBrains Mono, monospace", color: "#6b7a96",
                    background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "1rem",
                    overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all",
                    maxHeight: 200, overflowY: "auto",
                  }}>
                    {rawDebug}
                  </pre>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#3d4a63", fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 8, opacity: 0.4 }}>📊</div>
                  Results will appear here after prediction
                </div>
              )}
            </Card>
          )}

        </div>
      </div>
    </>
  );
}
