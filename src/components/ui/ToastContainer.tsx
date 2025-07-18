import { useToast } from "../../hooks/useToast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg border max-w-sm
            ${
              toast.type === "info"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : ""
            }
            ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : ""
            }
            ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : ""
            }
          `}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-neutral-400 hover:text-neutral-600 transition"
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
