import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  Mail,
  Send,
  ExternalLink,
  MessageCircle,
  QrCode,
  Smartphone
} from 'lucide-react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';

const ShareProductModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { addToast } = useToast();

  if (!product) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${origin}/product/${product.slug || product._id}`;
  const priceFormatted = formatINR(product.sellingPrice || 0);

  const shareTitle = `🚜 ${product.name} - ₹${product.sellingPrice?.toLocaleString('en-IN')}`;
  const shareText = `Check out the ${product.name} on AgriMachina India!\n💰 Special Price: ${priceFormatted}\n⭐ Verified Farmer Agricultural Equipment\n\nDirect Link:`;

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
      setTimeout(() => setCopied(false), 3000);
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
    `Namaste,\n\nI thought you might be interested in this agricultural equipment:\n\nMachine: ${product.name}\nBrand: ${product.brand || 'AgriMachina'}\nPrice: ${priceFormatted}\n\nView details, subsidies, and specifications here:\n${productUrl}\n\nAgriMachina India - Empowering Farmers`
  )}`;

  // Google Chart API for Instant QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(productUrl)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Farm Equipment" maxWidth="560px">
      <div className="flex flex-col gap-5">
        {/* Product Snapshot Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <img
            src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
            alt={product.name}
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              borderRadius: '10px',
              background: '#ffffff',
              padding: '4px',
              border: '1px solid #e2e8f0'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
              {product.brand || 'AgriMachina'} • SKU: {product.sku || 'N/A'}
            </div>
            <div style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#0f172a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '0.15rem 0'
            }}>
              {product.name}
            </div>
            <div style={{ fontWeight: 900, color: '#062416', fontSize: '1.1rem' }}>
              {priceFormatted}
            </div>
          </div>
        </div>

        {/* Share Channel Buttons Grid */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
            Share directly on:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                color: '#ffffff',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'transform 0.15s ease',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.3)'
              }}
              className="hover:scale-105"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>

            {/* 2. Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#1877F2',
                color: '#ffffff',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'transform 0.15s ease',
                boxShadow: '0 2px 6px rgba(24, 119, 242, 0.3)'
              }}
              className="hover:scale-105"
            >
              <ExternalLink size={20} />
              <span>Facebook</span>
            </a>

            {/* 3. Instagram / Copy for Story */}
            <button
              type="button"
              onClick={() => {
                handleCopyLink();
                addToast('Link copied! Paste it in your Instagram Story, Bio, or DM 📸', 'info');
              }}
              style={{
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#ffffff',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'transform 0.15s ease',
                boxShadow: '0 2px 6px rgba(220, 39, 67, 0.3)'
              }}
              className="hover:scale-105"
            >
              <Smartphone size={20} />
              <span>Instagram</span>
            </button>

            {/* 4. Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#229ED9',
                color: '#ffffff',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'transform 0.15s ease',
                boxShadow: '0 2px 6px rgba(34, 158, 217, 0.3)'
              }}
              className="hover:scale-105"
            >
              <Send size={20} />
              <span>Telegram</span>
            </a>

            {/* 5. Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'transform 0.15s ease'
              }}
              className="hover:scale-105"
            >
              <Share2 size={20} />
              <span>Twitter / X</span>
            </a>

            {/* 6. Email / Mail */}
            <a
              href={mailtoUrl}
              style={{
                background: '#64748b',
                color: '#ffffff',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'transform 0.15s ease'
              }}
              className="hover:scale-105"
            >
              <Mail size={20} />
              <span>Email</span>
            </a>

            {/* 7. Scan QR Code */}
            <button
              type="button"
              onClick={() => setShowQR(!showQR)}
              style={{
                background: showQR ? '#f0fdf4' : '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#166534',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'all 0.15s ease'
              }}
              className="hover:scale-105"
            >
              <QrCode size={20} color="#166534" />
              <span>{showQR ? 'Hide QR' : 'Scan QR'}</span>
            </button>

            {/* 8. Native Mobile Web Share */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                type="button"
                onClick={handleNativeShare}
                style={{
                  background: '#166534',
                  color: '#ffffff',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  transition: 'transform 0.15s ease'
                }}
                className="hover:scale-105"
              >
                <Share2 size={20} />
                <span>More Apps</span>
              </button>
            )}
          </div>
        </div>

        {/* QR Code Expansion View */}
        {showQR && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#062416' }}>
              📱 Scan with Smartphone Camera
            </div>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '8px',
                background: '#ffffff',
                padding: '8px',
                border: '1px solid #e2e8f0'
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Scan from another phone to instantly view this farm machine
            </div>
          </div>
        )}

        {/* Copy Link Input Bar */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
            Or copy direct product link:
          </label>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            background: '#f8fafc',
            overflow: 'hidden',
            padding: '4px'
          }}>
            <input
              type="text"
              readOnly
              value={productUrl}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
                color: '#334155',
                outline: 'none'
              }}
              onClick={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1rem',
                background: copied ? '#15803d' : '#166534',
                color: '#ffffff'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProductModal;
