import { Mic, MicOff } from 'lucide-react'

export default function VoiceButton({ isListening, isSupported, onClick }) {
  if (!isSupported) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
        isListening
          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
          : 'bg-white text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
      }`}
      title={isListening ? 'Stop dictation' : 'Start voice dictation'}
    >
      {isListening ? (
        <>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
          <MicOff className="h-4 w-4" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  )
}
