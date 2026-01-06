import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, Upload, Heart, Star, Moon, Sun, Share2, Search, Palette, Award } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function HappyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [happyMoments, setHappyMoments] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('pastel');
  const [showThemes, setShowThemes] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const calendarRef = useRef(null);

  const themes = {
    pastel: {
      name: 'Pastel Dreams',
      bg: '#FFF6E5',
      bgDark: '#2D2A26',
      cardColors: [
        { bg: '#E6F9FF', border: '#67CFE3', bgDark: '#1A3A44', borderDark: '#2B5A6A' },
        { bg: '#FFF9CC', border: '#F2C94C', bgDark: '#3A3620', borderDark: '#5A5230' },
        { bg: '#FFE4E6', border: '#F6A5B5', bgDark: '#3A2228', borderDark: '#5A3238' },
      ],
      empty: { bg: '#F7F7F7', border: '#E0E0E0', bgDark: '#3A3A3A', borderDark: '#4A4A4A' },
      primary: '#FF7DAF',
      primaryDark: '#FF9FBF',
      button: '#FF9FBF',
      buttonText: '#8A1C3A',
    },
    lavender: {
      name: 'Lavender Fields',
      bg: '#F3F0FF',
      bgDark: '#2A2633',
      cardColors: [
        { bg: '#E9D5FF', border: '#C084FC', bgDark: '#3A2D4A', borderDark: '#5A4D7A' },
        { bg: '#DBEAFE', border: '#60A5FA', bgDark: '#1F3A4A', borderDark: '#2F5A7A' },
        { bg: '#FCE7F3', border: '#F472B6', bgDark: '#3A2838', borderDark: '#5A3858' },
      ],
      empty: { bg: '#F5F5F5', border: '#D1D5DB', bgDark: '#383838', borderDark: '#484848' },
      primary: '#A855F7',
      primaryDark: '#C084FC',
      button: '#C084FC',
      buttonText: '#581C87',
    },
    mint: {
      name: 'Mint Fresh',
      bg: '#F0FDF4',
      bgDark: '#1F2D24',
      cardColors: [
        { bg: '#D1FAE5', border: '#6EE7B7', bgDark: '#2A4037', borderDark: '#3A6047' },
        { bg: '#FEF3C7', border: '#FCD34D', bgDark: '#3A3620', borderDark: '#5A5630' },
        { bg: '#E0F2FE', border: '#7DD3FC', bgDark: '#1A3544', borderDark: '#2A5564' },
      ],
      empty: { bg: '#F9FAFB', border: '#D1D5DB', bgDark: '#3A3A3A', borderDark: '#4A4A4A' },
      primary: '#10B981',
      primaryDark: '#34D399',
      button: '#6EE7B7',
      buttonText: '#065F46',
    },
    peachy: {
      name: 'Peachy Keen',
      bg: '#FFF7ED',
      bgDark: '#2D2620',
      cardColors: [
        { bg: '#FFEDD5', border: '#FDBA74', bgDark: '#3A3020', borderDark: '#5A5030' },
        { bg: '#FEE2E2', border: '#FCA5A5', bgDark: '#3A2222', borderDark: '#5A3232' },
        { bg: '#FEF9C3', border: '#FDE047', bgDark: '#3A3720', borderDark: '#5A5730' },
      ],
      empty: { bg: '#FAFAF9', border: '#E7E5E4', bgDark: '#3A3835', borderDark: '#4A4845' },
      primary: '#F97316',
      primaryDark: '#FB923C',
      button: '#FDBA74',
      buttonText: '#9A3412',
    },
  };

  const theme = themes[currentTheme];

  useEffect(() => {
    const stored = localStorage.getItem('happyMoments');
    if (stored) {
      setHappyMoments(JSON.parse(stored));
    }
    const storedTheme = localStorage.getItem('happyTheme');
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    }
    const storedDarkMode = localStorage.getItem('happyDarkMode');
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('happyMoments', JSON.stringify(happyMoments));
  }, [happyMoments]);

  useEffect(() => {
    localStorage.setItem('happyTheme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('happyDarkMode', darkMode);
  }, [darkMode]);

  const achievements = [
    { id: 'first', name: 'First Step', description: 'Log your first happy moment', threshold: 1, icon: '🌟' },
    { id: 'week', name: 'Week Warrior', description: '7 days of happiness', threshold: 7, icon: '🔥' },
    { id: 'month', name: 'Monthly Master', description: '30 days of joy', threshold: 30, icon: '🏆' },
    { id: 'streak', name: 'Streak Star', description: '5 days in a row', threshold: 5, icon: '⭐' },
    { id: 'century', name: 'Centurion', description: '100 happy moments', threshold: 100, icon: '💯' },
  ];

  const getAchievements = () => {
    const count = Object.keys(happyMoments).length;
    const earned = [];
    
    if (count >= 1) earned.push(achievements[0]);
    if (count >= 7) earned.push(achievements[1]);
    if (count >= 30) earned.push(achievements[2]);
    if (count >= 100) earned.push(achievements[4]);
    
    const dates = Object.keys(happyMoments).sort();
    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    if (maxStreak >= 5) earned.push(achievements[3]);
    
    return earned;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getCardColor = (day) => {
    return theme.cardColors[day % 3];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const { year, month } = getDaysInMonth(currentDate);
    const dateKey = formatDateKey(year, month, day);
    setSelectedDate(dateKey);
    setEditText(happyMoments[dateKey] || '');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      setHappyMoments({ ...happyMoments, [selectedDate]: editText });
    } else {
      const newMoments = { ...happyMoments };
      delete newMoments[selectedDate];
      setHappyMoments(newMoments);
    }
    setModalOpen(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(happyMoments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'happy-moments.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    if (!calendarRef.current) return;
    
    try {
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: darkMode ? theme.bgDark : theme.bg,
        scale: 2,
      });
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `happy-calendar-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      alert('Error exporting image. Please try again.');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setHappyMoments(imported);
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const filterMoments = () => {
    if (!searchQuery) return happyMoments;
    
    const filtered = {};
    Object.entries(happyMoments).forEach(([date, text]) => {
      if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[date] = text;
      }
    });
    return filtered;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const filteredMoments = filterMoments();

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square min-h-0" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const happyMoment = happyMoments[dateKey];
      const hasHappyMoment = !!happyMoment;
      const matchesSearch = !searchQuery || filteredMoments[dateKey];
      const color = getCardColor(day);
      const actualColor = darkMode ? { bg: color.bgDark, border: color.borderDark } : { bg: color.bg, border: color.border };
      
      // Get first few words of the message for preview
      const getMessagePreview = (text) => {
        if (!text) return '';
        // Take first 15-20 characters
        const preview = text.trim();
        if (preview.length <= 15) return preview;
        return preview.substring(0, 15) + '...';
      };
      
      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          style={{
            backgroundColor: actualColor.bg,
            borderColor: actualColor.border,
            opacity: searchQuery && !matchesSearch ? 0.3 : 1,
          }}
          className="aspect-square min-h-0 min-w-0 rounded-md border flex flex-col items-center justify-start p-0.5 md:p-1 transition-transform duration-150 hover:scale-102 relative"
        >
          <span className="text-[10px] font-medium mb-0.5 md:text-xs" style={{ color: darkMode ? '#E5E5E5' : '#333333' }}>
            {day}
          </span>
          
          {hasHappyMoment ? (
            <div className="flex-1 flex flex-col items-center justify-center w-full px-0.5">
              <Heart className="w-2 h-2 mb-0.5 md:w-3 md:h-3" style={{ 
                color: darkMode ? theme.primaryDark : theme.primary, 
                fill: darkMode ? theme.primaryDark : theme.primary 
              }} />
              <div className="text-[5px] md:text-[6px] text-center leading-tight w-full overflow-hidden" 
                   style={{ color: darkMode ? '#D1D5DB' : '#4B5563' }}>
                {getMessagePreview(happyMoment)}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[5px] text-gray-400 md:text-[6px]">
                +
              </span>
            </div>
          )}
          
          {/* Small indicator dot for long messages */}
          {hasHappyMoment && happyMoment.length > 20 && (
            <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full" 
                 style={{ backgroundColor: darkMode ? theme.primaryDark : theme.primary }} />
          )}
        </button>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7 gap-0.5 mb-1 md:gap-1 md:mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium text-[9px] md:text-xs" style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5 md:gap-1">
          {days}
        </div>
      </>
    );
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen p-2 md:p-4 lg:p-6" style={{ backgroundColor: darkMode ? theme.bgDark : theme.bg, transition: 'background-color 0.3s' }}>
      <div className="max-w-full mx-auto px-1 md:px-2">
        {/* Top Action Buttons - Mobile Optimized */}
        <div className="flex justify-end gap-1 mb-3 md:gap-2 md:mb-4">
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="p-1.5 rounded-md md:p-2 md:rounded-lg"
            style={{ backgroundColor: darkMode ? '#3A3A3A' : 'white', color: darkMode ? theme.primaryDark : theme.primary }}
            title="Achievements"
          >
            <Award className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="p-1.5 rounded-md md:p-2 md:rounded-lg"
            style={{ backgroundColor: darkMode ? '#3A3A3A' : 'white', color: darkMode ? theme.primaryDark : theme.primary }}
            title="Themes"
          >
            <Palette className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 rounded-md md:p-2 md:rounded-lg"
            style={{ backgroundColor: darkMode ? '#3A3A3A' : 'white', color: darkMode ? theme.primaryDark : theme.primary }}
            title="Search"
          >
            <Search className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-md md:p-2 md:rounded-lg"
            style={{ backgroundColor: darkMode ? '#3A3A3A' : 'white', color: darkMode ? theme.primaryDark : theme.primary }}
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-3 h-3 md:w-4 md:h-4" /> : <Moon className="w-3 h-3 md:w-4 md:h-4" />}
          </button>
        </div>

        {/* Themes Panel */}
        {showThemes && (
          <div className="mb-3 p-2 rounded-lg md:p-3 md:rounded-xl" style={{ backgroundColor: darkMode ? '#3A3A3A' : 'white' }}>
            <h3 className="font-bold mb-2 text-xs md:text-sm" style={{ color: darkMode ? theme.primaryDark : theme.primary }}>Choose Theme</h3>
            <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-2">
              {Object.entries(themes).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className="p-1.5 rounded border text-left md:p-2"
                  style={{
                    backgroundColor: darkMode ? t.bgDark : t.bg,
                    borderColor: currentTheme === key ? (darkMode ? t.primaryDark : t.primary) : 'transparent',
                  }}
                >
                  <div className="font-medium text-[10px] md:text-xs" style={{ color: darkMode ? t.primaryDark : t.primary }}>{t.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Panel */}
        {showAchievements && (
          <div className="mb-3 p-2 rounded-lg md:p-3 md:rounded-xl" style={{ backgroundColor: darkMode ? '#3A3A3A' : 'white' }}>
            <h3 className="font-bold mb-2 text-xs md:text-sm" style={{ color: darkMode ? theme.primaryDark : theme.primary }}>
              Achievements ({getAchievements().length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
              {achievements.map((ach) => {
                const earned = getAchievements().some(e => e.id === ach.id);
                return (
                  <div
                    key={ach.id}
                    className="p-1.5 rounded border md:p-2"
                    style={{
                      backgroundColor: earned ? (darkMode ? theme.cardColors[0].bgDark : theme.cardColors[0].bg) : (darkMode ? '#2A2A2A' : '#F5F5F5'),
                      borderColor: earned ? (darkMode ? theme.cardColors[0].borderDark : theme.cardColors[0].border) : 'transparent',
                      opacity: earned ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm md:text-base">{ach.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[10px] md:text-xs truncate" style={{ color: darkMode ? '#E5E5E5' : '#333333' }}>{ach.name}</div>
                        <div className="text-[8px] md:text-[10px] text-gray-500 truncate">{ach.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your happy moments..."
              className="w-full p-2 rounded-lg border text-xs md:p-3 md:text-sm"
              style={{
                backgroundColor: darkMode ? '#3A3A3A' : 'white',
                borderColor: darkMode ? '#4A4A4A' : '#E0E0E0',
                color: darkMode ? '#E5E5E5' : '#333333',
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-3 md:mb-4">
          <div className="flex items-center justify-center gap-1 mb-1 md:gap-2">
            <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#FFD700', fill: '#FFD700' }} />
            <h1 className="text-lg font-bold md:text-xl" style={{ color: darkMode ? theme.primaryDark : theme.primary }}>
              Happy Calendar
            </h1>
            <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#FFD700', fill: '#FFD700' }} />
          </div>
          <p className="text-xs mb-2 text-gray-600 dark:text-gray-400 md:text-sm">
            What made you happy today?
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-1 justify-center md:gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-0.5 px-2 py-1 rounded-md border text-[10px] md:gap-1 md:px-3 md:py-1.5 md:text-xs"
              style={{ backgroundColor: 'transparent', color: darkMode ? theme.primaryDark : theme.primary, borderColor: theme.button }}
            >
              <Download className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleExportImage}
              className="flex items-center gap-0.5 px-2 py-1 rounded-md border text-[10px] md:gap-1 md:px-3 md:py-1.5 md:text-xs"
              style={{ backgroundColor: 'transparent', color: darkMode ? theme.primaryDark : theme.primary, borderColor: theme.button }}
            >
              <Share2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span>Image</span>
            </button>
            
            <label className="flex items-center gap-0.5 px-2 py-1 rounded-md border text-[10px] md:gap-1 md:px-3 md:py-1.5 md:text-xs cursor-pointer"
              style={{ backgroundColor: 'transparent', color: darkMode ? theme.primaryDark : theme.primary, borderColor: theme.button }}>
              <Upload className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Calendar Container */}
        <div ref={calendarRef} className="rounded-lg shadow-sm p-2 mb-3 md:rounded-xl md:p-3 md:mb-4" style={{ backgroundColor: darkMode ? '#2A2A2A' : 'white' }}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <button
              onClick={handlePrevMonth}
              className="px-2 py-1 rounded-md text-[10px] md:px-3 md:py-1.5 md:text-xs flex items-center gap-0.5"
              style={{ backgroundColor: theme.button, color: theme.buttonText }}
            >
              <ChevronLeft className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            
            <h2 className="text-sm font-bold text-center md:text-base" style={{ color: darkMode ? theme.primaryDark : theme.primary }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="px-2 py-1 rounded-md text-[10px] md:px-3 md:py-1.5 md:text-xs flex items-center gap-0.5"
              style={{ backgroundColor: theme.button, color: theme.buttonText }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
            </button>
          </div>

          {/* Calendar Grid */}
          {renderCalendar()}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-2 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="rounded-lg p-3 max-w-full w-full max-h-[80vh] overflow-y-auto border md:rounded-xl md:p-4" style={{ 
            backgroundColor: darkMode ? '#2A2A2A' : 'white',
            borderColor: darkMode ? theme.cardColors[2].borderDark : theme.cardColors[2].border 
          }}>
            <h3 className="text-sm font-bold mb-1 md:text-base" style={{ color: darkMode ? theme.primaryDark : theme.primary }}>
              {selectedDate}
            </h3>
            <p className="text-xs mb-2 text-gray-600 dark:text-gray-400 md:text-sm">
              What made you happy today?
            </p>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Write your happy moment here..."
              className="w-full h-24 p-2 rounded border text-xs md:h-32 md:p-3 md:text-sm"
              style={{ 
                borderColor: darkMode ? theme.cardColors[2].borderDark : theme.cardColors[2].border,
                backgroundColor: darkMode ? theme.cardColors[2].bgDark : theme.cardColors[2].bg,
                color: darkMode ? '#E5E5E5' : '#333333',
              }}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium md:px-4 md:py-2 md:text-sm"
                style={{ backgroundColor: theme.button, color: theme.buttonText }}
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium md:px-4 md:py-2 md:text-sm"
                style={{ backgroundColor: darkMode ? '#3A3A3A' : '#F7F7F7', color: darkMode ? '#E5E5E5' : '#6B7280' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}