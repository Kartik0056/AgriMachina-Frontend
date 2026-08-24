import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  HelpCircle,
  Tractor,
  ShieldCheck,
  CreditCard,
  Truck,
  PhoneCall,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportedLanguages = [
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' }
];

const quickQuestions = {
  hi: [
    '0% No-Cost EMI kaise milegi?',
    'Cotton & Sugarcane ke liye best weeder?',
    'Govt. SMAM Subsidy kaise claim karein?',
    'Delivery kitne din me aayegi?',
    'Engine warranty aur spare parts?'
  ],
  en: [
    'How to get 0% No-Cost EMI?',
    'Best Power Weeder for cotton & sugarcane?',
    'How to claim Govt. SMAM Subsidy?',
    'Delivery timelines & tracking?',
    'Engine warranty & spare parts?'
  ],
  gu: [
    '0% No-Cost EMI કેવી રીતે મળશે?',
    'કપાસ અને શેરડી માટે શ્રેષ્ઠ પાવર વીડર?',
    'સરકારી સબસિડી કેવી રીતે મેળવવી?',
    'ડિલિવરી કેટલા દિવસમાં આવશે?'
  ],
  pa: [
    '0% No-Cost EMI ਕਿਵੇਂ ਮਿਲੇਗੀ?',
    'ਕਣਕ ਅਤੇ ਝੋਨੇ ਲਈ ਬੈਸਟ ਮਸ਼ੀਨਰੀ?',
    'ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਦਾ ਕੀ ਤਰੀਕਾ ਹੈ?',
    'ਡਿਲਿਵਰੀ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਆਵੇਗੀ?'
  ],
  mr: [
    '0% No-Cost EMI कशी मिळेल?',
    'कापूस आणि उसासाठी सर्वोत्तम वीडर?',
    'शासकीय सबसिडी कशी मिळवावी?',
    'डिलिव्हरी किती दिवसात होईल?'
  ],
  te: [
    '0% No-Cost EMI ఎలా పొందాలి?',
    'పత్తి మరియు చెరకు కోసం ఉత్తమ వీడర్ ఏది?',
    'ప్రభుత్వ సబ్సిడీ ఎలా పొందాలి?'
  ],
  ta: [
    '0% No-Cost EMI எப்படி பெறுவது?',
    'பருத்தி மற்றும் கரும்புக்கு சிறந்த களை எடுக்கும் கருவி எது?',
    'அரசு மானியம் பெறுவது எப்படி?'
  ],
  bn: [
    '0% No-Cost EMI কীভাবে পাব?',
    'চাষের জন্য সেরা পাওয়ার উইডার কোনটি?',
    'সরকারি ভর্তুকি কীভাবে পাওয়া যাবে?'
  ]
};

