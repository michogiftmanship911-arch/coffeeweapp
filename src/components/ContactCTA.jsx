import { Mail, MessageCircle } from 'lucide-react'
import { SITE } from '../lib/site'

/** Every "Contact Us" / "Get in Touch" button opens WhatsApp. */
export function WhatsAppButton({ label = 'Contact Us', className = 'btn-gold', iconOnly = false }) {
  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={iconOnly ? 'Chat with us on WhatsApp' : undefined}
    >
      <MessageCircle className="h-4 w-4" />
      {!iconOnly && label}
    </a>
  )
}

/** Every "Email Us" button triggers mailto. */
export function EmailButton({ label = 'Email Us', className = 'btn-glass' }) {
  return (
    <a href={SITE.mailto} className={className}>
      <Mail className="h-4 w-4" />
      {label}
    </a>
  )
}
