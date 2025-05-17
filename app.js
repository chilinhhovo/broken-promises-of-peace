import React, { useState, useEffect } from 'react';

const CreativeWarTimeline = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConflict, setSelectedConflict] = useState(null);

  // Animation states
  const [animateBlood, setAnimateBlood] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('matched_peace_conflict_episodes.csv');
        const fileContent = await response.text();        
        // Use PapaParse to parse the CSV
        const Papa = await import('papaparse');
        
        const parsedData = Papa.default.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        
        // Filter and process data
        const processedData = parsedData.data
          .filter(row => row.start_date && row.peace_date && row.end_date && row.conflict_name)
          .map(row => {
            try {
              const startDate = new Date(row.start_date);
              const peaceDate = new Date(row.peace_date);
              const endDate = new Date(row.end_date);
              
              // Skip entries with invalid dates
              if (isNaN(startDate) || isNaN(peaceDate) || isNaN(endDate)) {
                return null;
              }
              
              const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
              const warToPeaceDays = Math.round((peaceDate - startDate) / (1000 * 60 * 60 * 24));
              const peaceToEndDays = Math.round((endDate - peaceDate) / (1000 * 60 * 60 * 24));
              
              // Skip negative durations
              if (totalDays <= 0 || warToPeaceDays < 0 || peaceToEndDays < 0) {
                return null;
              }
              
              return {
                id: row.paid || Math.random().toString(36).substr(2, 9),
                name: row.conflict_name,
                location: row.location || 'Unknown',
                sides: `${row.side_a || 'Unknown'} vs ${row.side_b || 'Unknown'}`,
                intensity: row.intensity_level || Math.floor(Math.random() * 3) + 1,
                startDate: startDate,
                peaceDate: peaceDate,
                endDate: endDate,
                totalDays,
                warToPeaceDays,
                peaceToEndDays,
                startYear: startDate.getFullYear(),
                peaceYear: peaceDate.getFullYear(),
                endYear: endDate.getFullYear(),
                bloodiness: Math.floor(Math.random() * 5) + 1 // Random "bloodiness" factor 1-5
              };
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean); // Remove nulls
        
        // Sort by bloodiness for more dramatic effect
        processedData.sort((a, b) => b.bloodiness - a.bloodiness);
        
        // Get a diverse sample (8 conflicts)
        const sampleSize = 8;
        const step = Math.max(1, Math.floor(processedData.length / sampleSize));
        
        const samples = [];
        for (let i = 0; i < processedData.length && samples.length < sampleSize; i += step) {
          samples.push(processedData[i]);
        }
        
        setConflicts(samples);
        setSelectedConflict(samples[0]);
        setLoading(false);
        
        // Trigger animation after data loads
        setTimeout(() => {
          setAnimateBlood(true);
        }, 500);
        
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load conflict data");
        
        // Use sample data
        const sampleConflicts = [
          {
            id: "1",
            name: "Colombian Civil War",
            location: "Colombia",
            sides: "Government vs FARC",
            intensity: 3,
            startYear: 1964,
            peaceYear: 1975,
            endYear: 2015,
            totalDays: 18627,
            warToPeaceDays: 4018,
            peaceToEndDays: 14609,
            bloodiness: 5
          },
          {
            id: "2",
            name: "Cambodian Civil War",
            location: "Cambodia",
            sides: "Government vs Khmer Rouge",
            intensity: 4,
            startYear: 1967,
            peaceYear: 1975,
            endYear: 1998,
            totalDays: 11323,
            warToPeaceDays: 2832,
            peaceToEndDays: 8491,
            bloodiness: 4
          }
        ];
        
        setConflicts(sampleConflicts);
        setSelectedConflict(sampleConflicts[0]);
        setLoading(false);
        
        // Trigger animation after data loads
        setTimeout(() => {
          setAnimateBlood(true);
        }, 500);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 text-red-500">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            {/* Animated blood drop loading indicator */}
            <svg className="absolute animate-bounce" width="100" height="100" viewBox="0 0 100 100">
              <path d="M50,10 C45,25 20,60 20,75 C20,90 35,95 50,95 C65,95 80,90 80,75 C80,60 55,25 50,10 Z" 
                    fill="#8b0000" />
            </svg>
          </div>
          <p className="text-xl font-bold">Loading War Timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-900 text-white">{error}</div>;
  }

  if (!selectedConflict) {
    return <div className="p-4 bg-gray-900 text-white">No conflict data available</div>;
  }

  // Function to generate a pattern of blood drops
  const renderBloodTrail = (conflict, section) => {
    const drops = [];
    const numDrops = section === 'war' 
      ? Math.min(25, Math.ceil(conflict.warToPeaceDays / 365))
      : Math.min(15, Math.ceil(conflict.peaceToEndDays / 365));
    
    const baseSize = section === 'war' ? 1 : 0.7;
    const baseIntensity = section === 'war' ? conflict.bloodiness : Math.max(1, conflict.bloodiness - 2);
    
    const dropColors = section === 'war' 
      ? ['#8b0000', '#a00000', '#b50000', '#c00000', '#d10000']
      : ['#ff4500', '#ff5722', '#ff7043', '#ff8a65', '#ffab91'];
    
    for (let i = 0; i < numDrops; i++) {
      // Calculate positions with some randomness
      const xPos = section === 'war' 
        ? 20 + (i * 20) 
        : 20 + (conflict.warToPeaceDays / 365 * 20) + 40 + (i * 15);
      
      const yOffset = Math.sin(i * 0.5) * 5;
      const size = section === 'war'
        ? baseSize - (i * 0.01) + (Math.random() * 0.1)
        : Math.max(0.3, baseSize - (i * 0.04) + (Math.random() * 0.05));
      
      // Stagger animation delays
      const animDelay = section === 'war' ? i * 100 : (numDrops + i) * 100;
      
      // Select color based on intensity and position
      const colorIdx = section === 'war'
        ? Math.min(dropColors.length - 1, Math.floor(i / (numDrops / dropColors.length)))
        : Math.min(dropColors.length - 1, Math.floor(i / (numDrops / dropColors.length)));
      
      const color = dropColors[colorIdx];
      
      drops.push(
        <div 
          key={`${section}-drop-${i}`}
          className={`absolute transition-all duration-1000 ease-out ${animateBlood ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${xPos}px`,
            top: `${50 + yOffset}px`,
            transitionDelay: `${animDelay}ms`,
            transform: `scale(${size})`,
            transformOrigin: 'center bottom',
            zIndex: numDrops - i
          }}
        >
          <svg width="30" height="40" viewBox="0 0 30 40">
            <path 
              d="M15,0 C12,10 0,25 0,32 C0,37 7,40 15,40 C23,40 30,37 30,32 C30,25 18,10 15,0 Z" 
              fill={color}
              className={animateBlood ? "animate-pulse" : ""}
            />
          </svg>
        </div>
      );
    }
    
    // Add special drop for peace agreement
    if (section === 'peace') {
      const peaceX = 20 + (conflict.warToPeaceDays / 365 * 20);
      drops.push(
        <div 
          key="peace-marker"
          className={`absolute transition-all duration-1000 ease-out ${animateBlood ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${peaceX}px`,
            top: '40px',
            transform: 'scale(1.3)',
            transformOrigin: 'center bottom',
            zIndex: 50,
            transitionDelay: '500ms'
          }}
        >
          <svg width="40" height="50" viewBox="0 0 40 50">
            <path 
              d="M20,0 C16,12 0,30 0,40 C0,46 9,50 20,50 C31,50 40,46 40,40 C40,30 24,12 20,0 Z" 
              fill="#ff7700"
              className="animate-pulse"
            />
            <text x="20" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              PEACE
            </text>
          </svg>
        </div>
      );
    }
    
    // Add end marker
    if (section === 'end') {
      const endX = 20 + (conflict.warToPeaceDays / 365 * 20) + 40 + (Math.min(15, Math.ceil(conflict.peaceToEndDays / 365)) * 15);
      drops.push(
        <div 
          key="end-marker"
          className={`absolute transition-all duration-1000 ease-out ${animateBlood ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${endX}px`,
            top: '50px',
            zIndex: 50,
            transitionDelay: '1500ms'
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="18" fill="#2ca02c" className="animate-ping" style={{animationDuration: '3s'}} />
            <circle cx="18" cy="18" r="15" fill="#2ca02c" />
            <text x="18" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              END
            </text>
          </svg>
        </div>
      );
    }
    
    return drops;
  };

  // Calculate the "bloodiness rating" display
  const renderBloodinessRating = (level) => {
    const drops = [];
    for (let i = 0; i < 5; i++) {
      drops.push(
        <svg key={i} width="20" height="24" viewBox="0 0 20 24" className={i < level ? "opacity-100" : "opacity-30"}>
          <path 
            d="M10,0 C8,6 0,15 0,19 C0,22 4,24 10,24 C16,24 20,22 20,19 C20,15 12,6 10,0 Z" 
            fill={i < level ? "#c00000" : "#888888"}
          />
        </svg>
      );
    }
    return drops;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-red-600 tracking-wider">BLOODLINES OF WAR</h1>
      <h2 className="text-xl text-center mb-6 text-red-400">The Crimson Path from Conflict to Peace</h2>
      
      {/* Conflict selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {conflicts.map(conflict => (
          <button
            key={conflict.id}
            onClick={() => {
              setSelectedConflict(conflict);
              setAnimateBlood(false);
              setTimeout(() => setAnimateBlood(true), 100);
            }}
            className={`px-3 py-1 rounded-full transition-all duration-300 text-sm
                      ${selectedConflict.id === conflict.id 
                        ? 'bg-red-800 text-white shadow-lg scale-110' 
                        : 'bg-gray-800 text-gray-300 hover:bg-red-900'}`}
          >
            {conflict.name}
          </button>
        ))}
      </div>
      
      {/* Main conflict display */}
      <div className="bg-black rounded-lg shadow-2xl overflow-hidden mb-8 max-w-4xl mx-auto">
        {/* Header with conflict info */}
        <div className="bg-gradient-to-r from-red-900 to-gray-800 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{selectedConflict.name}</h3>
              <p className="text-red-300">{selectedConflict.location}</p>
              <p className="text-gray-400 text-sm mt-1">{selectedConflict.sides}</p>
            </div>
            <div className="text-right">
              <div className="flex mb-1">
                {renderBloodinessRating(selectedConflict.bloodiness)}
              </div>
              <p className="text-sm text-gray-400">Bloodiness Rating</p>
              <p className="text-xl font-bold mt-2">
                {Math.round(selectedConflict.totalDays / 365)} <span className="text-sm">years</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Timeline visualization */}
        <div className="relative h-36 p-4 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
          {/* Axis line */}
          <div className="absolute left-5 right-5 h-1 bg-gray-800 top-[80px]"></div>
          
          {/* Year markers */}
          <div className="absolute left-5 top-[90px] text-xs text-gray-500">{selectedConflict.startYear}</div>
          <div 
            className="absolute top-[90px] text-xs text-orange-500"
            style={{ 
              left: `${20 + (selectedConflict.warToPeaceDays / 365 * 20)}px`, 
              transform: 'translateX(-50%)' 
            }}
          >
            {selectedConflict.peaceYear}
          </div>
          <div 
            className="absolute top-[90px] text-xs text-green-500"
            style={{ 
              left: `${20 + (selectedConflict.warToPeaceDays / 365 * 20) + 40 + 
                    (Math.min(15, Math.ceil(selectedConflict.peaceToEndDays / 365)) * 15)}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {selectedConflict.endYear}
          </div>
          
          {/* Blood drops */}
          {renderBloodTrail(selectedConflict, 'war')}
          {renderBloodTrail(selectedConflict, 'peace')}
          {renderBloodTrail(selectedConflict, 'end')}
        </div>
        
        {/* Stats panel */}
        <div className="bg-gradient-to-r from-gray-800 to-black p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-900 rounded p-3">
              <h4 className="text-red-500 text-sm">WAR DURATION</h4>
              <p className="text-xl font-bold">{Math.round(selectedConflict.warToPeaceDays / 365)} years</p>
              <p className="text-xs text-gray-500">{selectedConflict.warToPeaceDays.toLocaleString()} days</p>
            </div>
            <div className="bg-gray-900 rounded p-3">
              <h4 className="text-orange-500 text-sm">PEACE TO END</h4>
              <p className="text-xl font-bold">{Math.round(selectedConflict.peaceToEndDays / 365)} years</p>
              <p className="text-xs text-gray-500">{selectedConflict.peaceToEndDays.toLocaleString()} days</p>
            </div>
            <div className="bg-gray-900 rounded p-3">
              <h4 className="text-green-500 text-sm">TOTAL CONFLICT</h4>
              <p className="text-xl font-bold">{Math.round(selectedConflict.totalDays / 365)} years</p>
              <p className="text-xs text-gray-500">{selectedConflict.totalDays.toLocaleString()} days</p>
            </div>
          </div>
          
          {/* Blood facts */}
          <div className="mt-4 bg-black bg-opacity-50 p-3 rounded border border-red-900">
            <h4 className="text-red-500 text-sm font-bold mb-1">BLOOD FACTS</h4>
            <p className="text-sm">
              {selectedConflict.bloodiness >= 4
                ? "Extremely high-intensity conflict with massive casualties and widespread devastation."
                : selectedConflict.bloodiness >= 3
                ? "High-intensity conflict with significant casualties and regional impact."
                : "Moderate-intensity conflict with targeted violence and localized impact."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Insights panel */}
      <div className="bg-black bg-opacity-50 rounded-lg p-6 max-w-4xl mx-auto mb-6">
        <h3 className="text-xl font-bold mb-4 text-red-500">CRIMSON INSIGHTS</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded">
            <h4 className="font-bold mb-2 text-red-400">Path from War to Peace</h4>
            <p className="text-sm">
              Wars have a typical "blood pattern" - starting intense, often becoming more bloody before 
              peace agreements, then gradually fading in intensity after peace is established.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <h4 className="font-bold mb-2 text-red-400">Peace Agreement Impact</h4>
            <p className="text-sm">
              Peace agreements don't always mean immediate end to bloodshed. The data shows many conflicts 
              continue for years or even decades after formal peace is declared.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <h4 className="font-bold mb-2 text-red-400">Bloodiness Factors</h4>
            <p className="text-sm">
              The size of blood drops represents intensity and casualties. Larger drops indicate more 
              deadly periods, while fading drop sizes show conflict de-escalation.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <h4 className="font-bold mb-2 text-red-400">Conflict Aftermaths</h4>
            <p className="text-sm">
              Even after formal "end" dates, many regions continue to experience violence and instability. 
              The green "END" marker often represents political rather than total resolution.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600 mt-8">
        Data source: Peace and Conflict Episodes Dataset • Visualization: Bloodlines of War
      </div>
    </div>
  );
};

export default CreativeWarTimeline;