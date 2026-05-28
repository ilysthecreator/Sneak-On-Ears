import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Camera, Upload, RefreshCw, Star, Zap, AlertCircle, ArrowRight, ChevronRight, Focus } from 'lucide-react';
import { Product } from '../types';
import { SHOES_DATA } from '../data';

interface SearchViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToPage: (page: 'splash' | 'login' | 'home' | 'detail' | 'search' | 'cart' | 'profile') => void;
}

export default function SearchView({ onSelectProduct, onNavigateToPage }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Product | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items in real time
  const searchResults = SHOES_DATA.filter((shoe) =>
    shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shoe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shoe.specs.cushioning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScannedImage(event.target?.result as string);
        runSimulatedAiScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleShoeSearch = (shoe: Product) => {
    setScannedImage(shoe.image);
    runSimulatedAiScan(shoe);
  };

  const runSimulatedAiScan = (targetShoe?: Product) => {
    setIsScanning(true);
    setScanResult(null);

    // Pick a shoe model to match dynamically
    const matchedShoe = targetShoe || SHOES_DATA[Math.floor(Math.random() * SHOES_DATA.length)];

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(matchedShoe);
    }, 2500);
  };

  const resetScan = () => {
    setScannedImage(null);
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="w-full pb-24 bg-[#E5E5E5] text-[#111111] min-h-screen relative noise-overlay font-sans">
      
      {/* Title Header Banner inside max-width container */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-b border-black pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#666666] font-bold">
            INTELLIGENT HARDCOURT SEARCH ENGINE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase leading-none mt-1">
            SEARCH & VISION LENS FINDER
          </h1>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left column (Visual scan AI tool): spanning 5 columns on desktop */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_#8B0000]">
            <h3 className="font-display text-sm font-black uppercase tracking-wide border-b border-dashed border-stone-200 pb-2.5 mb-4 flex items-center gap-2">
              <Camera className="w-4.5 h-4.5 text-[#8B0000]" />
              <span>SNEAK VISION: AI PHOTO ENGINE</span>
            </h3>

            {!scannedImage ? (
              <div className="border-2 border-dashed border-stone-300 p-6 flex flex-col items-center justify-center text-center bg-stone-50 min-h-[220px]">
                <Upload className="w-10 h-10 text-[#8B0000] stroke-[1.5] mb-2.5" />
                <p className="font-sans text-xs text-stone-700 font-bold uppercase tracking-tight">DROP COURT PHOTOS OR CAPTURE</p>
                <p className="font-mono text-[9px] text-stone-400 mt-1 max-w-[240px] leading-relaxed">
                  Upload basketball shoes patterns or instant snap your friends kicks to extract material specifications and purchase options in our catalog.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUploaded}
                  accept="image/*"
                  className="hidden"
                />

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={triggerUpload}
                    className="bg-black text-white font-mono text-[10px] font-bold tracking-tight px-4 py-2 hover:bg-stone-900 transition-colors cursor-pointer border border-black"
                  >
                    UPLOAD PATTERN
                  </button>
                  <button
                    onClick={() => runSimulatedAiScan()}
                    className="bg-white text-black font-mono text-[10px] font-bold tracking-tight px-4 py-2 hover:bg-stone-100 transition-colors border border-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    SIMULATE LENS
                  </button>
                </div>

                {/* Sample Quick select */}
                <div className="mt-6 w-full pt-4 border-t border-stone-100">
                  <span className="block font-mono text-[8px] text-stone-400 uppercase tracking-wider mb-2 font-bold">Or click on samples below:</span>
                  <div className="flex justify-center gap-3">
                    {SHOES_DATA.slice(0, 4).map((shoe) => (
                      <button
                        key={shoe.id}
                        onClick={() => handleSampleShoeSearch(shoe)}
                        className="w-11 h-11 border border-stone-300 bg-white hover:border-black flex items-center justify-center p-1 select-none cursor-pointer hover:shadow-sm"
                        title={shoe.name}
                      >
                        <img src={shoe.image} alt="Sample shoe key" className="max-h-9 object-contain mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview & Scanner line Overlay */}
                <div className="relative w-full h-56 bg-stone-50 border border-black flex items-center justify-center overflow-hidden">
                  <img
                    src={scannedImage}
                    alt="Scanned Target preview"
                    className="max-h-48 object-contain mix-blend-multiply drop-shadow-md"
                  />

                  {/* Animated Scanner Laser overlay */}
                  {isScanning && (
                    <motion.div
                      animate={{ y: [0, 224, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                      className="absolute top-0 left-0 right-0 h-1 bg-[#8B0000] blur-[1px] shadow-[0_0_10px_#8B0000] z-10"
                    ></motion.div>
                  )}

                  {/* Corner details */}
                  <div className="absolute top-2.5 left-2.5 font-mono text-[8px] text-stone-400 font-bold uppercase flex items-center gap-1">
                    <Focus className="w-3 h-3 text-[#8B0000]" />
                    <span>LENS GRID FOCUS #11A</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 font-mono text-[8.5px] bg-[#111111]/10 text-stone-700 px-1.5 py-0.2 uppercase font-bold">
                    {isScanning ? 'ANALYZING MATRICES...' : 'HOOPS SIGNAL READY'}
                  </div>
                </div>

                {/* Processing outcomes box */}
                <div className="min-h-12 bg-stone-50 border border-stone-200 p-3.5">
                  {isScanning ? (
                    <div className="flex items-center gap-2.5 font-mono text-xs text-stone-600 font-bold">
                      <RefreshCw className="w-4.5 h-4.5 text-[#8B0000] animate-spin" />
                      <span className="uppercase tracking-tight text-[10px]">EXTRACTING ANKLE SUPPORT HEIGHT & GUSH LEVEL...</span>
                    </div>
                  ) : scanResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-green-700 font-mono text-[10px] font-black uppercase">
                        <Zap className="w-4 h-4 text-green-700 fill-green-700 animate-bounce" />
                        <span>SNEAKER INDEX MATCHED! CONFIG DETAILS below:</span>
                      </div>

                      <div 
                        onClick={() => onSelectProduct(scanResult)}
                        className="flex items-center justify-between p-2 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-stone-50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 border border-stone-200 flex items-center justify-center bg-stone-100 flex-shrink-0 p-1">
                            <img src={scanResult.image} alt={scanResult.name} className="max-h-10 object-contain mix-blend-multiply" />
                          </div>
                          <div className="min-w-0 select-none">
                            <span className="block font-mono text-[8px] text-[#8B0000] leading-none uppercase font-bold">{scanResult.category}</span>
                            <span className="font-display text-sm font-black text-stone-950 uppercase tracking-tight truncate block mt-0.5">{scanResult.name}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
                      </div>
                    </div>
                  ) : (
                    <div className="font-mono text-[10px] text-stone-500 flex items-center gap-1.5 uppercase font-bold">
                      <AlertCircle className="w-4 h-4 text-stone-400" />
                      <span>STANDBY. SUBMIT IMAGE SO THAT ENGINE WILL PARSE INDICES.</span>
                    </div>
                  )}
                </div>

                {/* Control buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={resetScan}
                    className="flex-grow border-2 border-black hover:bg-stone-50 text-black font-mono text-xs font-bold py-2.5 uppercase cursor-pointer text-center bg-white"
                  >
                    RESET LENS CAMERA
                  </button>
                  {scanResult && (
                    <button
                      onClick={() => onSelectProduct(scanResult)}
                      className="flex-grow bg-[#8B0000] hover:bg-[#a10e0e] border-2 border-black text-white font-mono text-xs font-bold py-2.5 uppercase cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000]"
                    >
                      <span>VIEW SCHEMATICS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column (Search input & feed catalog): spanning 7 columns on desktop */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Keyword Search Field box */}
          <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#666666] font-extrabold mb-1.5">
              REAL-TIME KEYWORD FEED SELECTOR
            </span>
            <div className="flex items-center gap-2.5 bg-stone-50 border-2 border-black p-3.5">
              <Search className="w-5 h-5 text-stone-900 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search basketball silhouette (e.g., LeBron, Kobe, Air, Court)..."
                className="w-full bg-transparent font-sans text-xs outline-none text-stone-950 border-none placeholder-stone-400 font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[9px] font-mono px-2 py-0.5 bg-black text-white uppercase font-bold"
                >
                  CLEAR VALUE
                </button>
              )}
            </div>
            <p className="font-mono text-[8.5px] text-stone-400 uppercase mt-2 select-none tracking-tight">
              PRO TIP: SPECIFY "MAX CUSHIONED" OR "COURT FEEL" TO ACCELERATE DISCOVERY.
            </p>
          </div>

          {/* Search Result display list */}
          <div className="space-y-3.5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#666666] font-bold border-b border-black pb-1">
              {searchQuery ? `Discovered Results (${searchResults.length} Chassis Matches)` : `Explore All Available Shoes (${SHOES_DATA.length} Available Kicks)`}
            </h3>

            {searchResults.length === 0 ? (
              <div className="bg-white border-2 border-black p-8 text-center shadow-[4px_4px_0px_#111111]">
                <p className="font-mono text-xs text-stone-500 uppercase font-black">NO MATCHES ALIGNED</p>
                <p className="font-sans text-xs text-stone-600 mt-2 leading-relaxed max-w-sm mx-auto">
                  We couldn't align any kicks with those parameters. Verify spelling or swap queries for generic basketball keywords.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((shoe) => (
                  <div
                    key={shoe.id}
                    onClick={() => onSelectProduct(shoe)}
                    className="bg-white border-3 border-black p-4 flex flex-col justify-between cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_#8B0000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
                  >
                    {/* Upper row: Star ratings and specifications */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8.5px] font-mono bg-stone-100 p-0.5 px-1.5 uppercase font-bold border border-black/10">
                        {shoe.category}
                      </span>
                      <div className="flex items-center gap-0.5 text-[9px] font-mono">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-extrabold">{shoe.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Central visual: transparent mix-blend-multiply image */}
                    <div className="w-full h-24 flex items-center justify-center relative select-none pointer-events-none my-1.5">
                      <div className="absolute bottom-1 w-20 h-2 bg-stone-200 rounded-full blur-sm"></div>
                      <img
                        src={shoe.image}
                        alt={shoe.name}
                        className="max-h-20 object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-200"
                      />
                    </div>

                    {/* Bottom Metadata: Name & prices details */}
                    <div className="border-t border-dashed border-stone-100 pt-2.5 mt-2 flex flex-col justify-between">
                      <h4 className="font-display text-xs sm:text-sm font-black uppercase text-stone-900 leading-tight truncate group-hover:text-[#8B0000]">
                        {shoe.name}
                      </h4>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="font-display font-extrabold text-sm text-stone-950">
                          Rp {(shoe.price / 1000000).toFixed(3)}.000
                        </span>
                        
                        <div className="flex items-center gap-1 font-mono text-[8.5px] uppercase bg-black text-white px-1.5 py-0.2 tracking-wider font-extrabold group-hover:bg-[#8B0000] transition-colors leading-none">
                          <span>COP</span>
                          <ArrowRight className="w-2.5 h-2.5 font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
