import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotSelectorProps {
  onSelectTimeSlot: (timeSlot: string) => void;
  selectedTimeSlot: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  onSelectTimeSlot,
  selectedTimeSlot
}) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate time slots based on current time
    const currentTime = new Date();
    const timeSlots = [];
    
    // Start from next available 15-minute slot
    const currentMinutes = currentTime.getMinutes();
    const roundedMinutes = Math.ceil(currentMinutes / 15) * 15;
    currentTime.setMinutes(roundedMinutes);
    currentTime.setSeconds(0);
    
    // Add 15 minutes to ensure first slot is at least 15 minutes from now
    currentTime.setMinutes(currentTime.getMinutes() + 15);
    
    // Generate 8 time slots (2 hours worth)
    for (let i = 0; i < 8; i++) {
      const slotTime = new Date(currentTime.getTime() + i * 15 * 60000);
      const formattedTime = slotTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      
      timeSlots.push(formattedTime);
    }
    
    setAvailableTimeSlots(timeSlots);
    
    // Auto-select first time slot if none selected
    if (!selectedTimeSlot && timeSlots.length > 0) {
      onSelectTimeSlot(timeSlots[0]);
    }
  }, [onSelectTimeSlot, selectedTimeSlot]);
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {availableTimeSlots.map((timeSlot) => (
        <button
          key={timeSlot}
          onClick={() => onSelectTimeSlot(timeSlot)}
          className={`
            flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${selectedTimeSlot === timeSlot
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
          `}
        >
          <Clock className={`h-4 w-4 mr-2 ${selectedTimeSlot === timeSlot ? 'text-white' : 'text-gray-500'}`} />
          {timeSlot}
        </button>
      ))}
    </div>
  );
};

export default TimeSlotSelector;