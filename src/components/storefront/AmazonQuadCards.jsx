import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const quadCardsData = [
  {
    title: 'Starting ₹2,499 | Crop Spraying & Plant Protection',
    ctaText: 'Explore All Sprayers & Accessories',
    link: '/products?category=Sprayers+%26+Crop+Protection',
    items: [
      {
        name: '16L Battery Knapsack',
        priceTag: '₹3,499',
        image: '/images/machinery/sprayer.jpg',
        link: '/products?category=Sprayers+%26+Crop+Protection'
      },
      {
        name: 'Dual Motor High Pressure',
        priceTag: '₹4,899',
        image: '/images/machinery/sprayer.jpg',
        link: '/products?category=Sprayers+%26+Crop+Protection'
      },
      {
        name: 'Brass Telescopic Wand',
        priceTag: 'Under ₹799',
        image: '/images/machinery/sprayer.jpg',
        link: '/products?category=Sprayers+%26+Crop+Protection'
      },
      {
        name: 'Multi-Nozzle Set',
        priceTag: 'Under ₹499',
        image: '/images/machinery/sprayer.jpg',
        link: '/products?category=Sprayers+%26+Crop+Protection'
      }
    ]
  },
  {
    title: 'Up to 30% Off | Soil Preparation & Power Weeders',
    ctaText: 'See High-Torque Weeders',
    link: '/products?category=Power+Weeder+%26+Tiller',
    items: [
      {
        name: '7HP Petrol Weeder',
        priceTag: '₹38,499',
        image: '/images/machinery/power_weeder.jpg',
        link: '/products?category=Power+Weeder+%26+Tiller'
      },
      {
        name: '9HP Diesel Tiller',
        priceTag: '₹54,999',
        image: '/images/machinery/power_weeder.jpg',
        link: '/products?category=Power+Weeder+%26+Tiller'
      },
      {
        name: '32 Boron Steel Blades',
        priceTag: '₹2,899',
        image: '/images/machinery/power_weeder.jpg',
        link: '/products?category=Power+Weeder+%26+Tiller'
      },
      {
        name: 'Furrower / Ridger Set',
        priceTag: '₹3,200',
        image: '/images/machinery/power_weeder.jpg',
        link: '/products?category=Power+Weeder+%26+Tiller'
      }
    ]
  },
  {
    title: '0% No-Cost EMI | Solar Pumps & Clean Irrigation',
    ctaText: 'Discover Solar Irrigation',
    link: '/products?category=Pumps+%26+Irrigation',
    items: [
      {
        name: '5HP Solar Submersible',
        priceTag: '₹74,999',
        image: '/images/machinery/solar_pump.jpg',
        link: '/products?category=Pumps+%26+Irrigation'
      },
      {
        name: 'Smart MPPT Controller',
        priceTag: 'Included',
        image: '/images/machinery/solar_pump.jpg',
        link: '/products?category=Pumps+%26+Irrigation'
      },
      {
        name: 'Stainless Steel Motor',
        priceTag: 'Heavy Duty',
        image: '/images/machinery/solar_pump.jpg',
        link: '/products?category=Pumps+%26+Irrigation'
      },
      {
        name: 'Solar Panel Array (4kW)',
        priceTag: 'Available',
        image: '/images/machinery/solar_pump.jpg',
        link: '/products?category=Pumps+%26+Irrigation'
      }
    ]
  },
  {
    title: 'Govt. Subsidy Approved | Multi-Crop Harvesters',
    ctaText: 'View Harvesting Machinery',
    link: '/products?category=Harvesting+Machinery',
    items: [
      {
        name: '50cc Backpack Cutter',
        priceTag: '₹23,999',
        image: '/images/machinery/brush_cutter.jpg',
        link: '/products?category=Harvesting+Machinery'
      },
      {
        name: 'Paddy Crop Reaper',
        priceTag: '₹4,500',
        image: '/images/machinery/brush_cutter.jpg',
        link: '/products?category=Harvesting+Machinery'
      },
      {
        name: '80T Alloy Blade',
        priceTag: '₹899',
        image: '/images/machinery/brush_cutter.jpg',
        link: '/products?category=Harvesting+Machinery'
      },
      {
        name: 'Chainsaw Attachment',
        priceTag: '₹2,499',
        image: '/images/machinery/brush_cutter.jpg',
        link: '/products?category=Harvesting+Machinery'
      }
    ]
  }
];

const AmazonQuadCards = () => {
  const { tr } = useLanguage();

  return (
    <div className="container" style={{ margin: '2.5rem auto 3rem auto', position: 'relative', zIndex: 10 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quadCardsData.map((card, idx) => (
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
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, marginBottom: '1rem', minHeight: '2.8rem' }}>
                {tr(card.title)}
              </h3>

              {/* 4 Quadrants Grid */}
              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '1.25rem' }}>
                {card.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.link}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '105px',
                        background: 'var(--bg-surface-alt)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '0.35rem',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tr(item.name)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-600, #166534)', fontWeight: 800 }}>
                      {item.priceTag}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom link */}
            <Link
              to={card.link}
              className="flex items-center gap-1"
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: 'var(--primary-600, #166534)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
                textDecoration: 'none'
              }}
            >
              <span>{tr(card.ctaText)}</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmazonQuadCards;
