import { radius, gray } from "../../theme";
import { useAnalysisContext } from "../../contexts/AnalysisContext";
import { canonical } from "../../utils/paths";
import clsx from "clsx";
import { useState, useEffect } from "react";

interface Props {
  tabs: string[];
  active: string | null;
  onClose(id: string): void;
  onActivate(id: string): void;
  onBack(): void;
}

export default function CodeViewer({
  tabs,
  active,
  onClose,
  onActivate,
}: Props) {
  const { files } = useAnalysisContext();
  const fileText = (id: string) =>
    files.find((f) => canonical(f) === id)?.text() ??
    Promise.resolve("// file not found");

  return (
    <main
      className={clsx(
        "m-0.5 flex flex-col bg-white",
        radius.outer, // same 24 px
        "overflow-hidden"
      )}
    >
      {/* --- Tab strip --- */}
      <div
        className={clsx(
          "flex gap-1 px-3 py-2",
          gray.header,
          "border-b",
          gray.stroke
        )}
      >
        {tabs.map((id) => (
          <button
            key={id}
            className={clsx(
              "flex items-center gap-2 px-3 py-1 text-sm",
              radius.pill,
              active === id
                ? "bg-white shadow"
                : "bg-brand-200/50 hover:bg-brand-200"
            )}
            onClick={() => onActivate(id)}
          >
            {id.split("/").pop()}
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
              className={clsx(
                "w-4 h-4 flex items-center justify-center text-[10px] font-bold",
                radius.pill,
                "bg-brand-300 hover:bg-red-500 text-white"
              )}
            >
              ×
            </span>
          </button>
        ))}
      </div>

      {/* --- Content --- */}
      <div className="flex-1 overflow-auto bg-brand-50 px-6 py-4 font-mono text-sm">
        {active ? (
          <AsyncCode fileId={active} fetchText={fileText} />
        ) : (
          <p className="text-brand-500">No file open</p>
        )}
      </div>
    </main>
  );
}

/* async loader component (simple) */
function AsyncCode({
  fileId,
  fetchText,
}: {
  fileId: string;
  fetchText: (id: string) => Promise<string>;
}) {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchText(fileId)
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fileId, fetchText]);

  if (loading) return <p>Loading…</p>;
  if (error) return <pre>{String(error)}</pre>;
  return <pre>{value}</pre>;
}
