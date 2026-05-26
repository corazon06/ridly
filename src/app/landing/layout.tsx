export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html { scroll-behavior: auto; }
        input:focus, select:focus { outline: 2px solid #B85633; outline-offset: 2px; }
      `}</style>
      <div
        style={{
          position: 'relative',
          marginLeft: 'calc(50% - 50vw)',
          width: '100vw',
          minHeight: '100vh',
          background: '#FDFCFA',
          overflowX: 'hidden',
        }}
      >
        {children}
      </div>
    </>
  )
}
