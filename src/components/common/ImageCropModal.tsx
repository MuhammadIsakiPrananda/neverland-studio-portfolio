import { useState, useCallback, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import type { Theme } from '../../types';

interface ImageCropModalProps {
  theme: Theme;
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

export default function ImageCropModal({ 
  theme, 
  isOpen, 
  imageSrc, 
  onClose, 
  onCropComplete 
}: ImageCropModalProps) {
  const isDark = theme === 'dark';
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const minDimension = Math.min(width, height);
    const cropSize = minDimension * 0.9;
    
    setCrop({
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x: (width - cropSize) / 2,
      y: (height - cropSize) / 2
    });
  }, []);

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return imageSrc;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return imageSrc;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to cropped dimensions
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    // Apply transformations
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const sourceX = completedCrop.x * scaleX;
    const sourceY = completedCrop.y * scaleY;
    const sourceWidth = completedCrop.width * scaleX;
    const sourceHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(imageSrc);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.95
      );
    });
  }, [completedCrop, scale, imageSrc]);

  const handleApplyCrop = async () => {
    const croppedImage = await getCroppedImg();
    onCropComplete(croppedImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className={`
        relative w-full max-w-4xl max-h-[90vh] flex flex-col
        rounded-2xl shadow-2xl overflow-hidden
        ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}
        animate-scale-in
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}
        `}>
          <div>
            <h2 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Crop Image
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Adjust and crop your profile photo
            </p>
          </div>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isDark 
                ? 'hover:bg-slate-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/50">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxHeight: '60vh',
                maxWidth: '100%'
              }}
            />
          </ReactCrop>
        </div>

        {/* Controls */}
        <div className={`
          px-6 py-4 border-t
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}
        `}>
          {/* Zoom & Rotate Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}
                `}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className={`text-sm font-medium min-w-[60px] text-center ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(Math.min(3, scale + 0.1))}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}
                `}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="h-8 w-px bg-slate-600"></div>

            <button
              onClick={() => setRotate((rotate + 90) % 360)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}
              `}
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-sm font-medium">Rotate</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`
                flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}
              `}
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCrop}
              className="
                flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                text-white shadow-lg shadow-blue-500/20
                flex items-center justify-center gap-2
              "
            >
              <Check className="w-5 h-5" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
