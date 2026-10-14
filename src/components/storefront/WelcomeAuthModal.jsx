import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  X,
  Gift,
  Truck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import EidulaLogo from '../common/EidulaLogo';
import emblemImg from '../../assets/eidula-emblem.png';

const authTextByLang = {
  en: {
    portalBadge: 'Eidula Priority Portal',
    welcomeTitle: 'Welcome to Eidula',
    registerTitle: 'Create Your Eidula Account',
    welcomeSubtitle: 'Sign in to access your orders, track shipments & manage 0% EMI.',
    registerSubtitle: 'Register to unlock pure spices, special discounts, live GPS delivery tracking & brand warranties.',
    benefitTracking: 'Live GPS Delivery Tracking',
    benefitSubsidy: '0% Interest No-Cost EMI',
    benefitInvoice: 'Official GST Tax Invoices',
    tabSignIn: 'Sign In',
    tabRegister: 'New Customer (Register)',
    nameLabel: 'Full Name *',
    namePlaceholder: 'e.g. Rahul Sharma',
    phoneLabel: 'Mobile Number *',
    phonePlaceholder: 'e.g. 9876543210',
    emailLabel: 'Email Address *',
    emailPlaceholder: 'e.g. rahul@gmail.com',
    passwordLabel: 'Password *',
    passwordPlaceholder: 'Enter secure password',
    show: 'Show',
    hide: 'Hide',
    btnSignIn: 'Sign In to Account',
    btnRegister: 'Complete Registration & Continue',
    btnLoading: 'Please wait...',
    guestDismiss: 'Skip for now & Continue Browsing as Guest →',
    fillRequired: 'Please fill all required fields.',
    enterEmailPass: 'Please enter both email and password.',
    welcomeBack: 'Welcome back to Eidula!',
    welcomeNew: (name) => `Welcome to Eidula, ${name}! ✨`
  },
  hi: {
    portalBadge: 'Eidula प्राथमिकता ग्राहक पोर्टल',
    welcomeTitle: 'Eidula में आपका स्वागत है',
    registerTitle: 'सत्यापित ग्राहक खाता बनाएं',
    welcomeSubtitle: 'अपने शुद्ध मसाले, ऑर्डर्स और 0% EMI के लिए लॉगिन करें।',
    registerSubtitle: 'प्योर मसाले, फास्ट डिलीवरी और ब्रांड वारंटी के लिए अभी रजिस्टर करें।',
    benefitTracking: 'लाइव डिलीवरी ट्रैकिंग',
    benefitSubsidy: '0% ब्याज नो-कॉस्ट EMI',
    benefitInvoice: 'पक्का GST टैक्स इनवॉइस',
    tabSignIn: 'लॉगिन करें',
    tabRegister: 'नया ग्राहक (रजिस्टर)',
    nameLabel: 'पूरा नाम *',
    namePlaceholder: 'उदा. राहुल शर्मा',
    phoneLabel: 'मोबाइल नंबर *',
    phonePlaceholder: 'उदा. 7823354321',
    emailLabel: 'ईमेल पता *',
    emailPlaceholder: 'उदा. rahul@gmail.com',
    passwordLabel: 'पासवर्ड *',
    passwordPlaceholder: 'सुरक्षित पासवर्ड दर्ज करें',
    show: 'देखें',
    hide: 'छुपाएं',
    btnSignIn: 'खाते में लॉगिन करें',
    btnRegister: 'रजिस्ट्रेशन पूरा करें और आगे बढ़ें',
    btnLoading: 'कृपया प्रतीक्षा करें...',
    guestDismiss: 'अभी छोड़ें व अतिथि के रूप में ब्राउज़ करें →',
    fillRequired: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    enterEmailPass: 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।',
    welcomeBack: 'Eidula में पुनः स्वागत है!',
    welcomeNew: (name) => `Eidula में आपका स्वागत है, ${name}! ✨`
  },
  gu: {
    portalBadge: 'Eidula પ્રાયોરિટી પોર્ટલ',
    welcomeTitle: 'Eidula માં આપનું સ્વાગત છે',
    registerTitle: 'ગ્રાહક એકાઉન્ટ બનાવો',
    welcomeSubtitle: 'તમારા ઓર્ડર, શુદ્ધ મસાલા અને 0% EMI માટે લૉગિન કરો.',
    registerSubtitle: 'શુદ્ધ મસાલા, ફાસ્ટ ડિલિવરી અને વોરંટી મેળવવા રજીસ્ટ્રેશન કરો.',
    benefitTracking: 'લાઈવ ટ્રેકિંગ',
    benefitSubsidy: '0% વ્યાજ EMI સુવિધા',
    benefitInvoice: 'પાકું GST ટેક્સ બિલ',
    tabSignIn: 'લૉગિન કરો',
    tabRegister: 'નવા ગ્રાહક (રજીસ્ટર)',
    nameLabel: 'પૂરું નામ *',
    namePlaceholder: 'દા.ત. રમેશભાઈ પટેલ',
    phoneLabel: 'મોબાઇલ નંબર *',
    phonePlaceholder: 'દા.ત. 9876543210',
    emailLabel: 'ઈમેલ એડ્રેસ *',
    emailPlaceholder: 'દા.ત. ramesh@gmail.com',
    passwordLabel: 'પાસવર્ડ *',
    passwordPlaceholder: 'પાસવર્ડ દાખલ કરો',
    show: 'જુઓ',
    hide: 'છુપાવો',
    btnSignIn: 'એકાઉન્ટમાં લૉગિન કરો',
    btnRegister: 'રજીસ્ટ્રેશન પૂર્ણ કરો',
    btnLoading: 'કૃપા કરીને રાહ જુઓ...',
    guestDismiss: 'હમણાં માટે છોડો અને મુલાકાત ચાલુ રાખો →',
    fillRequired: 'કૃપા કરીને બધી વિગતો ભરો.',
    enterEmailPass: 'કૃપા કરીને ઈમેલ અને પાસવર્ડ દાખલ કરો.',
    welcomeBack: 'Eidula માં આપનું સ્વાગત છે!',
    welcomeNew: (name) => `Eidula માં આપનું સ્વાગત છે, ${name}! ✨`
  },
  pa: {
    portalBadge: 'Eidula ਪ੍ਰਾਥਮਿਕਤਾ ਪੋਰਟਲ',
    welcomeTitle: 'Eidula ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    registerTitle: 'ਗਾਹਕ ਖਾਤਾ ਬਣਾਓ',
    welcomeSubtitle: 'ਆਪਣੇ ਆਰਡਰ, ਸ਼ੁੱਧ ਮਸਾਲੇ ਅਤੇ 0% ਕਿਸ਼ਤਾਂ ਲਈ ਲੌਗਇਨ ਕਰੋ।',
    registerSubtitle: 'ਲਾਈਵ ਟਰੈਕਿੰਗ ਅਤੇ ਬ੍ਰਾਂਡ ਵਾਰੰਟੀ ਲਈ ਰਜਿਸਟਰ ਕਰੋ।',
    benefitTracking: 'ਲਾਈਵ ਟਰੈਕਿੰਗ',
    benefitSubsidy: '0% ਵਿਆਜ ਕਿਸ਼ਤਾਂ',
    benefitInvoice: 'ਪੱਕਾ GST ਟੈਕਸ ਬਿੱਲ',
    tabSignIn: 'ਲੌਗਇਨ',
    tabRegister: 'ਨਵਾਂ ਗਾਹਕ (ਰਜਿਸਟਰ)',
    nameLabel: 'ਪੂਰਾ ਨਾਮ *',
    namePlaceholder: 'ਜਿਵੇਂ ਕਿ ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
    phoneLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ *',
    phonePlaceholder: 'ਜਿਵੇਂ ਕਿ 9876543210',
    emailLabel: 'ਈਮੇਲ ਪਤਾ *',
    emailPlaceholder: 'ਜਿਵੇਂ ਕਿ gurpreet@gmail.com',
    passwordLabel: 'ਪਾਸਵਰਡ *',
    passwordPlaceholder: 'ਸੁਰੱਖਿਅਤ ਪਾਸਵਰਡ ਭਰੋ',
    show: 'ਵੇਖੋ',
    hide: 'ਛੁਪਾਓ',
    btnSignIn: 'ਖਾਤੇ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ',
    btnRegister: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰੋ',
    btnLoading: 'ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ...',
    guestDismiss: 'ਹੁਣੇ ਛੱਡੋ ਤੇ ਮਹਿਮਾਨ ਵਜੋਂ ਵੇਖੋ →',
    fillRequired: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖਾਨੇ ਭਰੋ।',
    enterEmailPass: 'ਕਿਰਪਾ ਕਰਕੇ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।',
    welcomeBack: 'Eidula ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ!',
    welcomeNew: (name) => `Eidula ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ, ${name}! ✨`
  },
  mr: {
    portalBadge: 'Eidula प्राधान्य पोर्टल',
    welcomeTitle: 'Eidula मध्ये आपले स्वागत आहे',
    registerTitle: 'ग्राहक खाते तयार करा',
    welcomeSubtitle: 'आपल्या ऑर्डर्स, शुद्ध मसाले आणि 0% हप्त्यांसाठी लॉगिन करा.',
    registerSubtitle: 'थेट ट्रॅकिंग आणि वॉरंटीसाठी नोंदणी करा.',
    benefitTracking: 'थेट ट्रॅकिंग',
    benefitSubsidy: '0% व्याज हप्ते',
    benefitInvoice: 'पक्के GST कर बीजक',
    tabSignIn: 'लॉगिन करा',
    tabRegister: 'नवीन ग्राहक (नोंदणी)',
    nameLabel: 'पूर्ण नाव *',
    namePlaceholder: 'उदा. विलास पाटील',
    phoneLabel: 'मोबाईल क्रमांक *',
    phonePlaceholder: 'उदा. 9876543210',
    emailLabel: 'ईमेल पत्ता *',
    emailPlaceholder: 'उदा. vilas@gmail.com',
    passwordLabel: 'पासवर्ड *',
    passwordPlaceholder: 'सुरक्षित पासवर्ड टाका',
    show: 'पहा',
    hide: 'लपवा',
    btnSignIn: 'खात्यात लॉगिन करा',
    btnRegister: 'नोंदणी पूर्ण करा',
    btnLoading: 'कृपया प्रतीक्षा करा...',
    guestDismiss: 'सध्या वगळा आणि पाहुणे म्हणून पहा →',
    fillRequired: 'कृपया सर्व माहिती भरा.',
    enterEmailPass: 'कृपया ईमेल आणि पासवर्ड दोन्ही भरा.',
    welcomeBack: 'Eidula मध्ये पुन्हा स्वागत आहे!',
    welcomeNew: (name) => `Eidula मध्ये स्वागत आहे, ${name}! ✨`
  },
  te: {
    portalBadge: 'Eidula ప్రాధాన్యత పోర్టల్',
    welcomeTitle: 'Eidula కు స్వాగతం',
    registerTitle: 'ఖాతా సృష్టించండి',
    welcomeSubtitle: 'మీ ఆర్డర్లు, స్వచ్ఛమైన మసాలాలు మరియు 0% EMI కోసం లాగిన్ అవ్వండి.',
    registerSubtitle: 'లైవ్ ట్రాకింగ్ మరియు బ్రాండ్ వారంటీ కోసం రిజిస్టర్ అవ్వండి.',
    benefitTracking: 'లైవ్ ట్రాకింగ్',
    benefitSubsidy: '0% వడ్డీ EMI',
    benefitInvoice: 'GST టాక్స్ ఇన్వాయిస్',
    tabSignIn: 'లాగిన్',
    tabRegister: 'కొత్త ఖాతాదారు (రిజిస్టర్)',
    nameLabel: 'పూర్తి పేరు *',
    namePlaceholder: 'ఉదా. రమణ రావు',
    phoneLabel: 'మొబైల్ నంబర్ *',
    phonePlaceholder: 'ఉదా. 9876543210',
    emailLabel: 'ఈమెయిల్ చిరునామా *',
    emailPlaceholder: 'ఉదా. ramana@gmail.com',
    passwordLabel: 'పాస్‌వర్డ్ *',
    passwordPlaceholder: 'పాస్‌వర్డ్ నమోదు చేయండి',
    show: 'చూడండి',
    hide: 'దాచండి',
    btnSignIn: 'ఖాతాలోకి లాగిన్ అవ్వండి',
    btnRegister: 'రిజిస్ట్రేషన్ పూర్తి చేయండి',
    btnLoading: 'దయచేసి వేచి ఉండండి...',
    guestDismiss: 'ఇప్పుడు దాటవేసి చూడండి →',
    fillRequired: 'దయచేసి అన్ని వివరాలు పూరించండి.',
    enterEmailPass: 'దయచేసి ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.',
    welcomeBack: 'Eidula కు తిరిగి స్వాగతం!',
    welcomeNew: (name) => `Eidula కు స్వాగతం, ${name}! ✨`
  }
};

