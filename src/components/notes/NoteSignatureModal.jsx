import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function NoteSignatureModal({ open, onOpenChange, onSign, ptProfile }) {
  const [licenseName, setLicenseName] = useState(
    ptProfile ? `${ptProfile.first_name} ${ptProfile.last_name}` : ''
  )
  const [licenseNumber, setLicenseNumber] = useState(ptProfile?.license_number || '')
  const [licenseState, setLicenseState] = useState(ptProfile?.license_state || '')
  const [signatureText, setSignatureText] = useState('')
  const [isSigning, setIsSigning] = useState(false)
  const [error, setError] = useState(null)

  const canSign = licenseName.trim() && licenseNumber.trim() && signatureText.trim()

  const handleSign = async () => {
    if (!canSign) return
    setIsSigning(true)
    setError(null)
    try {
      await onSign({
        signed_by_name: licenseName.trim(),
        signed_by_license: `${licenseState ? licenseState + ' ' : ''}PT #${licenseNumber.trim()}`,
        signature_data: signatureText.trim(),
      })
      onOpenChange(false)
    } catch (err) {
      setError(err.message || 'Failed to sign note')
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Sign & Finalize Note">
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-xs font-sans text-amber-800">
            Signing this note will finalize it as a legal clinical document. Signed notes cannot be edited.
          </p>
        </div>

        <Input
          label="Full Name"
          value={licenseName}
          onChange={(e) => setLicenseName(e.target.value)}
          placeholder="Dr. Jane Smith, PT, DPT"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="License Number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="PT12345"
          />
          <Input
            label="License State"
            value={licenseState}
            onChange={(e) => setLicenseState(e.target.value)}
            placeholder="CA"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
            Type Your Signature
          </label>
          <div className="relative">
            <input
              type="text"
              value={signatureText}
              onChange={(e) => setSignatureText(e.target.value)}
              placeholder="Type your full name as electronic signature"
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-lg font-sans italic shadow-sm placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              style={{ fontFamily: 'cursive, serif' }}
            />
          </div>
          <p className="mt-1 text-[10px] font-sans text-muted-foreground">
            By typing your name you confirm this constitutes your electronic signature.
          </p>
        </div>

        {error && (
          <p className="text-sm font-sans text-destructive">{error}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2"
            disabled={!canSign || isSigning}
            onClick={handleSign}
          >
            <ShieldCheck className="h-4 w-4" />
            {isSigning ? 'Signing...' : 'Sign & Finalize'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
