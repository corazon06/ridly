'use client'
import { useEffect, useState } from 'react'

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)
  const [pastForm, setPastForm] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const form = document.getElementById('inscription')
      if (!form) return
      const formTop = form.getBoundingClientRect().top + scrollY
      setVisible(scrollY > 300)
      setPastForm(scrollY > formTop - 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible || pastForm) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-5 pt-3 bg-[#FDFCFA] border-t border-[#E8E4DC]">
      <a
        href="#inscription"
        className="block bg-[#B85633] text-white text-center py-3.5 rounded-xl text-[15px] font-medium no-underline"
      >
        Rejoindre la liste · Lyon en premier →
      </a>
    </div>
  )
}
