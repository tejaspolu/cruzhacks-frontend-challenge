import './App.css';
import React, { useState, useEffect } from 'react';
import logoImg from './logo.svg';
import prevArrow from './prev_arrow.svg';
import nextArrow from './next_arrow.svg';
import { ToolTipController, Select } from 'react-tooltip-controller';

const LogoHeader = () => (
  <header className="App-header">
    <img src={logoImg} alt="Company logo" className='App-logo'></img>
  </header>
);

const Title = () => (
  <section>
    <h1 className="Title" data-tooltip-content="Hello World">Schedule</h1>
  </section>
);

const NavigationBox = ({ scheduleData, dateIndex, setDateIndex }) => {
  const navigateLeft = () => {
    if (dateIndex > 0) setDateIndex(dateIndex - 1);
  };

  const navigateRight = () => {
    if (dateIndex < scheduleData.length - 1) setDateIndex(dateIndex + 1);
  };

  return (
    <main className="Container">
      <Title />
      <div className="Row">
        <img src={prevArrow} alt="Previous" className='Nav-arrows' onClick={navigateLeft}></img>
        <div className="Content-Box">
          <DaySchedule events={scheduleData[dateIndex].events} date={scheduleData[dateIndex].date} />
        </div>
        <img src={nextArrow} alt="Next" className='Nav-arrows' onClick={navigateRight}></img>
      </div>
    </main>
  );
};

const Modal = ({ eventName }) => (
  <div className="tooltip-container">
    <h3 className="title">{eventName}</h3>
    <label>
      First Name:
      <input type="text" className="input-field"></input>
    </label>
    <label>
      Last Name:
      <input type="text" className="input-field"></input>
    </label>
    <label>
      Email:
      <input type="email" className="input-field"></input>
    </label>
    <label className="reminder">
      <input type="checkbox"></input>
      Receive an email reminder?
    </label>
    <button className="btn-register">Register</button>
  </div>
);

const DaySchedule = ({ events, date }) => {
  return (
    <div className="Day-schedule">
      <h2>{date}</h2>
      <table className="event-table">
        <tbody>
          {events.map((event, idx) => (
            <tr key={idx}>
              <td className="time">{event.time}</td>
              <td className="event">
                {event.clickable ? (
                  <ToolTipController detect="click" offsetX="center" offsetY={20} closeOnClick={false}>
                    <Select>
                      <span className="clickable">{event.name}</span>
                    </Select>
                    <Modal eventName={event.name} />
                  </ToolTipController>
                ) : (
                  <span>{event.name}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await fetch('https://schedule-yoyys2e5pq-uc.a.run.app/api/schedule');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setScheduleData(data.schedule);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <LogoHeader />
      <NavigationBox scheduleData={scheduleData} dateIndex={dateIndex} setDateIndex={setDateIndex} />
    </div>
  );
};

export default App;
