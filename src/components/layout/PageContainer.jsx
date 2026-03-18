export default function PageContainer({ children, title }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      {title && (
        <h1 className="mb-6 text-2xl font-semibold text-foreground">{title}</h1>
      )}
      {children}
    </div>
  )
}
