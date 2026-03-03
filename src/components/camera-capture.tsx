"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

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
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border-2 border-border bg-muted">
        {capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="h-full w-full object-cover"
          />
        ) : cameraError ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="text-4xl">📷</div>
            <p className="text-sm text-muted-foreground">
              Camera access unavailable. Upload a photo instead.
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Photo
            </Button>
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
            {cameraReady && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full border-2 border-dashed border-white/40" />
              </div>
            )}
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm text-muted-foreground">
                  Starting camera...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!capturedImage && (
        <p className="text-center text-sm text-muted-foreground">
          {TIPS[tipIndex]}
        </p>
      )}

      <div className="flex gap-3">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={retake}>
              Retake
            </Button>
            <Button onClick={confirm} className="shadow-lg shadow-primary/25">
              Analyze My Skin
            </Button>
          </>
        ) : (
          <>
            {!cameraError && cameraReady && (
              <Button
                size="lg"
                onClick={capture}
                className="h-16 w-16 rounded-full animate-pulse-glow shadow-lg shadow-primary/25"
              >
                <span className="sr-only">Capture</span>
                <div className="h-6 w-6 rounded-full bg-primary-foreground" />
              </Button>
            )}
          </>
        )}
      </div>

      {!capturedImage && (
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
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