// Agricultural AI Knowledge Processor
const generateAgriculturalResponse = (input, lang) => {
  const query = input.toLowerCase();

  // 1. EMI & Financing Inquiries
  if (query.includes('emi') || query.includes('loan') || query.includes('installment') || query.includes('kist') || query.includes('किस्त') || query.includes('ऋण')) {
    if (lang === 'hi') {
      return {
        text: `💳 **0% No-Cost EMI Financing Jankari:**\n\n1. Aap hamari kisi bhi machinery ko **3 se 36 mahine ki aasan kishton (EMI)** par khareed sakte hain.\n2. **0% No-Cost EMI** SBI Kisan Credit Card, HDFC Agri Finance, ICICI Bank, Axis Bank aur Bajaj Finserv EMI Card par uplabdh hai.\n3. Checkout page par **"Kisan Equipment EMI"** select karke apna bank aur tenure chunein. Koi down-payment ki zaroorat nahi hai!`,
        actionLink: { label: 'Explore 0% EMI Machines', url: '/products' }
      };
    } else if (lang === 'gu') {
      return {
        text: `💳 **0% No-Cost EMI માહિતી:**\n\nતમે કોઈપણ મશીનરી **3 થી 36 મહિનાની સરળ EMI** પર ખરીદી શકો છો. SBI કિસાન કાર્ડ, HDFC, ICICI અને Bajaj Finserv પર 0% વ્યાજની સુવિધા ઉપલબ્ધ છે. ચેકઆઉટ વખતે EMI વિકલ્પ પસંદ કરો.`,
        actionLink: { label: 'મશીનરી જુઓ', url: '/products' }
      };
    } else if (lang === 'pa') {
      return {
        text: `💳 **0% No-Cost EMI ਜਾਣਕਾਰੀ:**\n\nਤੁਸੀਂ ਕੋਈ ਵੀ ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨ **3 ਤੋਂ 36 ਮਹੀਨੇ ਦੀਆਂ ਆਸਾਨ ਕਿਸ਼ਤਾਂ** 'ਤੇ ਲੈ ਸਕਦੇ ਹੋ। SBI ਕਿਸਾਨ ਕਾਰਡ, HDFC ਅਤੇ Bajaj Finserv 'ਤੇ 0% ਵਿਆਜ ਦੀ ਸਹੂਲਤ ਹੈ।`,
        actionLink: { label: 'ਮਸ਼ੀਨਾਂ ਦੇਖੋ', url: '/products' }
      };
    } else {
      return {
        text: `💳 **0% No-Cost EMI Financing Overview:**\n\n1. Avail **3 to 36 months flexible installments** on all equipment.\n2. Supported by **SBI Kisan Credit Card, HDFC Agri Finance, ICICI, Axis Bank, and Bajaj Finserv** with zero down-payment.\n3. Simply choose *"Kisan Equipment EMI"* during checkout to select your bank and tenure.`,
        actionLink: { label: 'Browse EMI Machinery', url: '/products' }
      };
    }
  }

  // 2. Power Weeder / Tiller Recommendations
  if (query.includes('weeder') || query.includes('tiller') || query.includes('cultivat') || query.includes('cotton') || query.includes('sugarcane') || query.includes('कपास') || query.includes('गन्ना') || query.includes('निंदाई')) {
    if (lang === 'hi') {
      return {
        text: `🌱 **Power Weeder & Tiller Recommendation:**\n\n• **Cotton, Ganna (Sugarcane), Sabziyon ke liye:** Hamara **7HP 4-Stroke Petrol Weeder (AV-708)** sabse best hai (₹38,499). Isme 32 Boron steel blades hain jo 3 se 8 inch gehraai tak jhad-jhankhar saaf karte hain.\n• **Bhari Mitti (Heavy Black Soil) ke liye:** **9HP Diesel Power Tiller** lein jo high-torque ke sath deep rotary tilling karta hai.`,
        actionLink: { label: 'View 7HP Power Weeder (AV-708)', url: '/products?category=Power+Weeder+%26+Tiller' }
      };
    } else {
      return {
        text: `🌱 **Power Weeder & Tiller Guidance:**\n\n• **For Cotton, Sugarcane & Row Crops:** The **7HP 4-Stroke Petrol Weeder (AV-708)** at ₹38,499 is our top-rated machine featuring 32 Boron steel blades and 2 forward + 1 reverse gears.\n• **For Heavy Black Clay Soil:** Choose the **9HP Heavy Diesel Tiller** for maximum continuous torque.`,
        actionLink: { label: 'Explore Power Weeders', url: '/products?category=Power+Weeder+%26+Tiller' }
      };
    }
  }

  // 3. Solar Water Pumps & Irrigation
  if (query.includes('solar') || query.includes('pump') || query.includes('pani') || query.includes('borewell') || query.includes('motor') || query.includes('सोलर') || query.includes('पंप')) {
    return {
      text: `☀️ **Solar Submersible Pump Overview:**\n\n• **5HP DC Brushless Solar Pump Set:** 35,000 Liters/Hour high discharge deta hai aur 120 meters (400 feet) tak deep borewell se paani nikalta hai.\n• Isme **Smart MPPT Controller** aur dry-run protection shamil hai. Agle 25 saal tak ₹0 electricity bill!`,
      actionLink: { label: 'View Solar Pump Sets', url: '/products?category=Pumps+%26+Irrigation' }
    };
  }

  // 4. Govt Subsidy
  if (query.includes('subsidy') || query.includes('smam') || query.includes('dbt') || query.includes('sarkari') || query.includes('सब्सीडी') || query.includes('अनुदान')) {
    return {
      text: `🏛️ **Govt. SMAM / DBT Subsidy Assistance:**\n\n• Hamari sabhi machines central & state **SMAM / DBT Agriculture Subsidy** ke antargat approved hain (40% se 50% subsidy eligible).\n• Order complete hote hi hum aapko **Authorized GST Commercial Tax Invoice** engine aur chassis number ke sath bhejte hain jise aap apne rajya ke agriculture portal (e.g. DBT Agri, Kisan Portal) par upload karke subsidy claim kar sakte hain.`,
      actionLink: { label: 'Contact Subsidy Expert', url: '/contact' }
    };
  }

  // 5. Delivery & Shipping
  if (query.includes('delivery') || query.includes('shipping') || query.includes('track') || query.includes('kab') || query.includes('time') || query.includes('डिलीवरी')) {
    return {
      text: `🚚 **Free Palletized Farm Delivery:**\n\n• Hum pure Bharat (all pincodes) me **100% FREE Farm Delivery** dete hain.\n• Machine wooden crate packing me hydraulic truck dwara **4 se 7 business days** me sidhe aapke khet ya ghar ke gate tak pahunchai jaati hai.\n• Order dispatch hone par aapko live Lorry Receipt (LR) tracking number SMS aur WhatsApp par milta hai.`,
      actionLink: { label: 'Track Your Orders', url: '/orders' }
    };
  }

  // 6. Warranty & Spare Parts
  if (query.includes('warranty') || query.includes('guarantee') || query.includes('part') || query.includes('service') || query.includes('वारंटी') || query.includes('खराब')) {
    return {
      text: `🛡️ **Warranty & 100% Genuine Spare Parts:**\n\n• Har machinery par **1-Year Comprehensive OEM Engine & Gearbox Warranty** milti hai.\n• Sabhi wearing spare parts (tilling blades, recoil starters, carburetors, drive belts, spray nozzles) hamare warehouse me 10 saal tak available rehte hain aur 24 ghante me dispatch hote hain.`,
      actionLink: { label: 'Kisan Support & Helpline', url: '/contact' }
    };
  }

  // 7. General Fallback with intelligent routing
  if (lang === 'hi') {
    return {
      text: `Namaste Kisan Bhai! 🙏 Main aapka **Kisan AI Assistant** hoon. \n\nAap mujhse **Power Weeders, Solar Pumps, Brush Cutters, 0% EMI Loan, Govt. Subsidy, Delivery Status, ya Engine Warranty** ke baare me kuch bhi pooch sakte hain. Neeche diye gaye options par click karein ya apna sawal likhein:`,
      actionLink: { label: 'Toll-Free Helpline: 1800-AGRI-FARM', url: '/contact' }
    };
  } else {
    return {
      text: `Hello Farmer Friend! 🙏 I am your **Kisan AI Assistant**.\n\nYou can ask me about **Power Weeders, Solar Water Pumps, Earth Augers, 0% No-Cost EMI, Govt. Subsidies, Delivery Timelines, or Spare Parts**. Feel free to click a suggestion below or type your question:`,
      actionLink: { label: 'Contact Agricultural Specialist', url: '/contact' }
    };
  }
};

