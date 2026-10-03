import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const collectionsData = [
  {
    title: 'Pure Spices & Gourmet Masale',
    subtitle: 'From ₹145 • 100% Lab-Tested Purity',
    badge: 'ORGANIC CERTIFIED',
    badgeColor: '#16a34a',
    ctaText: 'Explore Spices Collection',
    link: '/products?category=Spices+%26+Masale',
    items: [
      {
        name: 'Kashmiri Grade-1 Saffron (1g)',
        priceTag: '₹399',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
        link: '/products?category=Spices+%26+Masale'
      },
      {
        name: 'Pure Lakadong Turmeric (500g)',
        priceTag: '₹189',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
        link: '/products?category=Spices+%26+Masale'
      },
      {
        name: 'Royal Shahi Garam Masala',
        priceTag: '₹145',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
        link: '/products?category=Spices+%26+Masale'
      },
      {
        name: 'Malabar Green Cardamom',
        priceTag: '₹299',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
        link: '/products?category=Spices+%26+Masale'
      }
    ]
  },
  {
    title: 'Smart Tech & Acoustic Audio',
    subtitle: 'Up to 45% Off • Brand Warranty',
    badge: 'NEW GENERATION',
    badgeColor: '#2563eb',
    ctaText: 'Discover Smart Tech',
    link: '/products?category=Electronics+%26+Smart+Tech',
    items: [
      {
        name: 'UltraSound ANC Earbuds',
        priceTag: '₹1,899',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
        link: '/products?category=Electronics+%26+Smart+Tech'
      },
      {
        name: 'AMOLED Smart Fitness Watch',
        priceTag: '₹2,299',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        link: '/products?category=Electronics+%26+Smart+Tech'
      },
      {
        name: '65W GaN Fast Charger Block',
        priceTag: '₹999',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
        link: '/products?category=Electronics+%26+Smart+Tech'
      },
      {
        name: 'Smart Ambient WiFi LED Strip',
        priceTag: 'Under ₹699',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
        link: '/products?category=Electronics+%26+Smart+Tech'
      }
    ]
  },
  {
    title: 'Luxury Home Decor & Living',
    subtitle: 'Handcrafted Accents • Premium Finish',
    badge: 'ARTISAN LUXURY',
    badgeColor: '#d97706',
    ctaText: 'Browse Home Decor',
    link: '/products?category=Home+Decor+%26+Living',
    items: [
      {
        name: 'Ceramic Ambient Table Lamp',
        priceTag: '₹2,499',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
        link: '/products?category=Home+Decor+%26+Living'
      },
      {
        name: 'Nordic Minimalist Vase Set',
        priceTag: '₹899',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80',
        link: '/products?category=Home+Decor+%26+Living'
      },
      {
        name: 'Silent Modern Quartz Wall Clock',
        priceTag: '₹1,199',
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80',
        link: '/products?category=Home+Decor+%26+Living'
      },
      {
        name: 'Soy Wax Scented Candles (4-Pack)',
        priceTag: 'Under ₹499',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80',
        link: '/products?category=Home+Decor+%26+Living'
      }
    ]
  },
  {
    title: 'Kitchen & Power Tools',
    subtitle: '0% No-Cost EMI • Copper Motors',
    badge: 'HEAVY DUTY',
    badgeColor: '#0284c7',
    ctaText: 'View Kitchen & Tools',
    link: '/products?category=Kitchen+%26+Home+Appliances',
    items: [
      {
        name: '1000W Copper Mixer Grinder',
        priceTag: '₹3,499',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80',
        link: '/products?category=Kitchen+%26+Home+Appliances'
      },
      {
        name: 'Digital Touch 4.5L Air Fryer',
        priceTag: '₹4,299',
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
        link: '/products?category=Kitchen+%26+Home+Appliances'
      },
      {
        name: 'Double-Wall Stainless Kettle',
        priceTag: '₹899',
        image: 'https://images.unsplash.com/photo-1594213114663-ddf4f24cf707?w=400&q=80',
        link: '/products?category=Kitchen+%26+Home+Appliances'
      },
      {
        name: '108-Piece Home DIY Tool Kit',
        priceTag: '₹1,499',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
        link: '/products?category=Hardware+%26+Power+Tools'
      }
    ]
  }
];

const AmazonQuadCards = () => {
  const { tr } = useLanguage();

  return (
    <section className="container" style={{ margin: '2.5rem auto 3.5rem auto', position: 'relative', zIndex: 10 }}>
      {/* Section Header */}
      <div className="flex justify-between items-end" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#166534',
                background: 'rgba(22, 101, 52, 0.08)',
                padding: '0.18rem 0.55rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={11} color="#d4af37" />
              <span>Curated Collections</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
            Featured Department Showcases
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Handpicked premium essentials with verified authenticity and manufacturer warranty.
          </p>
        </div>

        <Link
          to="/products"
          className="flex items-center gap-1.5"
          style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            color: 'var(--primary-600, #166534)',
            textDecoration: 'none'
          }}
        >
          <span>Explore All Departments</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 4 Luxury Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {collectionsData.map((col, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
            className="hover:shadow-lg hover:-translate-y-1"
          >
            <div>
              {/* Card Header with Category Tag */}
              <div className="flex justify-between items-center" style={{ marginBottom: '0.45rem' }}>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: col.badgeColor,
                    background: `${col.badgeColor}15`,
                    padding: '0.12rem 0.45rem',
                    borderRadius: '4px'
                  }}
                >
                  {col.badge}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  4 Items
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, marginBottom: '0.2rem' }}>
                {tr(col.title)}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {col.subtitle}
              </p>

              {/* 4-Item Grid */}
              <div className="grid grid-cols-2 gap-2.5" style={{ marginBottom: '1rem' }}>
                {col.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.link}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                    className="group"
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '105px',
                        background: 'linear-gradient(180deg, var(--bg-surface-alt, #f8fafc) 0%, var(--bg-surface, #ffffff) 100%)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      className="group-hover:border-emerald-600"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease',
                          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))'
                        }}
                        className="group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '0.15rem'
                      }}
                      title={item.name}
                    >
                      {tr(item.name)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-600, #166534)', fontWeight: 800 }}>
                      {item.priceTag}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Explore Link */}
            <Link
              to={col.link}
              className="flex items-center justify-between"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary-600, #166534)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
                textDecoration: 'none'
              }}
            >
              <span>{tr(col.ctaText)}</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AmazonQuadCards;
