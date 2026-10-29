import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  SwitchCamera,
} from 'lucide-react';
import { SAMPLE_CASES } from '../data/samplePlants';
import { PlantDiagnosis } from '../types/plant';

interface ScannerProps {
  onDiagnosisComplete: (diagnosis: PlantDiagnosis) => void;
  presetPlantName?: string;
  onClearPreset?: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  onDiagnosisComplete,
  presetPlantName = '',
  onClearPreset,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [plantContextName, setPlantContextName] = useState<string>(presetPlantName);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scanSteps = [
    'Calibrating leaf morphology and cuticle texture...',
    'Inspecting pigmentation, chlorosis, and vein patterning...',
    'Scanning for fungal pustules, bacterial spots, and pest stippling...',
    'Formulating personalized 14-day care and recovery protocol...',
  ];

  // Sync preset plant name if passed from MyGarden
  useEffect(() => {
    if (presetPlantName) {
      setPlantContextName(presetPlantName);
    }
  }, [presetPlantName]);

  // Handle camera start/stop
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (activeMode === 'camera' && !selectedImage) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }
          setIsCameraActive(true);
          setErrorMessage(null);
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable:', err);
          setIsCameraActive(false);
          setErrorMessage('Camera access is not permitted or unsupported on this device. You can upload an image directly.');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeMode, facingMode, selectedImage]);

  // Step ticker during scanning
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev + 1) % scanSteps.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedImage(dataUrl);
      setImageMimeType('image/jpeg');
      setErrorMessage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      setImageMimeType(file.type || 'image/jpeg');
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_CASES[0]) => {
    // If it's one of our pre-built samples, set the image and trigger instant diagnosis
    setSelectedImage(sample.image);
    setPlantContextName(sample.plantName);
    setErrorMessage(null);
    setIsScanning(true);
    setScanStepIndex(0);

    // Provide immediate realistic diagnostic results with short animation
    setTimeout(() => {
      setIsScanning(false);
      onDiagnosisComplete(sample.diagnosis);
    }, 1800);
  };

  const executeLiveDiagnosis = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanStepIndex(0);
    setErrorMessage(null);

    // Check if this selected image matches a sample image
    const matchingSample = SAMPLE_CASES.find((s) => s.image === selectedImage);

    try {
      const response = await fetch('/api/plant/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          mimeType: imageMimeType,
          plantName: plantContextName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const diagnosisData: PlantDiagnosis = await response.json();

      // Check if image wasn't recognized as a plant
      if (diagnosisData.plantIdentification && !diagnosisData.plantIdentification.isPlantLeaf) {
        setErrorMessage(
          'Our AI could not recognize a plant or leaf in this photo. Please retake or upload a clear, focused image of a leaf blade.'
        );
        setIsScanning(false);
        return;
      }

      setIsScanning(false);
      onDiagnosisComplete(diagnosisData);
    } catch (err: any) {
      console.warn('API call encountered an issue, falling back to client sample diagnosis if matched:', err);

      // Graceful fallback to verified sample if available
      if (matchingSample) {
        setTimeout(() => {
          setIsScanning(false);
          onDiagnosisComplete(matchingSample.diagnosis);
        }, 1200);
      } else {
        setIsScanning(false);
        setErrorMessage(
          err.message || 'Diagnosis failed. Please check network connectivity and try again.'
        );
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Editorial Title & Scope */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900" style={{ textWrap: 'balance' }}>
          Scan plant leaves for instant disease diagnostics & care
        </h1>
        <p className="mt-2.5 text-base text-stone-600">
          Point your camera at an affected leaf or upload a photo. PhytoScan pinpoints pathogens, assesses damage severity, and provides recovery protocols.
        </p>

        {presetPlantName && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-md border border-emerald-200">
            <span>Tracking: <strong>{presetPlantName}</strong></span>
            {onClearPreset && (
              <button
                onClick={onClearPreset}
                className="text-emerald-700 hover:text-emerald-900 underline ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Scanner Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50/60 p-2 gap-2">
          <button
            onClick={() => {
              setActiveMode('upload');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>Upload or Drop Photo</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('camera');
              setSelectedImage(null);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeMode === 'camera'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Live Camera Scanner</span>
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed flex-1">
                <span className="font-semibold block mb-0.5">Notice</span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Active Image Preview OR Live Camera Viewfinder */}
          {selectedImage ? (
            <div className="relative rounded-xl overflow-hidden bg-stone-950 aspect-4/3 max-h-[460px] mx-auto border border-stone-200 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected plant leaf for analysis"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Laser Scan HUD Overlay when scanning */}
              {isScanning && (
                <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-6">
                  {/* Moving laser scan line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse top-1/2 -translate-y-1/2" />
                  
                  {/* Corner reticle guides */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400" />

                  <div className="bg-stone-900/90 text-stone-50 px-5 py-3 rounded-xl border border-stone-700 shadow-xl text-center max-w-sm">
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 mb-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>MULTIMODAL PATHOLOGY SCAN</span>
                    </div>
                    <p className="text-xs text-stone-200">
                      {scanSteps[scanStepIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons on top of preview */}
              {!isScanning && (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-2 rounded-lg bg-stone-900/80 hover:bg-stone-900 text-stone-100 text-xs flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                </div>
              )}
            </div>
          ) : activeMode === 'camera' ? (
            /* Live Camera Viewfinder */
            <div className="relative rounded-xl overflow-hidden bg-stone-950 aspect-4/3 max-h-[460px] mx-auto border border-stone-800 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Reticle */}
              <div className="absolute inset-8 border border-white/30 rounded-xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-stone-950/60 px-2 py-0.5 rounded">
                    Leaf Alignment Zone
                  </span>
                  <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {/* Controls bar over camera */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
                <button
                  onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                  className="p-3 rounded-full bg-stone-900/80 hover:bg-stone-900 text-stone-100 backdrop-blur-xs transition-colors cursor-pointer"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>

                <button
                  onClick={handleCaptureFromCamera}
                  disabled={!isCameraActive}
                  className="w-16 h-16 rounded-full border-4 border-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-lg flex items-center justify-center text-white cursor-pointer disabled:opacity-50"
                  title="Capture Photo"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>

                <div className="w-11" /> {/* Spacer for balance */}
              </div>
            </div>
          ) : (
            /* Upload Drop Area */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setSelectedImage(event.target?.result as string);
                    setImageMimeType(file.type || 'image/jpeg');
                    setErrorMessage(null);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="border-2 border-dashed border-stone-300 hover:border-emerald-700 bg-stone-50/50 hover:bg-emerald-50/20 rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-base font-semibold text-stone-900">
                Click to browse or drag and drop a leaf image
              </p>
              <p className="text-xs text-stone-500 mt-1.5 max-w-sm">
                Supports JPG, PNG, WEBP. For optimal results, ensure the leaf is in focus with natural lighting.
              </p>
            </div>
          )}

          {/* Plant Context Input & Analyze CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Plant Species / Nickname <span className="text-stone-400 font-normal">(Optional context)</span>
              </label>
              <input
                type="text"
                value={plantContextName}
                onChange={(e) => setPlantContextName(e.target.value)}
                placeholder="e.g. Heirloom Tomato, Balcony Monstera, English Rose"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent bg-stone-50/50"
              />
            </div>

            <div className="w-full sm:w-auto self-end">
              <button
                onClick={executeLiveDiagnosis}
                disabled={!selectedImage || isScanning}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-stone-50 font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Leaf...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Diagnose Health & Care</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Test Samples Strip */}
        <div className="border-t border-stone-200 bg-stone-50/80 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Quick Test Cases
              </span>
              <span className="text-xs text-stone-500 ml-2">
                Click any specimen to run an immediate diagnostic scan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_CASES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="group text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-xs transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-stone-100 mb-2">
                  <img
                    src={sample.image}
                    alt={sample.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-900/80 text-stone-100">
                    {sample.condition}
                  </div>
                </div>
                <span className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                  {sample.label}
                </span>
                <span className="text-[11px] text-stone-500 truncate">
                  {sample.plantName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Scanning Best Practices Strip */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
        <div className="p-4 rounded-xl bg-white border border-stone-200">
          <span className="font-semibold text-stone-900 block mb-1">1. Good Diffused Light</span>
          Capture leaves in clear daylight. Avoid harsh shadows or camera flash reflections that obscure fungal spore colonies.
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200">
          <span className="font-semibold text-stone-900 block mb-1">2. Target Active Margins</span>
          Frame the boundary where diseased lesions meet healthy green tissue. Concentric rings and halos are critical for fungal identification.
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200">
          <span className="font-semibold text-stone-900 block mb-1">3. Check Both Surfaces</span>
          Turn the leaf over if possible; powdery mildew, rust pustules, and spider mites often begin on the underside (abaxial) surface.
        </div>
      </div>
    </div>
  );
};