const KisanAIChatbot = () => {
  const [isLauncherHovered, setIsLauncherHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste Kisan Bhai! 🙏 Main aapka 24x7 **Kisan AI Assistant** hoon. Main aapki bhasha me kheti ki machinery, 0% EMI loan, subsidy aur technical sawalon me madad kar sakta hoon. Kahiye, main aapki kya seva karoon?',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputVal;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const botResponse = generateAgriculturalResponse(text, currentLang);
      const newBotMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        actionLink: botResponse.actionLink,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Widget Launcher Button */}
      {!isOpen && (
        <div
          onMouseEnter={() => setIsLauncherHovered(true)}
          onMouseLeave={() => setIsLauncherHovered(false)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          {/* Tooltip Callout Badge (Appears smoothly ONLY on hover) */}
          <div
            onClick={() => setIsOpen(true)}
            style={{
              background: '#062416',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              border: '1px solid #166534',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: isLauncherHovered ? 1 : 0,
              transform: isLauncherHovered ? 'translateX(0) scale(1)' : 'translateX(12px) scale(0.92)',
              pointerEvents: isLauncherHovered ? 'auto' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🌱</span>
            <span>Kisan AI • Ask in Any Language!</span>
          </div>

          {/* Main Floating Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #125435, #16a34a)',
              color: '#ffffff',
              border: '2px solid #86efac',
              boxShadow: isLauncherHovered ? '0 15px 35px rgba(6, 36, 22, 0.5)' : '0 10px 25px rgba(6, 36, 22, 0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transform: isLauncherHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title="Open Free Kisan AI Chatbot"
          >
            <Bot size={28} color="#ffffff" />
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #ffffff'
              }}
            />
          </button>
        </div>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isMinimized ? '320px' : '400px',
            height: isMinimized ? '55px' : '560px',
            maxHeight: '90vh',
            maxWidth: 'calc(100vw - 32px)',
            background: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 25px 60px -10px rgba(6, 36, 22, 0.45), 0 0 0 1px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #062416, #166534)',
              color: '#ffffff',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #14532d'
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #86efac'
                }}
              >
                <Bot size={20} color="#fef08a" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.1 }}>
                  Kisan AI Specialist
                </div>
                <div style={{ fontSize: '0.7rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                  <span>24x7 Multilingual Farm Assistant</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Dropdown */}
              {!isMinimized && (
                <div className="flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '0.2rem 0.4rem' }}>
                  <Globe size={13} color="#86efac" />
                  <select
                    value={currentLang}
                    onChange={(e) => setCurrentLang(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {supportedLanguages.map(l => (
                      <option key={l.code} value={l.code} style={{ color: '#0f172a', background: '#ffffff' }}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Minimize / Maximize */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px' }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px' }}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  padding: '1rem',
                  overflowY: 'auto',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Advisor Notice */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} color="#16a34a" />
                  <span>Ask in Hindi, English, Punjabi, Gujarati, Marathi, or any Indian language.</span>
                </div>

                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '0.75rem 0.95rem',
                        borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: m.sender === 'user' ? '#166534' : '#ffffff',
                        color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                        border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        fontSize: '0.84rem',
                        lineHeight: 1.45,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {m.text}

                      {/* Action Button Link inside Bot Bubble */}
                      {m.actionLink && (
                        <div style={{ marginTop: '0.65rem' }}>
                          <Link
                            to={m.actionLink.url}
                            onClick={() => setIsOpen(false)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: '#f0fdf4',
                              border: '1px solid #86efac',
                              color: '#166534',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '6px',
                              textDecoration: 'none'
                            }}
                          >
                            <span>{m.actionLink.label}</span>
                            <ChevronRight size={13} />
                          </Link>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px', padding: '0 4px' }}>
                      {m.time}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', fontSize: '0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.45rem 0.75rem', borderRadius: '12px', width: 'fit-content' }}>
                    <Bot size={14} className="animate-spin" />
                    <span>Kisan AI is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Question Chips */}
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}
                className="no-scrollbar"
              >
                {(quickQuestions[currentLang] || quickQuestions['en']).map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.725rem',
                      color: '#1e293b',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    className="hover:bg-green-100 hover:text-green-900"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  padding: '0.75rem',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type your agricultural question..."
                  className="input-field"
                  style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem', borderRadius: '24px', flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: inputVal.trim() ? '#166534' : '#cbd5e1',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputVal.trim() ? 'pointer' : 'default',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default KisanAIChatbot;
