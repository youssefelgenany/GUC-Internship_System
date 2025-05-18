import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../App';
import jsPDF from 'jspdf';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaSignOutAlt, FaUsers, FaStickyNote, FaComments, FaCalendarAlt, FaCheckCircle, FaPlusCircle } from 'react-icons/fa';

export const dummyWorkshops = [
  {
    id: 1,
    title: 'CV & Resume Building',
    date: '2025-07-10',
    time: '18:00',
    description: 'Learn how to build a professional CV and resume that stands out to employers.',
    isLive: false,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    preRecorded: true,
  },
  {
    id: 2,
    title: 'Ace Your Online Interview',
    date: '2025-07-15',
    time: '20:00',
    description: 'Tips and tricks for acing online interviews, including body language and technical setup.',
    isLive: true,
    videoUrl: '',
    preRecorded: false,
  },
  {
    id: 3,
    title: 'Networking for Success',
    date: '2025-07-20',
    time: '17:00',
    description: 'How to network effectively and build professional relationships.',
    isLive: false,
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    preRecorded: true,
  },
  {
    id: 4,
    title: 'Personal Branding Online',
    date: '2025-07-25',
    time: '19:00',
    description: 'Build your personal brand on LinkedIn and other platforms.',
    isLive: true,
    videoUrl: '',
    preRecorded: false,
  },
  {
    id: 5,
    title: 'Interview Q&A',
    date: '2024-06-10',
    time: '16:00',
    description: 'Q&A with HR professionals about interviews.',
    isLive: false,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    preRecorded: true,
  },
  {
    id: 6,
    title: 'Workplace Etiquette',
    date: '2024-06-15',
    time: '15:00',
    description: 'Learn about professional etiquette in the workplace.',
    isLive: false,
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    preRecorded: true,
  },
  {
    id: 7,
    title: 'Career Planning Workshop',
    date: '2024-05-20',
    time: '14:00',
    description: 'Plan your career path and set achievable goals.',
    isLive: false,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    preRecorded: true,
  },
  {
    id: 8,
    title: 'Technical Interview Preparation',
    date: '2024-05-25',
    time: '13:00',
    description: 'Prepare for technical interviews with coding challenges and system design questions.',
    isLive: false,
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    preRecorded: true,
  }
];

const getWorkshopDateTime = (ws) => new Date(ws.date + 'T' + ws.time);

const dummyParticipants = [
  { name: 'You', avatar: null },
  { name: 'Salma', avatar: null },
  { name: 'Omar', avatar: null },
  { name: 'Nourhan', avatar: null },
];

const liveStreamUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Simulated live stream video

