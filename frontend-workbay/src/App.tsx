import { useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:3000";

async function fetchOptionsFromApi(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/csv/entities`);

  if (!res.ok) {
    throw new Error(`Failed to load entities: ${res.status}`);
  }

  const data = await res.json();

  // Case 1: endpoint returns ["JobZone", "Occupation"]
  if (Array.isArray(data) && typeof data[0] === "string") {
    return data as string[];
  }

  // Case 2: endpoint returns [{ name: "JobZone" }, { name: "Occupation" }]
  if (Array.isArray(data) && typeof data[0] === "object") {
    return data.map((item: any) => item.name ?? item.label ?? item.value ?? "");
  }

  return [];
}

async function uploadFileApi(file: File, entityName: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("entityName", entityName);

  const res = await fetch(`${API_BASE}/csv/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let message = `Upload failed (${res.status})`;

    try {
      const data = await res.json();

      // Handle NestJS error shapes:
      // { message: "Error text" }
      // { message: ["Error1", "Error2"] }
      if (data?.message) {
        if (Array.isArray(data.message)) {
          message = data.message.join("\n");
        } else {
          message = data.message;
        }
      }
    } catch {
      // ignore parse errors; keep default message
    }

    throw new Error(message);
  }

  return res.json();
}

async function downloadApi(entityName: string) {
  const res = await fetch(`${API_BASE}/csv/download/${entityName}`);

  if (!res.ok) {
    let message = `Download failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join("\n")
          : data.message;
      }
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(message);
  }

  // Convert into a Blob to force download
  const blob = await res.blob();

  // Create a downloadable link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  // Optional: Use provided filename or generate one
  const filename = `${entityName}.csv`;

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  a.remove();
  window.URL.revokeObjectURL(url);
}


function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [mode, setMode] = useState<"upload" | "download">("upload");
  const [loading, setLoading] = useState(false);

  // ✅ Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load dropdown options from endpoint
  useEffect(() => {
    fetchOptionsFromApi()
      .then((opts) => {
        setOptions(opts);
        if (!selectedOption && opts.length > 0) {
          setSelectedOption(opts[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setAlertType("error");
        setAlertMessage(err.message || "Failed to load options.");
      });
  }, []);

  const showSuccess = (msg: string) => {
    setAlertType("success");
    setAlertMessage(msg);
  };

  const showError = (msg: string) => {
    setAlertType("error");
    setAlertMessage(msg);
  };

  const handleUploadClick = () => {
    if (!selectedOption) {
      showError("Please select an option first.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset previous selection
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setAlertMessage(null);
      await uploadFileApi(file, selectedOption);
      showSuccess(
        `File "${file.name}" uploaded successfully for ${selectedOption}.`
      );
    } catch (err: any) {
      console.error(err);
      showError(err?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleDownloadClick = async () => {
  if (!selectedOption) {
    showError("Please select an option first.");
    return;
  }

  try {
    setLoading(true);
    setAlertMessage(null);

    await downloadApi(selectedOption);

    showSuccess(`Download for ${selectedOption} completed successfully.`);
  } catch (err: any) {
    console.error(err);
    showError(err?.message || "Download failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = () => {
    if (mode === "upload") {
      handleUploadClick();
    } else {
      handleDownloadClick();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Job Data Tool
        </h1>

        {/* ✅ Tailwind alert box */}
        {alertMessage && alertType && (
          <div
            className={`mb-4 rounded-md border px-4 py-3 text-sm flex justify-between gap-3 ${
              alertType === "success"
                ? "border-green-300 bg-green-50 text-green-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            <p className="whitespace-pre-line">{alertMessage}</p>
            <button
              type="button"
              className="ml-2 text-xs font-semibold"
              onClick={() => setAlertMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="data-type"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Select Type
          </label>
          <select
            id="data-type"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Radio buttons */}
        <div className="mb-4">
          <span className="block mb-1 text-sm font-medium text-gray-700">
            Mode
          </span>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="mode"
                value="upload"
                checked={mode === "upload"}
                onChange={() => setMode("upload")}
                className="h-4 w-4"
              />
              <span>Upload</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="mode"
                value="download"
                checked={mode === "download"}
                onChange={() => setMode("download")}
                className="h-4 w-4"
              />
              <span>Download</span>
            </label>
          </div>
        </div>

        {/* Hidden file input for upload */}
        <input
          type="file"
          id="file-upload"
          ref={fileInputRef}
          className="hidden"
          aria-label="Upload file for selected type"
          onChange={handleFileChange}
        />

        {/* Action button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-2 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Processing..."
            : mode === "upload"
            ? "Upload File"
            : "Download File"}
        </button>
      </div>
    </div>
  );
}

export default App;
