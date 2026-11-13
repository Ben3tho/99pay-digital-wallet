import React, { useState } from 'react';
import { X, Copy, Check, Code2, FileCode, CheckCircle2 } from 'lucide-react';
import { JETPACK_COMPOSE_FILES } from '../data/jetpackComposeCode';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = JETPACK_COMPOSE_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[88vh] rounded-2xl bg-[#06271D] border border-[#24473A] shadow-2xl flex flex-col text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#24473A] bg-[#03120E]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#00B887]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Jetpack Compose Source Code
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00B887]/15 text-[#00B887] border border-[#00B887]/30">
                  Android / Kotlin
                </span>
              </div>
              <p className="text-xs text-[#B7C8C1]">
                Material 3 composable implementation for 99Pay Digital Wallet
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-[#B7C8C1] hover:text-white rounded-lg bg-[#0B211B] border border-[#24473A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#081F17] border-b border-[#24473A] overflow-x-auto">
          {JETPACK_COMPOSE_FILES.map((file, idx) => (
            <button
              key={file.name}
              type="button"
              onClick={() => {
                setSelectedFileIndex(idx);
                setCopied(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedFileIndex === idx
                  ? 'bg-[#00B887] text-[#03120E] font-bold shadow-sm'
                  : 'bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </button>
          ))}

          <div className="ml-auto pl-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F4C95D] text-[#03120E] hover:bg-[#F8D978] transition-colors cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* File Path & Description strip */}
        <div className="px-5 py-2 bg-[#041712] border-b border-[#24473A]/60 flex items-center justify-between text-xs text-[#B7C8C1]">
          <span className="font-mono text-[11px] text-[#00B887]">
            {currentFile.path}
          </span>
          <span className="text-[11px] italic hidden sm:inline">
            {currentFile.description}
          </span>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-5 font-mono text-[13px] leading-relaxed bg-[#020B08] text-[#E0E6E3] selection:bg-[#00B887]/30">
          <pre className="whitespace-pre">{currentFile.code}</pre>
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-[#03120E] border-t border-[#24473A] flex items-center justify-between text-xs text-[#B7C8C1]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00B887]" />
            <span>Files also saved in repository at <code className="text-[#00B887]">kotlin-compose-reference/app/src/main/java/...</code></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#F4C95D] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
