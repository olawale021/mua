"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}

const TIPS = [
  "Use natural lighting for best results",
  "Face the camera directly",
  "Remove glasses if possible",
  "Keep your face centered in the guide",
];

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const confirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const dataUrl = await blobToDataUrl(file);
      setCapturedImage(dataUrl);
    },
    []
  );

  const handleCameraError = useCallback(() => {
    setCameraError(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Viewfinder */}
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-editorial">
        {capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="h-full w-full object-cover"
          />
        ) : cameraError ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush/50">
              <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Camera access unavailable
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-all hover:shadow-editorial hover:-translate-y-0.5"
            >
              Upload Photo
            </button>
          </div>
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              videoConstraints={{
                facingMode: "user",
                width: { ideal: 720 },
                height: { ideal: 720 },
                aspectRatio: 1,
              }}
              onUserMedia={() => setCameraReady(true)}
              onUserMediaError={handleCameraError}
              mirrored
              className="h-full w-full object-cover"
            />
            {/* Face guide overlay */}
            {cameraReady && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-60 w-60 rounded-full border border-dashed border-white/25" />
                {/* Corner marks */}
                <div className="absolute top-6 left-6 h-6 w-6 border-l-2 border-t-2 border-white/30 rounded-tl-md" />
                <div className="absolute top-6 right-6 h-6 w-6 border-r-2 border-t-2 border-white/30 rounded-tr-md" />
                <div className="absolute bottom-6 left-6 h-6 w-6 border-l-2 border-b-2 border-white/30 rounded-bl-md" />
                <div className="absolute bottom-6 right-6 h-6 w-6 border-r-2 border-b-2 border-white/30 rounded-br-md" />
              </div>
            )}
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="label-caps text-muted-foreground">
                  Starting camera...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tip text */}
      {!capturedImage && (
        <p className="h-5 text-center text-sm text-muted-foreground transition-all duration-500">
          {TIPS[tipIndex]}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {capturedImage ? (
          <>
            <button
              onClick={retake}
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-all hover:shadow-editorial hover:-translate-y-0.5"
            >
              Retake
            </button>
            <button
              onClick={confirm}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-editorial transition-all hover:shadow-editorial-hover hover:-translate-y-0.5"
            >
              Analyze My Skin
            </button>
          </>
        ) : (
          <>
            {!cameraError && cameraReady && (
              <button
                onClick={capture}
                className="relative flex h-18 w-18 items-center justify-center rounded-full bg-primary shadow-editorial animate-pulse-glow transition-transform hover:scale-105"
              >
                <span className="sr-only">Capture</span>
                <div className="h-6 w-6 rounded-full bg-primary-foreground" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Upload fallback */}
      {!capturedImage && (
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="label-caps text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Or upload a photo
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        capture="user"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