const WelcomeAuthModal = () => {
  const { user, isAuthenticated, loading: authLoading, login, register } = useAuth();
  const { language } = useLanguage();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const txt = authTextByLang[language] || authTextByLang.en;

  useEffect(() => {
    // Do not show on admin routes or if user is on dedicated /login page
    const isAdminPath = location.pathname.includes('/secure-admin-portal') || location.pathname.includes('/admin');
    const isLoginPage = location.pathname === '/login';

    if (isAdminPath || isLoginPage) {
      return;
    }

    // Check if already authenticated or already dismissed in this session
    const hasDismissed = sessionStorage.getItem('eidula_welcome_auth_dismissed');

    if (!isAuthenticated && !authLoading && !hasDismissed) {
      // ⏳ Exact 10 seconds delay as requested by user
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading, location.pathname]);

  const handleClose = () => {
    sessionStorage.setItem('eidula_welcome_auth_dismissed', 'true');
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password || !phone) {
          addToast(txt.fillRequired, 'warning');
          setLoading(false);
          return;
        }

        await register({
          name,
          email,
          phone,
          password
        });
        addToast(txt.welcomeNew(name), 'success');
      } else {
        if (!email || !password) {
          addToast(txt.enterEmailPass, 'warning');
          setLoading(false);
          return;
        }

        await login(email, password);
        addToast(txt.welcomeBack, 'success');
      }

      sessionStorage.setItem('eidula_welcome_auth_dismissed', 'true');
      setIsOpen(false);
    } catch (error) {
      addToast(error.message || 'Authentication error. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || isAuthenticated) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content auth-modal-content"
        style={{
          maxWidth: '460px',
          width: '100%',
          borderRadius: '20px',
          padding: '1.1rem 1.25rem 0.95rem 1.25rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Logo Emblem + Brand Name on Left, Close Button on Right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
            <img
              src={emblemImg}
              alt="Eidula Logo"
              style={{
                height: '34px',
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.35))'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                  fontSize: '1.22rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: 'var(--text-main, #ffffff)',
                  lineHeight: 1
                }}
              >
                EIDULA
              </span>
              <span
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.45rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted, #94a3b8)',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                  lineHeight: 1
                }}
              >
                EVERYTHING YOU NEED, ALL IN ONE PLACE
              </span>
            </div>
          </div>

          {/* Close Button X */}
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'var(--bg-surface-alt, rgba(255, 255, 255, 0.08))',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              color: 'var(--text-muted, #94a3b8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            className="hover:bg-red-500 hover:text-white hover:scale-105 active:scale-95"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Sub-Header: Portal Badge & Compact Title */}
        <div style={{ textAlign: 'left', marginBottom: '0.55rem' }}>
          <div className="flex items-center gap-1.5" style={{ marginBottom: '2px' }}>
            <Sparkles size={12} color="#f59e0b" />
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary-400, #22c55e)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {txt.portalBadge}
            </span>
          </div>

          <h2 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 2px 0' }}>
            {isRegister ? txt.registerTitle : txt.welcomeTitle}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: 1.3 }}>
            {isRegister ? txt.registerSubtitle : txt.welcomeSubtitle}
          </p>
        </div>

        {/* Benefits Ribbon (Slim Single-Line) */}
        <div
          className="auth-benefits-ribbon"
          style={{
            padding: '0.35rem 0.6rem',
            marginBottom: '0.55rem',
            gap: '0.35rem',
            fontSize: '0.72rem',
            borderRadius: '9px'
          }}
        >
          <span className="flex items-center gap-1">
            <Truck size={12} color="#22c55e" /> {txt.benefitTracking}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} color="#22c55e" /> {txt.benefitSubsidy}
          </span>
          <span className="flex items-center gap-1">
            <Gift size={12} color="#22c55e" /> {txt.benefitInvoice}
          </span>
        </div>

        {/* Tab Switcher (Sign In vs Register) */}
        <div className="auth-tab-switcher" style={{ padding: '3px', marginBottom: '0.55rem', borderRadius: '9px' }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            style={{ padding: '0.36rem 0.5rem', fontSize: '0.78rem', fontWeight: 800 }}
          >
            {txt.tabSignIn}
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            style={{ padding: '0.36rem 0.5rem', fontSize: '0.78rem', fontWeight: 800 }}
          >
            {txt.tabRegister}
          </button>
        </div>

        {/* Auth Form (Compact, Zero-Scroll) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {isRegister && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="input-group">
                <label className="auth-input-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                  <span className="flex items-center gap-1">
                    <UserIcon size={12} color="var(--primary-400, #22c55e)" />
                    <span>{txt.nameLabel}</span>
                  </span>
                </label>
                <input
                  type="text"
                  required={isRegister}
                  className="input-field"
                  style={{ padding: '0.42rem 0.65rem', fontSize: '0.8rem', borderRadius: '8px' }}
                  placeholder={txt.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="auth-input-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                  <span className="flex items-center gap-1">
                    <Phone size={12} color="var(--primary-400, #22c55e)" />
                    <span>{txt.phoneLabel}</span>
                  </span>
                </label>
                <input
                  type="tel"
                  required={isRegister}
                  className="input-field"
                  style={{ padding: '0.42rem 0.65rem', fontSize: '0.8rem', borderRadius: '8px' }}
                  placeholder={txt.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="auth-input-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
              <span className="flex items-center gap-1">
                <Mail size={12} color="var(--primary-400, #22c55e)" />
                <span>{txt.emailLabel}</span>
              </span>
            </label>
            <input
              type="email"
              required
              className="input-field"
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: '8px' }}
              placeholder={txt.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="auth-input-label" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
              <span className="flex items-center gap-1">
                <Lock size={12} color="var(--primary-400, #22c55e)" />
                <span>{txt.passwordLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-show-btn"
                style={{ fontSize: '0.7rem' }}
              >
                {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
                <span>{showPassword ? txt.hide : txt.show}</span>
              </button>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input-field"
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: '8px' }}
              placeholder={txt.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              borderRadius: '9px',
              padding: '0.55rem 1rem',
              fontSize: '0.86rem',
              fontWeight: 800,
              marginTop: '0.2rem',
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>{loading ? txt.btnLoading : isRegister ? txt.btnRegister : txt.btnSignIn}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Bottom Guest Dismiss Option */}
        <div style={{ textAlign: 'center', marginTop: '0.45rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.35rem' }}>
          <button
            type="button"
            onClick={handleClose}
            className="auth-guest-link"
            style={{ fontSize: '0.73rem', padding: '0.15rem' }}
          >
            {txt.guestDismiss}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuthModal;

