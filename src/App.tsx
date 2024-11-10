import React from "react";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { Controls } from "./components/Controls";
import { History } from "./components/History";
import { useDrawingStore } from "./store/useDrawingStore";
import { Send } from "lucide-react";
import html2canvas from "html2canvas";

function App() {
  const [result, setResult] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const { addToHistory, selectedHistoryItem, setSelectedHistoryItem } =
    useDrawingStore();

  const handleSubmit = async () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    setLoading(true);
    try {
      // Use html2canvas to capture the screenshot of the canvas
      const screenshotCanvas = await html2canvas(canvas);

      // Convert the screenshot canvas to a data URL
      const imageData = screenshotCanvas.toDataURL("image/png");

      // Convert the data URL to a File object
      const formData = new FormData();
      formData.append("image", dataURLtoFile(imageData, "canvas_image.png"));

      // Send the screenshot image to the backend
      const response = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const geminiAnswer = data.answer; // Get the answer from the backend

      setResult(geminiAnswer);
      setSelectedHistoryItem(null);
      addToHistory({
        image: imageData,
        question: "What's this calculation?",
        answer: geminiAnswer,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error processing image:", error);
      setResult("Error processing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert base64 dataURL to a File object
  const dataURLtoFile = (dataURL: string, filename: string) => {
    const arr = dataURL.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Function to download the image
  const downloadImage = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    // Capture the screenshot of the canvas element
    html2canvas(canvas).then((screenshotCanvas) => {
      // Convert the screenshot canvas to a data URL
      const imageData = screenshotCanvas.toDataURL("image/jpeg");

      // Create a download link and trigger a click to download the image
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "canvas_image.jpeg";
      link.click();
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Controls />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <DrawingCanvas />

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Send size={20} />
                {loading ? "Processing..." : "Calculate"}
              </button>

              {/* Add the Download Image button here */}
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Download Image
              </button>
            </div>

            {(result || selectedHistoryItem) && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Result:</h3>
                <p className="text-gray-700">
                  {selectedHistoryItem?.answer || result}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <History />
    </div>
  );
}

export default App;
