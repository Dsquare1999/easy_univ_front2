'use client'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useEffect, useState } from 'react';
import { MatiereEntity, ProgramEntity } from '@/core/domain/entities/classe.entity';

interface CalendarProps {
    matieres: MatiereEntity[];
}
interface EventState {
    title: string;
    start: string;
    end: string;
    color: string;
    textColor: string;
}

const Calendar = ({ matieres }: CalendarProps) => {
  const [events, setEvents] = useState<EventState[]>([]);

  const generateRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (matieres && matieres.length > 0) {
      let events: EventState[] = [];
      matieres.forEach((matiere: MatiereEntity) => {
        const colorCode = generateRandomColor(); 
        
        if (matiere.programs && matiere.programs.length > 0) {
          matiere.programs.forEach((program: ProgramEntity) => {
            const startDateTime = `${program.day}T${program.h_begin}`;
            const endDateTime = `${program.day}T${program.h_end}`;

            events.push({
              title: matiere.name,
              start: startDateTime,
              end: endDateTime,
              color: colorCode, 
              textColor: '#000000',
            });
          });
        }
      });
      setEvents(events);
    }
  }, [matieres]);

  const handleDateClick = (info: any) => {
    alert('Date clicked: ' + info.dateStr);
  };

  return (
    <div id='wrap'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        events={events}
        dateClick={handleDateClick}
        editable={true}
        selectable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </div>
  );
};

export default Calendar;
