import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image, Upload, Zap, Sparkles, RefreshCw, X, ChevronRight, Compass } from 'lucide-react';
import { Sneaker, formatIDR } from '../types';

interface VisualSearchViewProps {
  sneakers: Sneaker[];
  setSelectedSneaker: (sneaker: Sneaker) => void;
}

export const VisualSearchView: React.FC<VisualSearchViewProps> = ({
  sneakers,
  setSelectedSneaker
}) => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerProgress, setScannerProgress] = useState(0);
  const [isMatched, setIsMatched] = useState<Sneaker | null>(null);
  const [unidentified, setUnidentified] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean streams on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelected(e.target.files[0]);
    }
  };

  const selectPrecompiledSample = (modelId: string) => {
    const sneaker = sneakers.find(s => s.id === modelId) || sneakers[0];
    setUploadPreview(sneaker.image);
    startScanning(sneaker);
  };

  const handleImageSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
      
      // Smart random matching algorithm
      const matchingShoe = sneakers[Math.floor(Math.random() * sneakers.length)];
      startScanning(matchingShoe);
    };
    reader.readAsDataURL(file);
  };

  const startWebcam = async () => {
    setIsWebcamOpen(true);
    setUploadPreview(null);
    setUnidentified(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Webcam blocked or unavailable. Falling back to high-key camera simulator.", err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamOpen(false);
  };

  const capturePhotoSnapshot = () => {
    setIsScanning(true);
    setScannerProgress(0);
    stopWebcam();

    // High quality simulation
    const simulatedMatch = sneakers[Math.floor(Math.random() * sneakers.length)];
    setUploadPreview(simulatedMatch.image);
    startScanning(simulatedMatch);
  };

  const startScanning = (targetSneaker: Sneaker) => {
    setIsScanning(true);
    setScannerProgress(0);

    const interval = setInterval(() => {
      setScannerProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            if (Math.random() > 0.15) {
              setIsMatched(targetSneaker);
            } else {
              setUnidentified(true);
            }
          }, 450);
          return 100;
        }
        return prev + 8;
      });
    }, 120);
  };

  const closeScannerModal = () => {
    setIsMatched(null);
    setUnidentified(false);
    setUploadPreview(null);
    setScannerProgress(0);
  };

  const selectMatchedSneaker = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    navigate(`/shop/${sneaker.id}`);
  };

  return (
    <div className="flex flex-col gap-10 pb-16 relative">
      
      {/* Search scanning result overlay modal */}
      <AnimatePresence>
        {(isMatched || unidentified) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-action-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 text-left font-sans"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-action-dark p-6 md:p-8 max-w-md w-full relative"
            >
              <button 
                onClick={closeScannerModal}
                className="absolute top-4 right-4 p-1 rounded-sm text-text-muted hover:text-action-dark"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              {isMatched ? (
                <div>
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold uppercase py-1 px-2.5 rounded-none font-display tracking-widest mb-4">
                    ✓ CORE MATCHER ACQUIRED (98% MATCH)
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-1 text-action-dark">
                    CORE SYSTEM IDENTIFIED
                  </h3>
                  <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold">
                    We matched this thread to our active drop catalog.
                  </p>

                  <div className="bg-brand-bg/60 border-2 border-action-dark p-4 my-5 flex gap-4 items-center">
                    <img 
                      src={isMatched.image} 
                      alt={isMatched.name} 
                      className="w-16 h-16 object-contain filter drop-shadow-md" 
                    />
                    <div>
                      <span className="font-display text-xs font-extrabold uppercase text-text-muted block">CATALOG RECRUIT:</span>
                      <span className="font-display text-lg font-black uppercase text-action-dark block leading-tight">
                        {isMatched.name}
                      </span>
                      <span className="font-display text-sm font-extrabold text-accent-red block mt-0.5">
                        {formatIDR(isMatched.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <button
                      onClick={() => selectMatchedSneaker(isMatched!)}
                      className="w-full bg-action-dark hover:bg-accent-red text-white py-3.5 font-display text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>GO LOCK DETAILS</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    
                    <button
                      onClick={closeScannerModal}
                      className="w-full bg-surface hover:bg-brand-bg text-action-dark border border-black/15 py-3.5 font-display text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      SCAN ANOTHER PAIR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-red-100 text-accent-red flex items-center justify-center rounded-full text-xl font-bold mx-auto mb-4">
                    !
                  </div>

                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-action-dark mb-2">
                    CORES UNIDENTIFIED
                  </h3>
                  <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold leading-relaxed max-w-xs mx-auto mb-5">
                    We could not find matching geometrics in the active drops database. This may be a rare size or custom archive.
                  </p>

                  <button
                    onClick={closeScannerModal}
                    className="w-full bg-action-dark hover:bg-accent-red text-white py-3.5 font-display text-xs font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer"
                  >
                    DISMISS SCANNER TRIGGER
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Header */}
      <div className="flex flex-col gap-1.5 text-left">
        <h1 className="font-display text-5xl md:text-[64px] font-black text-action-dark uppercase tracking-tighter leading-none mb-1">
          SEARCH <br className="md:hidden" /> YOUR HOOPS
        </h1>
        <p className="font-sans text-xs md:text-sm text-text-muted max-w-lg leading-relaxed font-semibold uppercase tracking-wide">
          Upload a pic or scan your current pair to find drops, restocks, and rare sizes. Seamless scanner mapping.
        </p>
      </div>

      {/* Main Drag-drop visual search area */}
      <section 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full bg-white border-2 p-8 md:p-14 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden min-h-[400px] transition-all duration-300 rounded-none shadow-sm ${
          dragActive 
            ? 'border-accent-red bg-accent-red/5' 
            : 'border-action-dark hover:border-accent-red'
        }`}
      >
        {/* Decorative Top Accent line */}
        <div className="absolute top-0 left-0 w-full h-[5px] bg-action-dark"></div>

        {/* Laser Scanner Overlay Active state during scan */}
        {isScanning && (
          <div className="absolute inset-0 z-20 pointer-events-none select-none flex flex-col justify-between">
            {/* Pulsing overlay cover */}
            <div className="absolute inset-0 bg-accent-red/5 animate-pulse z-0" />
            
            {/* Sliding bright scan line */}
            <motion.div 
              animate={{ y: [0, 390, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="w-full h-1 bg-accent-red relative z-10 shadow-[0_0_12px_#ff0a0a]"
            />
          </div>
        )}

        {isWebcamOpen ? (
          /* Webcam view overlay container */
          <div className="w-full max-w-md bg-action-dark relative flex flex-col items-center border-4 border-action-dark">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              className="w-full h-[320px] object-cover scale-x-[-1]"
            />
            {/* Interactive camera alignment reticle */}
            <div className="absolute inset-x-12 inset-y-12 border-2 border-dashed border-accent-red/60 pointer-events-none flex items-center justify-center">
              <div className="w-8 h-8 border-t-4 border-l-4 border-accent-red absolute top-0 left-0" />
              <div className="w-8 h-8 border-t-4 border-r-4 border-accent-red absolute top-0 right-0" />
              <div className="w-8 h-8 border-b-4 border-l-4 border-accent-red absolute bottom-0 left-0" />
              <div className="w-8 h-8 border-b-4 border-r-4 border-accent-red absolute bottom-0 right-0" />
              <span className="text-[10px] text-accent-red font-display tracking-widest font-black uppercase">RETICLE LOCKED</span>
            </div>

            <div className="w-full bg-action-dark py-4 px-4 flex justify-between items-center z-10">
              <button 
                onClick={stopWebcam}
                className="text-white/60 hover:text-white font-display text-[10px] font-bold uppercase tracking-widest"
              >
                CANCEL
              </button>
              
              <button
                onClick={capturePhotoSnapshot}
                className="bg-accent-red hover:bg-red-700 text-white font-display text-xs font-bold uppercase tracking-widest py-2 px-6 rounded-none flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                SNAP CORE
              </button>

              <div className="w-12"></div>
            </div>
          </div>
        ) : isScanning ? (
          /* SCANNING PROGRESS UI */
          <div className="flex flex-col items-center gap-4 z-10 select-none">
            {uploadPreview && (
              <div className="w-32 h-32 bg-surface-container border border-action-dark/15 p-2 mb-2 flex items-center justify-center">
                <img src={uploadPreview} alt="upload preview" className="w-full h-full object-contain filter contrast-102" />
              </div>
            )}
            
            <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full animate-spin">
              <RefreshCw className="w-6 h-6 text-accent-red stroke-[2.5]" />
            </div>

            <h3 className="font-display text-xl font-black uppercase text-action-dark tracking-wide">
              MAPPING SYSTEM TARGET
            </h3>
            <p className="font-display font-bold text-xs text-text-muted tracking-widest uppercase">
              SCANNING MODEL GEOGRAM... {scannerProgress}%
            </p>

            <div className="w-56 h-1 bg-surface-container relative overflow-hidden mt-1">
              <div 
                className="h-full bg-accent-red transition-all duration-150" 
                style={{ width: `${scannerProgress}%` }}
              />
            </div>
          </div>
        ) : (
          /* DEFAULT STATE - FILE UPLOADS */
          <div className="flex flex-col items-center gap-2 py-4 z-10 w-full max-w-sm">
            
            {/* Top Interactive Upload Badge */}
            <div className="w-20 h-20 rounded-full bg-brand-bg hover:scale-105 hover:bg-surface-container transition-all flex items-center justify-center mb-2 border border-action-dark/5">
              <Upload className="w-8 h-8 text-action-dark stroke-[2.5]" />
            </div>

            <h2 className="font-display text-2xl font-black text-action-dark uppercase tracking-tight">
              DROP SNEAKER PHOTO HERE
            </h2>
            <p className="font-sans text-xs text-text-muted tracking-wide font-semibold uppercase">
              Supported formats: JPG, PNG, WEBP. Max size 5MB.
            </p>

            {/* Separator block */}
            <div className="flex items-center w-full gap-4 my-2 select-none">
              <div className="h-px bg-action-dark/10 grow"></div>
              <span className="font-display text-xs font-bold text-text-muted uppercase">Or select image</span>
              <div className="h-px bg-action-dark/10 grow"></div>
            </div>

            {/* Hidden Input File */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Grid button actions row */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white hover:bg-brand-bg text-action-dark border-2 border-action-dark font-display text-xs font-bold uppercase py-3 px-5 tracking-widest duration-300 rounded-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <Image className="w-4 h-4 stroke-[2.5]" />
                SELECT FILE
              </button>

              <button
                onClick={startWebcam}
                className="flex-1 bg-action-dark hover:bg-accent-red text-white font-display text-xs font-bold uppercase py-3 px-5 tracking-widest duration-300 rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                ACCESS CAMERA
              </button>
            </div>

            {/* Tester quick match shortcuts */}
            <div className="mt-6 flex flex-col items-center text-center w-full">
              <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-2 block">
                🛠️ ANALYSER CORES IN PRACTICE PRESETS:
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                <button 
                  onClick={() => selectPrecompiledSample('air-flight-x')}
                  className="font-display text-[9px] font-extrabold bg-surface-container py-1 px-2 hover:bg-action-dark hover:text-white transition-colors uppercase border border-action-dark/15 rounded-sm"
                >
                  RED SPOTLIGHT
                </button>
                <button 
                  onClick={() => selectPrecompiledSample('court-vision-low')}
                  className="font-display text-[9px] font-extrabold bg-surface-container py-1 px-2 hover:bg-action-dark hover:text-white transition-colors uppercase border border-action-dark/15 rounded-sm"
                >
                  PANDA LOW
                </button>
                <button 
                  onClick={() => selectPrecompiledSample('court-vision-green')}
                  className="font-display text-[9px] font-extrabold bg-surface-container py-1 px-2 hover:bg-action-dark hover:text-white transition-colors uppercase border border-action-dark/15 rounded-sm"
                >
                  GREEN GLIDE
                </button>
              </div>
            </div>

          </div>
        )}
      </section>



    </div>
  );
};