const CareerWorkshop = ({ registrations, setRegistrations, attendedWorkshops, setAttendedWorkshops, certificates, setCertificates }) => {
  const { user } = useAuth();
  const userEmail = user?.email || 'student@guc.edu.eg';
  const userName = user?.fullName || 'You';
  // State per workshop per user
  const [notes, setNotes] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [notification, setNotification] = useState('');
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);
  // Live call controls
  const [liveJoined, setLiveJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [liveStartTime, setLiveStartTime] = useState(null);
  const liveVideoRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [unreadChat, setUnreadChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notesSaving, setNotesSaving] = useState({});
  const [notesSaved, setNotesSaved] = useState({});
  const notesTimers = useRef({});
  // Add state for active tab
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const initialRegistrations = {
      5: true, 
      6: true, 
      7: true, 
      8: true, 
      1: true, 
      2: true, 
    };
    setRegistrations(initialRegistrations);

    // Set some workshops as attended
    const initialAttended = [5, 6, 7, 8]; // Past workshops
    setAttendedWorkshops(initialAttended);

    // Set certificates for attended workshops
    const initialCertificates = {
      5: true,
      6: true,
      7: true,
      8: true,
    };
    setCertificates(initialCertificates);
  }, []);

  // Helper: filter workshops
  const now = new Date();
  const registeredIds = Object.keys(registrations).filter(id => registrations[id]);
  const registeredWorkshops = dummyWorkshops.filter(ws => registeredIds.includes(ws.id.toString()));
  const upcomingRegistered = registeredWorkshops.filter(ws => getWorkshopDateTime(ws) > now && !attendedWorkshops.includes(ws.id));
  const attendedRegistered = registeredWorkshops.filter(ws => attendedWorkshops.includes(ws.id));
  const availableToRegister = dummyWorkshops.filter(ws => !registeredIds.includes(ws.id.toString()) && getWorkshopDateTime(ws) > now);

  // Notification for upcoming workshops
  useEffect(() => {
    const now = new Date();
    Object.keys(registrations).forEach(id => {
      const ws = dummyWorkshops.find(w => w.id === Number(id));
      if (ws) {
        const wsDate = getWorkshopDateTime(ws);
        const diff = wsDate - now;
        if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
          setNotification(`You have an upcoming workshop: ${ws.title} at ${ws.time} on ${ws.date}`);
        }
      }
    });
  }, [registrations]);

  // Notification for new chat messages (simulate from others)
  useEffect(() => {
    if (!selectedWorkshop) return;
    const wsId = selectedWorkshop.id;
    if (chatMessages[wsId] && chatMessages[wsId].length > 0) {
      const lastMsg = chatMessages[wsId][chatMessages[wsId].length - 1];
      if (lastMsg.sender !== 'You') {
        setNotification(`New message from ${lastMsg.sender} in ${selectedWorkshop.title}`);
      }
    }
  }, [chatMessages, selectedWorkshop]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedWorkshop]);

  // Timer for live
  useEffect(() => {
    let interval;
    if (liveJoined) {
      setLiveStartTime(Date.now());
      if (liveVideoRef.current) {
        liveVideoRef.current.currentTime = 0;
        liveVideoRef.current.play();
      }
      interval = setInterval(() => setLiveStartTime((t) => t), 1000);
    } else {
      if (liveVideoRef.current) liveVideoRef.current.pause();
    }
    return () => clearInterval(interval);
  }, [liveJoined]);

  // Pre-recorded video controls
  const handlePlayPreRecorded = () => {
    setPlaying(true);
    if (videoRef.current) videoRef.current.play();
  };
  const handlePausePreRecorded = () => {
    setPlaying(false);
    if (videoRef.current) videoRef.current.pause();
  };
  const handleStopPreRecorded = () => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleRegister = (ws) => {
    setRegistrations(prev => ({ ...prev, [ws.id]: true }));
    setNotification(`Registered for ${ws.title}`);
  };

  // Live call controls
  const handleJoinLive = () => {
    setLiveJoined(true);
    setPlaying(true);
    // Simulate a message from another attendee after 3s
    setTimeout(() => {
      setChatMessages(prev => {
        const wsId = selectedWorkshop.id;
        const msgs = prev[wsId] || [];
        return {
          ...prev,
          [wsId]: [...msgs, { sender: 'Salma', text: 'Hello everyone!', time: new Date().toLocaleTimeString() }]
        };
      });
    }, 3000);
  };
  const handleLeaveLive = () => {
    setLiveJoined(false);
    setPlaying(false);
  };
  const toggleMute = () => setIsMuted(m => !m);
  const toggleCamera = () => setCameraOn(c => !c);

  const handleSendChat = () => {
    if (chatInput.trim() && selectedWorkshop) {
      setChatMessages(prev => {
        const wsId = selectedWorkshop.id;
        const msgs = prev[wsId] || [];
        return {
          ...prev,
          [wsId]: [...msgs, { sender: 'You', text: chatInput, time: new Date().toLocaleTimeString() }]
        };
      });
      setChatInput('');
    }
  };

  const handleFeedbackSubmit = () => {
    if (!selectedWorkshop) return;
    setFeedbacks(prev => ({
      ...prev,
      [selectedWorkshop.id]: {
        rating: feedbacks[selectedWorkshop.id]?.rating || 0,
        feedback: feedbacks[selectedWorkshop.id]?.feedback || ''
      }
    }));
    setCertificates(prev => ({ ...prev, [selectedWorkshop.id]: true }));
    setShowCertificate(true);
    setNotification(`Certificate received for ${selectedWorkshop.title}`);
  };

  const handleDownloadCertificate = () => {
    if (!selectedWorkshop) return;
    const certText = `Certificate of Attendance\n\nThis certifies that ${user?.fullName || 'Student'} attended the workshop: ${selectedWorkshop.title} on ${selectedWorkshop.date} at ${selectedWorkshop.time}.`;
    const pdf = new jsPDF();
    pdf.setFontSize(22);
    pdf.text('Certificate of Attendance', 20, 30);
    pdf.setFontSize(16);
    pdf.text(`This certifies that`, 20, 50);
    pdf.setFontSize(18);
    pdf.text(`${user?.fullName || 'Student'}`, 20, 65);
    pdf.setFontSize(16);
    pdf.text(`attended the workshop:`, 20, 85);
    pdf.setFontSize(18);
    pdf.text(`${selectedWorkshop.title}`, 20, 100);
    pdf.setFontSize(16);
    pdf.text(`on ${selectedWorkshop.date} at ${selectedWorkshop.time}.`, 20, 120);
    pdf.save(`Certificate-${selectedWorkshop.title.replace(/\s+/g, '_')}.pdf`);
  };

  // Helper for feedback input
  const setFeedbackValue = (field, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [selectedWorkshop.id]: {
        ...prev[selectedWorkshop.id],
        [field]: value
      }
    }));
  };

  const getLiveElapsed = () => {
    if (!liveStartTime) return '00:00';
    const elapsed = Math.floor((Date.now() - liveStartTime) / 1000);
    const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const sec = String(elapsed % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  // Mark chat as read when opened
  useEffect(() => {
    if (showChat) setUnreadChat(false);
  }, [showChat]);

  // Set unread chat if a new message arrives and chat is closed
  useEffect(() => {
    if (!selectedWorkshop || showChat) return;
    const wsId = selectedWorkshop.id;
    if (chatMessages[wsId] && chatMessages[wsId].length > 0) {
      const lastMsg = chatMessages[wsId][chatMessages[wsId].length - 1];
      if (lastMsg.sender !== 'You') {
        setUnreadChat(true);
      }
    }
  }, [chatMessages, selectedWorkshop, showChat]);

  const handleNotesChange = (wsId, value) => {
    setNotes(prev => ({ ...prev, [wsId]: value }));
    setNotesSaving(prev => ({ ...prev, [wsId]: true }));
    setNotesSaved(prev => ({ ...prev, [wsId]: false }));
    if (notesTimers.current[wsId]) clearTimeout(notesTimers.current[wsId]);
    notesTimers.current[wsId] = setTimeout(() => {
      setNotesSaving(prev => ({ ...prev, [wsId]: false }));
      setNotesSaved(prev => ({ ...prev, [wsId]: true }));
      setTimeout(() => {
        setNotesSaved(prev => ({ ...prev, [wsId]: false }));
      }, 1200);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 900, margin: '72px auto 0 auto' }}>
        <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Career Workshops</h1>
        {notification && (
          <div style={{ background: '#F08F36', color: '#fff', borderRadius: 8, padding: '10px 18px', marginBottom: 18, fontWeight: 600, fontSize: 16 }}>{notification}</div>
        )}
        {!selectedWorkshop ? (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            {/* Tab Bar */}
            <div style={{ display: 'flex', borderBottom: '2px solid #E5EAF2', marginBottom: 18, gap: 8 }}>
              <button
                onClick={() => setActiveTab('upcoming')}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: activeTab === 'upcoming' ? 700 : 500,
                  fontSize: 17,
                  color: '#234B73',
                  borderBottom: activeTab === 'upcoming' ? '3px solid #2196F3' : '3px solid transparent',
                  padding: '0 18px 8px 0',
                  cursor: 'pointer',
                  marginRight: 18,
                  backgroundColor: 'transparent',
                  transition: 'border-bottom 0.2s',
                }}
              >
                <FaCalendarAlt style={{ fontSize: 18, marginRight: 4 }} />
                My Upcoming Workshops
              </button>
              <button
                onClick={() => setActiveTab('attended')}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: activeTab === 'attended' ? 700 : 500,
                  fontSize: 17,
                  color: '#234B73',
                  borderBottom: activeTab === 'attended' ? '3px solid #2196F3' : '3px solid transparent',
                  padding: '0 18px 8px 0',
                  cursor: 'pointer',
                  marginRight: 18,
                  backgroundColor: 'transparent',
                  transition: 'border-bottom 0.2s',
                }}
              >
                <FaCheckCircle style={{ fontSize: 18, marginRight: 4 }} />
                My Attended Workshops
              </button>
              <button
                onClick={() => setActiveTab('available')}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: activeTab === 'available' ? 700 : 500,
                  fontSize: 17,
                  color: '#234B73',
                  borderBottom: activeTab === 'available' ? '3px solid #2196F3' : '3px solid transparent',
                  padding: '0 18px 8px 0',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'border-bottom 0.2s',
                }}
              >
                <FaPlusCircle style={{ fontSize: 18, marginRight: 4 }} />
                Available Workshops
              </button>
            </div>
            {/* Tab Content */}
            {activeTab === 'upcoming' && (
              <>
                <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 10 }}>My Upcoming Workshops</h2>
                {upcomingRegistered.length === 0 ? (
                  <div style={{ color: '#8C8C8C', textAlign: 'center', padding: '18px', fontSize: 16 }}>No upcoming workshops. Register for a workshop to see it here.</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                    {upcomingRegistered.map(ws => (
                      <li key={ws.id} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#E9F5FF', borderRadius: 8, padding: '12px 20px' }}>
                          <span style={{ color: '#234B73', fontWeight: 600, fontSize: 17 }}>{ws.title} <span style={{ color: '#8C8C8C', fontSize: 14 }}>({ws.date} {ws.time})</span></span>
                          <button
                            style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                            onClick={() => setSelectedWorkshop(ws)}
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {activeTab === 'attended' && (
              <>
                <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 10 }}>My Attended Workshops</h2>
                {attendedRegistered.length === 0 ? (
                  <div style={{ color: '#8C8C8C', textAlign: 'center', padding: '18px', fontSize: 16 }}>No attended workshops yet. After you attend a workshop, it will appear here.</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                    {attendedRegistered.map(ws => (
                      <li key={ws.id} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F7FA', borderRadius: 8, padding: '12px 20px' }}>
                          <span style={{ color: '#234B73', fontWeight: 600, fontSize: 17 }}>{ws.title} <span style={{ color: '#8C8C8C', fontSize: 14 }}>({ws.date} {ws.time})</span></span>
                          <button
                            style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                            onClick={() => setSelectedWorkshop(ws)}
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {activeTab === 'available' && (
              <>
                <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Available Workshops</h2>
                {availableToRegister.length === 0 ? (
                  <div style={{ color: '#8C8C8C', textAlign: 'center', padding: '24px', fontSize: 17 }}>
                    No available workshops at this time.
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {availableToRegister.map(ws => (
                      <li key={ws.id} style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F7FA', borderRadius: 8, padding: '16px 24px' }}>
                          <span style={{ color: '#234B73', fontWeight: 600, fontSize: 18 }}>{ws.title} <span style={{ color: '#8C8C8C', fontSize: 15 }}>({ws.date} {ws.time})</span></span>
                          <button
                            style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                            onClick={() => setSelectedWorkshop(ws)}
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            <button style={{ marginBottom: 18, color: '#234B73', background: 'none', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => { setSelectedWorkshop(null); setShowCertificate(false); setNotification(''); setLiveJoined(false); setPlaying(false); }}>&larr; Back to Workshops</button>
            <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{selectedWorkshop.title}</h2>
            <div style={{ color: '#8C8C8C', fontSize: 15, marginBottom: 8 }}>{selectedWorkshop.date} {selectedWorkshop.time}</div>
            <div style={{ color: '#234B73', fontSize: 16, marginBottom: 18 }}>{selectedWorkshop.description}</div>
            {!registrations[selectedWorkshop.id] ? (
              <button style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 18 }} onClick={() => handleRegister(selectedWorkshop)}>Register to Attend</button>
            ) : (
              <div style={{ marginBottom: 18, color: '#065F46', fontWeight: 600 }}>You are registered for this workshop!</div>
            )}
            {/* Live or Pre-recorded Video */}
            {registrations[selectedWorkshop.id] && selectedWorkshop.isLive && (
              <>
                {!liveJoined ? (
                  <button style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 18 }} onClick={handleJoinLive}>Join Live Workshop</button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    {/* Live video */}
                    <div style={{ flex: 2, position: 'relative', display: 'flex', flexDirection: 'column', background: '#000', borderRadius: 12, minHeight: 320, overflow: 'hidden' }}>
                      <video ref={liveVideoRef} src={liveStreamUrl} style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12 }} autoPlay muted loop />
                      {/* LIVE badge and timer */}
                      <div style={{ position: 'absolute', top: 16, left: 18, background: '#F08F36', color: '#fff', borderRadius: 8, padding: '2px 12px', fontWeight: 700, fontSize: 14, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                        LIVE <span style={{ fontWeight: 400, fontSize: 13, marginLeft: 8 }}>{getLiveElapsed()}</span>
                      </div>
                      {/* Control Bar */}
                      <div style={{ display: 'flex', gap: 18, position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 18, zIndex: 2, background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '10px 24px', boxShadow: '0 2px 8px #234B7322' }}>
                        <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: isMuted ? '#991B1B' : '#234B73', fontSize: 26, cursor: 'pointer', marginRight: 6 }} title={isMuted ? 'Unmute' : 'Mute'}>
                          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        </button>
                        <button onClick={toggleCamera} style={{ background: 'none', border: 'none', color: cameraOn ? '#234B73' : '#8C8C8C', fontSize: 26, cursor: 'pointer', marginRight: 6 }} title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}>
                          {cameraOn ? <FaVideo /> : <FaVideoSlash />}
                        </button>
                        <button onClick={handleLeaveLive} style={{ background: 'none', border: 'none', color: '#991B1B', fontSize: 26, cursor: 'pointer', marginRight: 6 }} title="Leave">
                          <FaSignOutAlt />
                        </button>
                        <button onClick={() => setShowParticipants(v => !v)} style={{ background: 'none', border: 'none', color: '#234B73', fontSize: 26, cursor: 'pointer', marginRight: 6 }} title="Show Participants">
                          <FaUsers />
                        </button>
                        <button onClick={() => setShowNotesPanel(v => !v)} style={{ background: 'none', border: 'none', color: '#234B73', fontSize: 26, cursor: 'pointer', marginRight: 6 }} title="Show Notes">
                          <FaStickyNote />
                        </button>
                        <button onClick={() => setShowChat(v => !v)} style={{ background: 'none', border: 'none', color: '#F08F36', fontSize: 26, cursor: 'pointer', position: 'relative' }} title="Open Chat">
                          <FaComments />
                          {unreadChat && (
                            <span style={{ position: 'absolute', top: 2, right: 2, width: 13, height: 13, background: '#F08F36', borderRadius: '50%', display: 'inline-block', border: '2px solid #fff' }} />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Side Panels */}
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {/* Participants Panel */}
                      {showParticipants && (
                        <div style={{ width: 280, background: '#fff', borderLeft: '1.5px solid #C0CEDB', borderRadius: '0 12px 12px 0', boxShadow: '0 2px 8px #234B7322', display: 'flex', flexDirection: 'column', height: 320, maxHeight: 320, position: 'relative', zIndex: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px 8px 18px', borderBottom: '1px solid #E5EAF2' }}>
                            <span style={{ color: '#234B73', fontWeight: 700, fontSize: 18 }}>Participants</span>
                            <button onClick={() => setShowParticipants(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}>×</button>
                          </div>
                          <div style={{ flex: 1, minHeight: 0, maxHeight: 220, overflowY: 'auto', padding: 12 }}>
                            {dummyParticipants.map((participant, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: participant.name === 'You' ? '#E9F5FF' : '#F5F7FA', borderRadius: 8, marginBottom: 8 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: participant.name === 'You' ? '#234B73' : '#F08F36', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 16 }}>
                                  {participant.name[0]}
                                </div>
                                <span style={{ color: '#234B73', fontWeight: 600, fontSize: 15 }}>{participant.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Notes Panel */}
                      {showNotesPanel && (
                        <div style={{ width: 340, background: '#fff', borderLeft: '1.5px solid #C0CEDB', borderRadius: '0 12px 12px 0', boxShadow: '0 2px 8px #234B7322', display: 'flex', flexDirection: 'column', height: 320, maxHeight: 320, position: 'relative', zIndex: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px 8px 18px', borderBottom: '1px solid #E5EAF2' }}>
                            <span style={{ color: '#234B73', fontWeight: 700, fontSize: 18 }}>Live Notes</span>
                            <button onClick={() => setShowNotesPanel(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}>×</button>
                          </div>
                          <div style={{ flex: 1, minHeight: 0, maxHeight: 220, overflowY: 'auto', padding: 12 }}>
                            <textarea
                              value={notes[selectedWorkshop.id] || ''}
                              onChange={e => handleNotesChange(selectedWorkshop.id, e.target.value)}
                              style={{ width: '100%', height: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 12, fontSize: 15, background: '#F5F7FA', color: '#234B73', resize: 'none' }}
                              placeholder="Take notes during the workshop..."
                            />
                            {(notesSaving[selectedWorkshop.id] || notesSaved[selectedWorkshop.id]) && (
                              <div style={{ fontSize: 13, color: notesSaving[selectedWorkshop.id] ? '#F08F36' : '#22C55E', marginTop: 4, minHeight: 18, transition: 'color 0.3s' }}>
                                {notesSaving[selectedWorkshop.id] ? 'Saving...' : 'All changes saved'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Chat Side Panel */}
                      {showChat && (
                        <div style={{ width: 340, background: '#fff', borderLeft: '1.5px solid #C0CEDB', borderRadius: '0 12px 12px 0', boxShadow: '0 2px 8px #234B7322', display: 'flex', flexDirection: 'column', height: 320, maxHeight: 320, position: 'relative', zIndex: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px 8px 18px', borderBottom: '1px solid #E5EAF2' }}>
                            <span style={{ color: '#234B73', fontWeight: 700, fontSize: 18 }}>Live Chat</span>
                            <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}>×</button>
                          </div>
                          <div style={{ flex: 1, minHeight: 0, maxHeight: 220, overflowY: 'auto', background: '#F5F7FA', borderRadius: 8, padding: 12, margin: 8 }}>
                            {(chatMessages[selectedWorkshop.id] || []).map((msg, idx) => (
                              <div key={idx} style={{ marginBottom: 8, color: msg.sender === 'You' ? '#234B73' : '#F08F36', fontWeight: msg.sender === 'You' ? 600 : 500, textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                                <span style={{ fontSize: 13, color: '#8C8C8C', marginRight: 6 }}>{msg.time}</span>
                                <span>{msg.sender}: {msg.text}</span>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                          <div style={{ display: 'flex', gap: 8, padding: '8px 18px 12px 18px', borderTop: '1px solid #E5EAF2' }}>
                            <input
                              type="text"
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
                              placeholder="Type a message..."
                              style={{ flex: 1, borderRadius: 8, border: '1px solid #C0CEDB', padding: '8px 12px', fontSize: 15, background: '#fff', color: '#234B73' }}
                            />
                            <button onClick={handleSendChat} style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Send</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            {registrations[selectedWorkshop.id] && selectedWorkshop.preRecorded && (
              <div style={{ marginBottom: 18, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <video width="100%" controls ref={videoRef} style={{ borderRadius: 8, maxWidth: 540, flex: 2 }}>
                  <source src={selectedWorkshop.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Take Notes</h3>
                  <textarea value={notes[selectedWorkshop.id] || ''} onChange={e => handleNotesChange(selectedWorkshop.id, e.target.value)} rows={10} style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#F5F7FA', color: '#234B73', resize: 'vertical' }} placeholder="Write your notes here..." />
                  {(notesSaving[selectedWorkshop.id] || notesSaved[selectedWorkshop.id]) && (
                    <div style={{ fontSize: 13, color: notesSaving[selectedWorkshop.id] ? '#F08F36' : '#22C55E', marginTop: 4, minHeight: 18, transition: 'color 0.3s' }}>
                      {notesSaving[selectedWorkshop.id] ? 'Saving...' : 'All changes saved'}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Feedback and Certificate */}
            {registrations[selectedWorkshop.id] && (
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Rate & Feedback</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: '#234B73', fontWeight: 500 }}>Your Rating:</span>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{ fontSize: 22, color: (feedbacks[selectedWorkshop.id]?.rating || 0) >= star ? '#FFD700' : '#C0CEDB', cursor: 'pointer' }} onClick={() => setFeedbackValue('rating', star)}>★</span>
                  ))}
                </div>
                <textarea value={feedbacks[selectedWorkshop.id]?.feedback || ''} onChange={e => setFeedbackValue('feedback', e.target.value)} rows={2} style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#F5F7FA', color: '#234B73' }} placeholder="Your feedback..." />
                <button onClick={handleFeedbackSubmit} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 10 }}>Submit Feedback</button>
              </div>
            )}
            {/* Certificate Section */}
            {showCertificate && certificates[selectedWorkshop.id] && (
              <>
                {user?.isProStudent ? (
                  <div style={{ background: '#D1FAE5', borderRadius: 12, padding: 24, color: '#065F46', fontWeight: 700, fontSize: 18, textAlign: 'center', marginTop: 18 }}>
                    🎉 Congratulations! You have received a certificate of attendance for this workshop.<br />
                    <button onClick={handleDownloadCertificate} style={{ marginTop: 12, background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
                      Download Certificate
                    </button>
                  </div>
                ) : (
                  <div style={{ background: '#FEF3C7', borderRadius: 12, padding: 24, color: '#92400E', fontWeight: 700, fontSize: 18, textAlign: 'center', marginTop: 18 }}>
                    ⭐ Upgrade to Pro to access your certificates!<br />
                    <button 
                      onClick={() => window.location.href = '/pro-feature'} 
                      style={{ marginTop: 12, background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CareerWorkshop; 