import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const API_URL = "http://localhost:5000/api/sos";
const COUNTDOWN_SECONDS = 5;

const getLocalContact = () => {
  try {
    return JSON.parse(localStorage.getItem("safeRouteTrustedContact")) || null;
  } catch {
    return null;
  }
};

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

function SosButton() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [event, setEvent] = useState(null);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [recordingMode, setRecordingMode] = useState("audio");
  const [recordingState, setRecordingState] = useState("idle");
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [recordingPreviewUrl, setRecordingPreviewUrl] = useState("");
  const [recordingMessage, setRecordingMessage] = useState("");
  const mediaRecorderRef = useRef(null);
  const recordingStreamRef = useRef(null);

  const loadHistory = useCallback(async () => {
    try {
      const response = await axios.get(API_URL, getHeaders(token));
      setHistory(response.data.events || []);
    } catch {
      setError("SOS history is unavailable right now.");
    }
  }, [token]);

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStage("error");
      setError("Location capture is not supported by this browser. SOS was not activated.");
      return;
    }

    setStage("locating");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await axios.post(
            API_URL,
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              emergencyType: "general",
            },
            getHeaders(token)
          );
          setEvent(response.data.sos);
          setTrustedContacts(response.data.trustedContacts || []);
          setStage("active");
          setActionMessage(response.data.message);
          await loadHistory();
        } catch (requestError) {
          setStage("error");
          setError(requestError.response?.data?.message || requestError.message || "Unable to create the SOS event. Check your connection and try again.");
        }
      },
      (locationError) => {
        setStage("error");
        setError(
          locationError.code === 1
            ? "Location permission was denied. SOS was not activated."
            : "Unable to capture your current location. SOS was not activated."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [loadHistory, token]);

  useEffect(() => {
    if (stage !== "countdown") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (countdown === 0) {
        captureLocation();
      } else {
        setCountdown((current) => current - 1);
      }
    }, countdown === 0 ? 0 : 1000);
    return () => window.clearTimeout(timer);
  }, [stage, countdown, captureLocation]);

  const openSos = () => {
    setIsOpen(true);
    loadHistory();
  };

  const beginActivation = () => {
    if (!window.confirm("Activate Smart SOS? Your location will be recorded and shared through available actions.")) {
      return;
    }

    setError("");
    setActionMessage("");
    setCountdown(COUNTDOWN_SECONDS);
    setStage("countdown");
  };

  const cancelCountdown = () => {
    setStage("idle");
    setCountdown(COUNTDOWN_SECONDS);
    setActionMessage("SOS activation cancelled.");
  };

  const cancelActiveSos = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/${event._id}/cancel`,
        {},
        getHeaders(token)
      );
      setEvent(response.data.sos);
      setStage("completed");
      setActionMessage("SOS marked as cancelled.");
      await loadHistory();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to cancel the active SOS.");
    }
  };

  const completeSos = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/${event._id}/complete`,
        {},
        getHeaders(token)
      );
      setEvent(response.data.sos);
      setStage("completed");
      setActionMessage("SOS marked as completed.");
      await loadHistory();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete the SOS.");
    }
  };

  const stopRecordingTracks = () => {
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
  };

  const startRecording = async () => {
    setRecordingMessage("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setRecordingState("unsupported");
      setRecordingMessage("Recording is not supported on this browser/device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        recordingMode === "video"
          ? { audio: true, video: true }
          : { audio: true }
      );
      const mimeCandidates = recordingMode === "video"
        ? ["video/webm;codecs=vp8,opus", "video/webm"]
        : ["audio/webm;codecs=opus", "audio/webm"];
      const mimeType = mimeCandidates
        .find((candidate) => MediaRecorder.isTypeSupported(candidate));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks = [];

      recordingStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || mimeType });
        setRecordingBlob(blob);
        setRecordingPreviewUrl(URL.createObjectURL(blob));
        setRecordingState("preview");
        stopRecordingTracks();
      };
      recorder.start();
      setRecordingState("recording");
      setRecordingMessage(`Recording ${recordingMode} evidence. Press stop when finished.`);
    } catch (permissionError) {
      stopRecordingTracks();
      setRecordingState("denied");
      setRecordingMessage(
        permissionError.name === "NotAllowedError"
          ? "Camera/microphone permission was denied. SOS remains active without recording."
          : "Unable to start recording. SOS remains active without recording."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadRecording = async () => {
    if (!recordingBlob || !event) {
      return;
    }

    try {
      setRecordingState("uploading");
      const formData = new FormData();
      formData.append("kind", recordingMode);
      formData.append("recording", recordingBlob, `${recordingMode}-evidence.webm`);
      await axios.post(`${API_URL}/${event._id}/recordings`, formData, getHeaders(token));
      setRecordingState("uploaded");
      setRecordingMessage("Recording stored privately with this SOS event.");
    } catch (uploadError) {
      setRecordingState("preview");
      setRecordingMessage(uploadError.response?.data?.message || "Unable to store recording.");
    }
  };

  useEffect(() => () => {
    stopRecordingTracks();
    if (recordingPreviewUrl) {
      URL.revokeObjectURL(recordingPreviewUrl);
    }
  }, [recordingPreviewUrl]);

  const shareLocation = async () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
    const shareData = {
      title: "SafeRoute AI emergency location",
      text: "I may need help. This is my current SafeRoute AI location.",
      url: mapsUrl,
    };

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
        setActionMessage("Native sharing was opened. Check the recipient before sending.");
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} ${mapsUrl}`);
        setActionMessage("Location link copied. Send it through a channel you trust.");
        return;
      }

      window.open(mapsUrl, "_blank", "noopener,noreferrer");
      setActionMessage("Native sharing is unavailable. A map link was opened instead.");
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        setActionMessage("Sharing was unavailable. Open the map link and share it manually.");
      }
    }
  };

  const callContact = () => {
    const contact = trustedContacts[0] || getLocalContact();
    if (!contact?.phone) {
      setActionMessage("No trusted contact phone number is configured.");
      return;
    }

    window.location.href = `tel:${contact.phone}`;
    setActionMessage("Your device was asked to start the call. SafeRoute AI cannot confirm call completion.");
  };

  const close = () => {
    if (stage === "active" || stage === "locating" || recordingState === "recording" || recordingState === "uploading") {
      return;
    }
    setIsOpen(false);
    setStage("idle");
    setError("");
  };

  return (
    <>
      <button
        type="button"
        onClick={openSos}
        className="rounded-full bg-red-600 px-5 py-3 font-black text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
      >
        SOS
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-4">
          <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="sos-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Emergency response</p>
                <h2 id="sos-title" className="mt-2 text-3xl font-black text-slate-900">Smart SOS</h2>
              </div>
              <button type="button" onClick={close} disabled={stage === "active" || stage === "locating"} className="text-2xl font-bold text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed" aria-label="Close SOS">×</button>
            </div>

            {stage === "idle" && (
              <div className="mt-6">
                <p className="text-slate-600">Your current location will be captured only after confirmation and a short cancellation window.</p>
                <button type="button" onClick={beginActivation} className="mt-6 w-full rounded-2xl bg-red-600 px-5 py-4 text-lg font-black text-white hover:bg-red-700">Activate SOS</button>
                <button type="button" onClick={() => { loadHistory(); setStage("history"); }} className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50">View SOS history</button>
              </div>
            )}

            {stage === "countdown" && (
              <div className="mt-6 text-center">
                <p className="text-slate-600">SOS activates in</p>
                <p className="my-4 text-7xl font-black text-red-600">{countdown}</p>
                <button type="button" onClick={cancelCountdown} className="w-full rounded-2xl border-2 border-slate-300 px-5 py-4 font-black text-slate-800 hover:bg-slate-50">Cancel activation</button>
              </div>
            )}

            {stage === "locating" && <p className="mt-6 rounded-2xl bg-amber-50 p-4 font-bold text-amber-800">Capturing your current location...</p>}

            {(stage === "active" || stage === "completed") && event && (
              <div className="mt-6 space-y-4">
                <div className={`rounded-2xl p-4 ${stage === "active" ? "bg-red-50 text-red-900" : "bg-emerald-50 text-emerald-900"}`}>
                  <p className="font-black">SOS {event.status}</p>
                  <p className="mt-1 text-sm">Location recorded at {new Date(event.timestamp).toLocaleString()}.</p>
                  <p className="mt-1 text-xs">{event.latitude.toFixed(5)}, {event.longitude.toFixed(5)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={callContact} className="rounded-xl bg-[#f3b562] px-4 py-3 font-black text-[#102a2b]">Call trusted contact</button>
                  <button type="button" onClick={shareLocation} className="rounded-xl bg-[#102a2b] px-4 py-3 font-black text-white">Share current location</button>
                </div>
                {stage === "active" && <button type="button" onClick={cancelActiveSos} className="w-full rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700">Cancel active SOS</button>}
                {stage === "active" && <button type="button" onClick={completeSos} className="w-full rounded-xl border border-emerald-300 px-4 py-3 font-bold text-emerald-700">Mark SOS completed</button>}
                {stage === "active" && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-black text-slate-900">Optional emergency evidence</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Permission is requested only when you start recording. Recordings are stored privately with this SOS event.</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => setRecordingMode("audio")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${recordingMode === "audio" ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}>Audio</button>
                      <button type="button" onClick={() => setRecordingMode("video")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${recordingMode === "video" ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}>Video</button>
                    </div>
                    {recordingState === "recording" ? (
                      <button type="button" onClick={stopRecording} className="mt-3 w-full rounded-lg bg-red-600 px-3 py-3 font-black text-white">Stop recording</button>
                    ) : (
                      <button type="button" onClick={startRecording} disabled={recordingState === "uploading"} className="mt-3 w-full rounded-lg bg-[#4c8b47] px-3 py-3 font-black text-white disabled:opacity-50">Record {recordingMode} evidence</button>
                    )}
                    {recordingPreviewUrl && (
                      <div className="mt-3">
                        {recordingMode === "video" ? <video controls src={recordingPreviewUrl} className="w-full rounded-lg" /> : <audio controls src={recordingPreviewUrl} className="w-full" />}
                        {recordingState === "preview" && <button type="button" onClick={uploadRecording} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 font-bold text-slate-700">Save recording to SOS</button>}
                      </div>
                    )}
                    {recordingMessage && <p className="mt-3 text-xs font-semibold text-slate-600">{recordingMessage}</p>}
                  </div>
                )}
                <p className="text-sm text-slate-600">{actionMessage}</p>
              </div>
            )}

            {stage === "history" && (
              <div className="mt-6">
                <h3 className="font-black text-slate-900">SOS history</h3>
                {history.length === 0 ? <p className="mt-3 text-sm text-slate-500">No SOS events recorded.</p> : <div className="mt-3 space-y-2">{history.map((item) => <div key={item._id} className="rounded-xl bg-slate-50 p-3 text-sm"><span className="font-black uppercase">{item.status}</span><span className="ml-2 text-slate-500">{new Date(item.timestamp).toLocaleString()}</span></div>)}</div>}
                <button type="button" onClick={() => setStage("idle")} className="mt-5 font-bold text-[#315524]">Back to SOS</button>
              </div>
            )}

            {(stage === "error" || error) && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
          </section>
        </div>
      )}
    </>
  );
}

export default SosButton;
