import { useState, useRef, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';

export default function FilterBar({
  onFilterChange = () => {},
  selectedCategories = [],
  priceRange = { min: 0, max: 500 },
}) {
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const { data: categories = [] } = useCategories();
  const categoryList = Array.isArray(categories) ? categories : (categories?.data ?? []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryToggle = (category) => {
    const sel = Array.isArray(selectedCategories) ? selectedCategories : [];
    const updated = sel.includes(category)
      ? sel.filter((c) => c !== category)
      : [...sel, category];
    onFilterChange({ selectedCategories: updated });
  };

  const handlePriceChange = (e, type) => {
    const newRange = { ...priceRange };
    newRange[type] = Number(e.target.value);
    onFilterChange({ priceRange: newRange });
  };

  const handleClearAll = () => {
    onFilterChange({
      selectedCategories: [],
      priceRange: { min: 0, max: 500 },
      dateRange: { start: '', end: '' },
    });
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem 0', borderBottom: '1px solid #e0e0e0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Categories Dropdown Menu */}
          <div style={{ position: 'relative', minWidth: '150px' }} ref={categoriesRef}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              style={{
                padding: '0.5rem 0.875rem',
                backgroundColor: showCategories ? '#E63946' : '#ffffff',
                color: showCategories ? '#ffffff' : '#333',
                border: `2px solid ${showCategories ? '#E63946' : '#333'}`,
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '140px',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!showCategories && el && el.style) {
                  el.style.borderColor = '#E63946';
                  el.style.color = '#E63946';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!showCategories && el && el.style) {
                  el.style.borderColor = '#333';
                  el.style.color = '#333';
                }
              }}
            >
              <span>Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
              <span style={{ transition: 'transform 0.3s ease', transform: showCategories ? 'rotate(180deg)' : 'rotate(0)', fontSize: '0.75rem' }}>
                ▼
              </span>
            </button>

            {/* Sliding Categories Menu */}
            {showCategories && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  left: 0,
                  minWidth: '200px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #E63946',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(230, 57, 70, 0.15)',
                  zIndex: 100,
                  animation: 'slideDown 0.3s ease-out',
                  maxHeight: '350px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ padding: '0.5rem' }}>
                  {categoryList.length === 0 ? (
                    <div style={{
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      color: '#666',
                      textAlign: 'center',
                    }}>
                      No categories found. Ask an admin to add categories.
                    </div>
                  ) : (
                    categoryList.map((category) => {
                      const catKey = category.id || category.name || category;
                      const catName = category.name || category;
                      const isSelected = Array.isArray(selectedCategories) && selectedCategories.includes(catName);
                      return (
                        <div
                          key={catKey}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleCategoryToggle(catName)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCategoryToggle(catName); } }}
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            backgroundColor: isSelected ? '#ffe0e0' : '#f9f9f9',
                            color: isSelected ? '#E63946' : '#333',
                            border: `2px solid ${isSelected ? '#E63946' : 'transparent'}`,
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? '600' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            marginBottom: '0.4rem',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            if (!isSelected && el && el.style) el.style.backgroundColor = '#f0f0f0';
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            if (!isSelected && el && el.style) el.style.backgroundColor = '#f9f9f9';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => handleCategoryToggle(catName)}
                            style={{
                              cursor: 'pointer',
                              accentColor: '#E63946',
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          <span>{catName}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>

          {/* Price Range */}
          <div style={{ minWidth: '220px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#E63946',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Price Range
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: `linear-gradient(to right, #E63946 0%, #E63946 ${(priceRange.min / 500) * 100}%, #e0e0e0 ${(priceRange.min / 500) * 100}%, #e0e0e0 100%)`,
                    outline: 'none',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
                <style>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #E63946;
                    cursor: pointer;
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #E63946;
                    cursor: pointer;
                    border: none;
                  }
                `}</style>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', minWidth: '45px' }}>
                ${priceRange.min}
              </span>
            </div>
          </div>

          <div style={{ minWidth: '220px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#E63946',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Max Price
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: `linear-gradient(to right, #E63946 0%, #E63946 ${(priceRange.max / 500) * 100}%, #e0e0e0 ${(priceRange.max / 500) * 100}%, #e0e0e0 100%)`,
                    outline: 'none',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', minWidth: '45px' }}>
                ${priceRange.max}
              </span>
            </div>
          </div>

          {/* Clear All Button */}
          <button
            onClick={handleClearAll}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: 'transparent',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#E63946';
              e.target.style.color = '#E63946';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.color = '#666';
            }}
          >
            ✕ Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

