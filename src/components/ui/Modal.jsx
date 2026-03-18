import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export default function Modal({ open, onOpenChange, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 bg-white p-4 sm:p-6 shadow-2xl focus:outline-none max-h-[90vh] overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            {title && (
              <Dialog.Title className="text-lg font-semibold font-sans text-foreground">
                {title}
              </Dialog.Title>
            )}
            <Dialog.Close asChild>
              <button
                className="ml-auto rounded-full p-1.5 text-muted-foreground/50 transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description asChild>
            <div>{children}</div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
