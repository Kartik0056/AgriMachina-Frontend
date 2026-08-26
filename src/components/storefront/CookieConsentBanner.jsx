import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Lock, Sparkles, Cookie as CookieIcon, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

const cookieTextByLang = {
  en: {
    title: 'Farmer Privacy & Cookie Preferences',
    badge: '100% Encrypted & Safe',
    description: 'We use cookies and secure local storage to remember your language, theme, farm cart machines, and provide live GPS shipment tracking.',
    tagSession: 'Encrypted Session',
    tagTracking: 'Live GPS Logistics',
    tagCart: 'Farm Cart & Warranty',
    btnAccept: 'Accept All Cookies',
    btnDecline: 'Decline / Essential Only',
    toastAccepted: 'Cookie preferences saved! 🍪',
    toastDeclined: 'Only essential cookies will be used.'
  },
  hi: {
    title: 'किसान गोपनीयता और कुकीज़ प्राथमिकताएं',
    badge: '100% सुरक्षित और एन्क्रिप्टेड',
    description: 'हम आपकी चुनी हुई भाषा, थीम, कार्ट में रखी कृषि मशीनों और लाइव GPS डिलीवरी ट्रैकिंग को सुरक्षित रखने के लिए कुकीज़ का उपयोग करते हैं।',
    tagSession: 'सुरक्षित सत्र (Session)',
    tagTracking: 'लाइव GPS लॉजिस्टिक्स',
    tagCart: 'फार्म कार्ट व वारंटी',
    btnAccept: 'सभी कुकीज़ स्वीकार करें',
    btnDecline: 'अस्वीकार / केवल आवश्यक',
    toastAccepted: 'कुकीज़ प्राथमिकताएं सुरक्षित हो गईं! 🍪',
    toastDeclined: 'केवल आवश्यक कुकीज़ का उपयोग किया जाएगा।'
  },
  gu: {
    title: 'ખેડૂત ગોપનીયતા અને કૂકીઝ પસંદગીઓ',
    badge: '100% સુરક્ષિત અને એન્ક્રિપ્ટેડ',
    description: 'અમે તમારી પસંદ કરેલી ભાષા, થીમ, કાર્ટમાં ઉમેરેલી મશીનરી અને લાઈવ GPS ટ્રેકિંગ સાચવવા માટે કૂકીઝનો ઉપયોગ કરીએ છીએ.',
    tagSession: 'સુરક્ષિત સત્ર',
    tagTracking: 'લાઈવ GPS ટ્રેકિંગ',
    tagCart: 'મશીનરી કાર્ટ અને વોરંટી',
    btnAccept: 'બધી કૂકીઝ સ્વીકારો',
    btnDecline: 'અસ્વીકાર કરો',
    toastAccepted: 'કૂકી પસંદગીઓ સાચવી લેવામાં આવી! 🍪',
    toastDeclined: 'માત્ર જરૂરી કૂકીઝ ઉપયોગમાં લેવાશે.'
  },
  pa: {
    title: 'ਕਿਸਾਨ ਗੋਪਨੀਯਤਾ ਅਤੇ ਕੂਕੀਜ਼ ਵਿਕਲਪ',
    badge: '100% ਸੁਰੱਖਿਅਤ',
    description: 'ਅਸੀਂ ਤੁਹਾਡੀ ਚੁਣੀ ਭਾਸ਼ਾ, ਥੀਮ, ਕਾਰਟ ਮਸ਼ੀਨਰੀ ਅਤੇ ਲਾਈਵ GPS ਡਿਲਿਵਰੀ ਟਰੈਕਿੰਗ ਲਈ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਾਂ।',
    tagSession: 'ਸੁਰੱਖਿਅਤ ਸੈਸ਼ਨ',
    tagTracking: 'ਲਾਈਵ GPS ਟਰੈਕਿੰਗ',
    tagCart: 'ਕਾਰਟ ਅਤੇ ਵਾਰੰਟੀ',
    btnAccept: 'ਸਾਰੀਆਂ ਕੂਕੀਜ਼ ਸਵੀਕਾਰ ਕਰੋ',
    btnDecline: 'ਅਸਵੀਕਾਰ ਕਰੋ',
    toastAccepted: 'ਕੂਕੀਜ਼ ਤਰਜੀਹਾਂ ਸੁਰੱਖਿਅਤ ਹੋ ਗਈਆਂ! 🍪',
    toastDeclined: 'ਸਿਰਫ ਜ਼ਰੂਰੀ ਕੂਕੀਜ਼ ਹੀ ਵਰਤੀਆਂ ਜਾਣਗੀਆਂ।'
  },
  mr: {
    title: 'शेतकरी गोपनीयता आणि कुकीज प्राधान्ये',
    badge: '100% सुरक्षित व एन्क्रिप्टेड',
    description: 'आम्ही तुमची भाषा, थीम, कार्टमधील यंत्रसामग्री आणि थेट GPS डिलिव्हरी ट्रॅकिंगसाठी कुकीज वापरतो.',
    tagSession: 'सुरक्षित सत्र',
    tagTracking: 'थेट GPS ट्रॅकिंग',
    tagCart: 'यंत्र कार्ट व वॉरंटी',
    btnAccept: 'सर्व कुकीज स्वीकारा',
    btnDecline: 'नाकारा / फक्त आवश्यक',
    toastAccepted: 'कुकीज प्राधान्ये जतन केली! 🍪',
    toastDeclined: 'फक्त आवश्यक कुकीज वापरल्या जातील.'
  },
  te: {
    title: 'రైతు గోప్యత & కుకీ ప్రాధాన్యతలు',
    badge: '100% సురక్షితం',
    description: 'మీ భాష, థీమ్, వ్యవసాయ యంత్రాలు మరియు లైవ్ GPS ట్రాకింగ్ కోసం మేము కుకీలను ఉపయోగిస్తాము.',
    tagSession: 'సురక్షిత సెషన్',
    tagTracking: 'లైవ్ GPS లాజిస్టిక్స్',
    tagCart: 'వ్యవసాయ కార్ట్ & వారంటీ',
    btnAccept: 'అన్ని కుకీలను అంగీకరించండి',
    btnDecline: 'తిరస్కరించండి',
    toastAccepted: 'కుకీ ప్రాధాన్యతలు భద్రపరచబడ్డాయి! 🍪',
    toastDeclined: 'అవసరమైన కుకీలు మాత్రమే ఉపయోగించబడతాయి.'
  }
};

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const { addToast } = useToast();

  const txt = cookieTextByLang[language] || cookieTextByLang.en;

  useEffect(() => {
    // Check if consent has already been recorded in localStorage or Cookies
    const savedConsent = localStorage.getItem('agri_cookie_consent');
    const hasCookie = document.cookie.includes('agri_cookie_consent');

    if (!savedConsent && !hasCookie) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('agri_cookie_consent', 'accepted');
    localStorage.setItem('agri_cookie_consent_timestamp', new Date().toISOString());
    document.cookie = 'agri_cookie_consent=accepted; max-age=31536000; path=/; SameSite=Lax';

    setIsVisible(false);
    addToast(txt.toastAccepted, 'success');
  };

  const handleDecline = () => {
    localStorage.setItem('agri_cookie_consent', 'declined');
    localStorage.setItem('agri_cookie_consent_timestamp', new Date().toISOString());
    document.cookie = 'agri_cookie_consent=declined; max-age=31536000; path=/; SameSite=Lax';

    setIsVisible(false);
    addToast(txt.toastDeclined, 'info');
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '20px',
        right: '20px',
        maxWidth: '760px',
        margin: '0 auto',
        zIndex: 1100,
        animation: 'cookieSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-color, #cbd5e1)',
          borderRadius: '22px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 25px 60px -10px rgba(6, 36, 22, 0.4), 0 0 0 1px rgba(22, 101, 52, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          position: 'relative'
        }}
      >
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '1px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              flexShrink: 0
            }}>
              🍪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 900, color: 'var(--text-main, #0f172a)', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
                  {txt.title}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ShieldCheck size={11} /> {txt.badge}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDecline}
            style={{
              background: 'var(--bg-surface-alt, #f1f5f9)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              color: 'var(--text-muted, #64748b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
            className="hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95"
            title="Dismiss / बंद करें"
          >
            <X size={15} />
          </button>
        </div>

        {/* Middle Description */}
        <p style={{ margin: 0, fontSize: '0.835rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
          {txt.description}
        </p>

        {/* Feature Tags & Bottom Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          paddingTop: '0.75rem'
        }}>
          {/* Subtle Feature Pills */}
          <div className="hidden sm:flex items-center gap-2" style={{ fontSize: '0.725rem', color: 'var(--primary-700, #15803d)', fontWeight: 700 }}>
            <span style={{ background: 'var(--primary-50, #f0fdf4)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--primary-100, #dcfce7)' }}>
              🔒 {txt.tagSession}
            </span>
            <span style={{ background: 'var(--primary-50, #f0fdf4)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--primary-100, #dcfce7)' }}>
              🚚 {txt.tagTracking}
            </span>
            <span style={{ background: 'var(--primary-50, #f0fdf4)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--primary-100, #dcfce7)' }}>
              🚜 {txt.tagCart}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={handleDecline}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.5rem 0.9rem',
                borderRadius: '10px'
              }}
            >
              {txt.btnDecline}
            </button>

            <button
              type="button"
              onClick={handleAccept}
              className="btn btn-primary btn-sm"
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.5rem 1.15rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)'
              }}
            >
              <Check size={14} />
              <span>{txt.btnAccept}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

