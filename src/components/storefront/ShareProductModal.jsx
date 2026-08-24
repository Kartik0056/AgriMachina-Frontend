import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode
} from 'lucide-react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';

// Real Official Brand SVG Icons
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const ShareNetworkIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

const QrScanIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
    <line x1="18" y1="7" x2="18.01" y2="7"></line>
    <line x1="18" y1="18" x2="18.01" y2="18"></line>
    <line x1="7" y1="18" x2="7.01" y2="18"></line>
  </svg>
);

const ShareProductModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { addToast } = useToast();

  if (!product) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${origin}/product/${product.slug || product._id}`;
  const priceFormatted = formatINR(product.sellingPrice || 0);

  const shareTitle = `🚜 ${product.name} - ₹${product.sellingPrice?.toLocaleString('en-IN')}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(productUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = productUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      addToast('Product link copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      addToast('Could not copy link automatically. Please copy from text box.', 'warning');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out ${product.name} on AgriMachina (${priceFormatted})`,
          url: productUrl
        });
        addToast('Product shared successfully!', 'success');
        onClose();
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Pre-formatted sharing URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🚜 *${product.name}*\n💰 *Price:* ${priceFormatted} (Incl. GST)\n🔖 *Brand:* ${product.brand || 'AgriMachina'}\n\n👉 *View Details & Order:* ${productUrl}`
  )}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out ${product.name} on AgriMachina! 🚜 Price: ${priceFormatted}`
  )}&url=${encodeURIComponent(productUrl)}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(
    `🚜 ${product.name} - ${priceFormatted} | AgriMachina India`
  )}`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(
    `Recommended Farm Equipment: ${product.name}`
  )}&body=${encodeURIComponent(
    `Namaste,\n\nI thought you might be interested in this agricultural equipment:\n\nMachine: ${product.name}\nBrand: ${product.brand || 'AgriMachina'}\nPrice: ${priceFormatted}\n\nView details, subsidies, and specifications here:\n${productUrl}\n\nAgriMachina India - Farmer Direct Machinery`
  )}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(productUrl)}`;

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      href: whatsappUrl,
      bg: 'linear-gradient(135deg, #25D366, #128C7E)',
      shadow: 'rgba(37, 211, 102, 0.4)',
      isLink: true
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: facebookUrl,
      bg: 'linear-gradient(135deg, #1877F2, #0d5ec4)',
      shadow: 'rgba(24, 119, 242, 0.4)',
      isLink: true
    },
    {
      name: 'Instagram',
      icon: InstagramIcon,
      action: () => {
        handleCopyLink();
        addToast('Link copied! Ready to paste into Instagram Story or DM 📸', 'info');
      },
      bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
      shadow: 'rgba(253, 29, 29, 0.4)',
      isLink: false
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      href: telegramUrl,
      bg: 'linear-gradient(135deg, #2AABEE, #229ED9)',
      shadow: 'rgba(34, 158, 217, 0.4)',
      isLink: true
    },
    {
      name: 'X (Twitter)',
      icon: XIcon,
      href: twitterUrl,
      bg: 'linear-gradient(135deg, #1e293b, #000000)',
      shadow: 'rgba(15, 23, 42, 0.4)',
      isLink: true
    },
    {
      name: 'Email',
      icon: EmailIcon,
      href: mailtoUrl,
      bg: 'linear-gradient(135deg, #ea4335, #c5221f)',
      shadow: 'rgba(234, 67, 53, 0.4)',
      isLink: true
    },
    {
      name: showQR ? 'Close QR' : 'QR Code',
      icon: QrScanIcon,
      action: () => setShowQR(!showQR),
      bg: showQR ? 'linear-gradient(135deg, #166534, #15803d)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
      shadow: 'rgba(99, 102, 241, 0.4)',
      isLink: false
    },
    {
      name: 'More',
      icon: ShareNetworkIcon,
      action: handleNativeShare,
      bg: 'linear-gradient(135deg, #16a34a, #15803d)',
      shadow: 'rgba(22, 163, 74, 0.4)',
      isLink: false
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Farm Equipment" maxWidth="480px">
      <div className="flex flex-col gap-4" style={{ animation: 'fadeIn 0.25s ease-out' }}>
        {/* Compact Product Snapshot Card */}
        <div
          style={{
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <img
            src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
            alt={product.name}
            style={{
              width: '54px',
              height: '54px',
              objectFit: 'contain',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              padding: '3px',
              border: '1px solid var(--border-color)',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.brand || 'AgriMachina'} {product.sku ? `• SKU: ${product.sku}` : ''}
            </div>
            <div style={{
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '0.1rem 0'
            }}>
              {product.name}
            </div>
            <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1rem' }}>
              {priceFormatted}
            </div>
          </div>
        </div>

        {/* Channels Grid with Real Official Logos & Micro-animations */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Share directly via:
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.85rem 0.5rem'
            }}
          >
            {shareChannels.map((ch, idx) => {
              const IconComp = ch.icon;

              const content = (
                <>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: ch.bg,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 14px ${ch.shadow}`,
                      transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    className="share-icon-btn"
                  >
                    <IconComp />
                  </div>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {ch.name}
                  </span>
                </>
              );

              if (ch.isLink) {
                return (
                  <a
                    key={idx}
                    href={ch.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.18s ease'
                    }}
                    className="hover:scale-105 active:scale-95"
                    title={`Share on ${ch.name}`}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={ch.action}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.18s ease'
                  }}
                  className="hover:scale-105 active:scale-95"
                  title={`Share on ${ch.name}`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Expansion Card */}
        {showQR && (
          <div
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <QrCode size={16} color="var(--primary-600, #166534)" />
              <span>Scan to Open on Mobile</span>
            </div>
            <img
              src={qrCodeUrl}
              alt="Machine QR Code"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '10px',
                background: '#ffffff',
                padding: '6px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Point any camera or QR scanner to view instant equipment specifications.
            </div>
          </div>
        )}

        {/* Copy Link Input Bar */}
        <div>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Or copy direct product link:
          </label>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid var(--border-color)',
              borderRadius: '12px',
              background: 'var(--bg-surface-alt)',
              overflow: 'hidden',
              padding: '3px',
              transition: 'border-color 0.15s ease'
            }}
          >
            <input
              type="text"
              readOnly
              value={productUrl}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '0.45rem 0.65rem',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                outline: 'none',
                textOverflow: 'ellipsis'
              }}
              onClick={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.9rem',
                background: copied ? '#15803d' : 'var(--primary-600, #166534)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
              className="hover:scale-105 active:scale-95"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProductModal;
