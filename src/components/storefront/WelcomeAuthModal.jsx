import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Tractor,
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

const authTextByLang = {
  en: {
    portalBadge: 'Farmer Priority Portal',
    welcomeTitle: 'Welcome to AgriMachina',
    registerTitle: 'Create Verified Farmer Account',
    welcomeSubtitle: 'Sign in to access your farm machinery orders, subsidies & 0% EMI.',
    registerSubtitle: 'Register to unlock DBT subsidies, live GPS shipping & OEM warranties.',
    benefitTracking: 'Live GPS Tracking',
    benefitSubsidy: '0% EMI & DBT Subsidy',
    benefitInvoice: 'GST Tax Invoices',
    tabSignIn: 'Sign In',
    tabRegister: 'New Farmer (Register)',
    nameLabel: 'Full Name *',
    namePlaceholder: 'e.g. Rampal Singh',
    phoneLabel: 'Mobile Number *',
    phonePlaceholder: 'e.g. 7823354321',
    emailLabel: 'Farmer Email Address *',
    emailPlaceholder: 'e.g. rampal@gmail.com',
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
    welcomeBack: 'Welcome back to AgriMachina!',
    welcomeNew: (name) => `Welcome to AgriMachina, ${name}! 🌾`
  },
  hi: {
    portalBadge: 'किसान प्राथमिकता पोर्टल',
    welcomeTitle: 'AgriMachina में आपका स्वागत है',
    registerTitle: 'सत्यापित किसान खाता बनाएं',
    welcomeSubtitle: 'अपने कृषि मशीन ऑर्डर्स, सरकारी सब्सिडी और 0% EMI के लिए लॉगिन करें।',
    registerSubtitle: 'DBT सब्सिडी, लाइव GPS डिलीवरी और OEM वारंटी के लिए अभी रजिस्टर करें।',
    benefitTracking: 'लाइव GPS डिलीवरी ट्रैकिंग',
    benefitSubsidy: '0% ब्याज EMI व सरकारी सब्सिडी',
    benefitInvoice: 'पक्का GST टैक्स इनवॉइस',
    tabSignIn: 'लॉगिन करें',
    tabRegister: 'नया किसान (रजिस्टर)',
    nameLabel: 'किसान का पूरा नाम *',
    namePlaceholder: 'उदा. रामपाल सिंह',
    phoneLabel: 'मोबाइल नंबर *',
    phonePlaceholder: 'उदा. 7823354321',
    emailLabel: 'ईमेल पता *',
    emailPlaceholder: 'उदा. rampal@gmail.com',
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
    welcomeBack: 'AgriMachina में पुनः स्वागत है!',
    welcomeNew: (name) => `AgriMachina में आपका स्वागत है, ${name}! 🌾`
  },
  gu: {
    portalBadge: 'કિસાન પ્રાયોરિટી પોર્ટલ',
    welcomeTitle: 'AgriMachina માં આપનું સ્વાગત છે',
    registerTitle: 'ખેડૂત એકાઉન્ટ બનાવો',
    welcomeSubtitle: 'તમારા મશીનરી ઓર્ડર, સબસિડી અને 0% EMI માટે લૉગિન કરો.',
    registerSubtitle: 'DBT સબસિડી, લાઈવ GPS ટ્રેકિંગ અને વોરંટી મેળવવા રજીસ્ટ્રેશન કરો.',
    benefitTracking: 'લાઈવ GPS ટ્રેકિંગ',
    benefitSubsidy: '0% વ્યાજ EMI અને સબસિડી',
    benefitInvoice: 'પાકું GST ટેક્સ બિલ',
    tabSignIn: 'લૉગિન કરો',
    tabRegister: 'નવા ખેડૂત (રજીસ્ટર)',
    nameLabel: 'ખેડૂતનું પૂરું નામ *',
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
    welcomeBack: 'AgriMachina માં આપનું સ્વાગત છે!',
    welcomeNew: (name) => `AgriMachina માં આપનું સ્વાગત છે, ${name}! 🌾`
  },
  pa: {
    portalBadge: 'ਕਿਸਾਨ ਪ੍ਰਾਥਮਿਕਤਾ ਪੋਰਟਲ',
    welcomeTitle: 'AgriMachina ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    registerTitle: 'ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ',
    welcomeSubtitle: 'ਆਪਣੇ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਆਰਡਰ, ਸਬਸਿਡੀ ਅਤੇ 0% ਕਿਸ਼ਤਾਂ ਲਈ ਲੌਗਇਨ ਕਰੋ।',
    registerSubtitle: 'ਸਰਕਾਰੀ ਸਬਸਿਡੀ, ਲਾਈਵ GPS ਟਰੈਕਿੰਗ ਅਤੇ ਵਾਰੰਟੀ ਲਈ ਰਜਿਸਟਰ ਕਰੋ।',
    benefitTracking: 'ਲਾਈਵ GPS ਟਰੈਕਿੰਗ',
    benefitSubsidy: '0% ਵਿਆਜ ਕਿਸ਼ਤਾਂ ਤੇ ਸਬਸਿਡੀ',
    benefitInvoice: 'ਪੱਕਾ GST ਟੈਕਸ ਬਿੱਲ',
    tabSignIn: 'ਲੌਗਇਨ',
    tabRegister: 'ਨਵਾਂ ਕਿਸਾਨ (ਰਜਿਸਟਰ)',
    nameLabel: 'ਕਿਸਾਨ ਦਾ ਪੂਰਾ ਨਾਮ *',
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
    welcomeBack: 'AgriMachina ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ!',
    welcomeNew: (name) => `AgriMachina ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ, ${name}! 🌾`
  },
  mr: {
    portalBadge: 'शेतकरी प्राधान्य पोर्टल',
    welcomeTitle: 'AgriMachina मध्ये आपले स्वागत आहे',
    registerTitle: 'शेतकरी खाते तयार करा',
    welcomeSubtitle: 'आपल्या यंत्रसामग्री ऑर्डर्स, सबसिडी आणि 0% हप्त्यांसाठी लॉगिन करा.',
    registerSubtitle: 'शासकीय सबसिडी, थेट GPS ट्रॅकिंग आणि वॉरंटीसाठी नोंदणी करा.',
    benefitTracking: 'थेट GPS ट्रॅकिंग',
    benefitSubsidy: '0% व्याज हप्ते व सबसिडी',
    benefitInvoice: 'पक्के GST कर बीजक',
    tabSignIn: 'लॉगिन करा',
    tabRegister: 'नवीन शेतकरी (नोंदणी)',
    nameLabel: 'शेतकऱ्याचे पूर्ण नाव *',
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
    welcomeBack: 'AgriMachina मध्ये पुन्हा स्वागत आहे!',
    welcomeNew: (name) => `AgriMachina मध्ये स्वागत आहे, ${name}! 🌾`
  },
  te: {
    portalBadge: 'రైతు ప్రాధాన్యత పోర్టల్',
    welcomeTitle: 'AgriMachina కు స్వాగతం',
    registerTitle: 'రైతు ఖాతా సృష్టించండి',
    welcomeSubtitle: 'మీ వ్యవసాయ యంత్ర ఆర్డర్లు, సబ్సిడీ మరియు 0% EMI కోసం లాగిన్ అవ్వండి.',
    registerSubtitle: 'ప్రభుత్వ సబ్సిడీ, లైవ్ GPS ట్రాకింగ్ మరియు వారంటీ కోసం రిజిస్టర్ అవ్వండి.',
    benefitTracking: 'లైవ్ GPS ట్రాకింగ్',
    benefitSubsidy: '0% వడ్డీ EMI & సబ్సిడీ',
    benefitInvoice: 'GST టాక్స్ ఇన్వాయిస్',
    tabSignIn: 'లాగిన్',
    tabRegister: 'కొత్త రైతు (రిజిస్టర్)',
    nameLabel: 'రైతు పూర్తి పేరు *',
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
    welcomeBack: 'AgriMachina కు తిరిగి స్వాగతం!',
    welcomeNew: (name) => `AgriMachina కు స్వాగతం, ${name}! 🌾`
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
  const [farmType, setFarmType] = useState('Cotton & Sugarcane');
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
    const hasDismissed = sessionStorage.getItem('agri_welcome_auth_dismissed');

    if (!isAuthenticated && !authLoading && !hasDismissed) {
      // ⏳ Exact 10 seconds delay as requested by user
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading, location.pathname]);

  const handleClose = () => {
    sessionStorage.setItem('agri_welcome_auth_dismissed', 'true');
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
          password,
          farmDetails: {
            farmType,
            farmSizeAcres: 5,
            state: 'Uttar Pradesh'
          }
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

      sessionStorage.setItem('agri_welcome_auth_dismissed', 'true');
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
        className="modal-content"
        style={{
          maxWidth: '560px',
          width: '100%',
          borderRadius: '24px',
          padding: '2rem 1.75rem',
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px -12px rgba(6, 36, 22, 0.4), 0 0 0 1px rgba(22, 101, 52, 0.15)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Close Button */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-surface-alt, #f1f5f9)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            color: 'var(--text-muted, #64748b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          className="hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95"
          title="Close (कट करें)"
        >
          <X size={18} />
        </button>

        {/* Welcome Header & Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #166534, #15803d)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 8px 20px rgba(22, 101, 52, 0.25)'
          }}>
            <Tractor size={28} />
          </div>

          <div className="flex items-center justify-center gap-1.5" style={{ marginBottom: '0.25rem' }}>
            <Sparkles size={15} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {txt.portalBadge}
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', color: 'var(--text-main)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
            {isRegister ? txt.registerTitle : txt.welcomeTitle}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.835rem', margin: 0 }}>
            {isRegister ? txt.registerSubtitle : txt.welcomeSubtitle}
          </p>
        </div>

        {/* Benefits Ribbon */}
        <div style={{
          background: 'var(--primary-50, #f0fdf4)',
          border: '1px solid var(--primary-100, #dcfce7)',
          borderRadius: '12px',
          padding: '0.6rem 0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.725rem',
          color: 'var(--primary-800, #14532d)',
          fontWeight: 700
        }}>
          <span className="flex items-center gap-1">
            <Truck size={13} color="#16a34a" /> {txt.benefitTracking}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} color="#16a34a" /> {txt.benefitSubsidy}
          </span>
          <span className="flex items-center gap-1">
            <Gift size={13} color="#16a34a" /> {txt.benefitInvoice}
          </span>
        </div>

        {/* Tab Switcher (Sign In vs Register) */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-alt, #f1f5f9)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: !isRegister ? 'var(--bg-surface, #ffffff)' : 'transparent',
              color: !isRegister ? 'var(--primary-600, #166534)' : 'var(--text-muted, #64748b)',
              boxShadow: !isRegister ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {txt.tabSignIn}
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: isRegister ? 'var(--bg-surface, #ffffff)' : 'transparent',
              color: isRegister ? 'var(--primary-600, #166534)' : 'var(--text-muted, #64748b)',
              boxShadow: isRegister ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {txt.tabRegister}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isRegister && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex items-center gap-1" style={{ fontSize: '0.785rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <UserIcon size={12} color="var(--primary-600)" />
                  <span>{txt.nameLabel}</span>
                </label>
                <input
                  type="text"
                  required={isRegister}
                  className="input-field"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
                  placeholder={txt.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex items-center gap-1" style={{ fontSize: '0.785rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <Phone size={12} color="var(--primary-600)" />
                  <span>{txt.phoneLabel}</span>
                </label>
                <input
                  type="tel"
                  required={isRegister}
                  className="input-field"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
                  placeholder={txt.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label flex items-center gap-1" style={{ fontSize: '0.785rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <Mail size={12} color="var(--primary-600)" />
              <span>{txt.emailLabel}</span>
            </label>
            <input
              type="email"
              required
              className="input-field"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
              placeholder={txt.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label flex items-center justify-between" style={{ fontSize: '0.785rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <span className="flex items-center gap-1">
                <Lock size={12} color="var(--primary-600)" />
                <span>{txt.passwordLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? txt.hide : txt.show}</span>
              </button>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input-field"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
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
              borderRadius: '12px',
              padding: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              marginTop: '0.35rem',
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>{loading ? txt.btnLoading : isRegister ? txt.btnRegister : txt.btnSignIn}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Bottom Guest Dismiss Option */}
        <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #64748b)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            className="hover:text-green-700"
          >
            {txt.guestDismiss}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuthModal;

