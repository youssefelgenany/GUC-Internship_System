import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SCADNavbar from './SCADNavbar';
import Navbar from './Navbar';
import CompanyTimedNotification from './CompanyTimedNotification';

const SCADAppointment = () => {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('career');
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [simulateRemote, setSimulateRemote] = useState(false);
  // Notification state
  const [showAcceptedNotification, setShowAcceptedNotification] = useState(false);
  const [acceptedAppointment, setAcceptedAppointment] = useState(null);
  const [notification, setNotification] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [acceptedNotification, setAcceptedNotification] = useState(null);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const notificationsDropdownRef = useRef();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Ahmed Mohamed accepted your Report Clarification appointment",
      icon: "✅",
      type: "success",
      time: "Just now"
    },
    {
      id: 2,
      message: "Incoming call from Ahmed Mohamed for Report Clarification appointment",
      icon: "📞",
      type: "info",
      time: "2 min ago"
    }
  ]);

  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC configuration (using Google's public STUN servers)
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Dummy data for appointments
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'Career Guidance',
      date: '2024-03-20',
      time: '10:00',
      status: 'pending',
      notes: 'Need guidance on career path in software engineering',
      isOnline: true,
      hasIncomingCall: false,
      isRequest: false
    },
    {
      id: 2,
      type: 'Report Clarification',
      date: '2024-03-22',
      time: '14:30',
      status: 'accepted',
      notes: 'Clarification needed on internship report feedback',
      isOnline: false,
      hasIncomingCall: true,
      isRequest: false
    },
    {
      id: 3,
      type: 'Career Guidance',
      date: '2024-03-25',
      time: '11:00',
      status: 'rejected',
      notes: 'Discussion about potential internship opportunities',
      isOnline: true,
      hasIncomingCall: false,
      isRequest: false
    },
    {
      id: 4,
      type: 'Career Guidance',
      date: '2024-03-26',
      time: '10:00',
      status: 'accepted',
      notes: 'Need guidance on career path in software engineering',
      isOnline: true,
      hasIncomingCall: false,
      isRequest: true
    },
    {
      id: 5,
      type: 'Report Clarification',
      date: '2024-03-28',
      time: '14:30',
      status: 'accepted',
      notes: 'Clarification needed on internship report feedback',
      isOnline: false,
      hasIncomingCall: true,
      isRequest: true
    },
    {
      id: 6,
      type: 'Career Guidance',
      date: '2024-03-30',
      time: '11:00',
      status: 'accepted',
      notes: 'Need guidance on career path in software engineering',
      isOnline: true,
      hasIncomingCall: false,
      isRequest: false
    }
  ]);

  // Timed incoming call notification after 20 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIncomingCall(true);
      setIncomingCall({ type: 'Career Guidance', date: new Date().toISOString(), time: '12:00' }); // Dummy data
      // Hide after 10 seconds
      setTimeout(() => setShowIncomingCall(false), 10000);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate incoming call notification
  useEffect(() => {
    let timeoutId;
    const checkIncomingCalls = () => {
      // Only show for accepted appointments with hasIncomingCall
      const incomingCallAppointment = appointments.find(
        app => app.hasIncomingCall && app.status === 'accepted' && !sessionStorage.getItem(`handledCall_${app.id}`)
      );
      if (incomingCallAppointment && !activeCall) {
        setIncomingCall(incomingCallAppointment);
        setShowIncomingCall(true);
        // Hide after 10 seconds
        timeoutId = setTimeout(() => {
          setShowIncomingCall(false);
        }, 10000);
      }
    };
    const interval = setInterval(checkIncomingCalls, 5000);
    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [appointments, activeCall]);

  // Initialize media stream when video is enabled
  useEffect(() => {
    if (isVideoEnabled && activeCall) {
      startLocalStream();
    } else if (localStream) {
      stopLocalStream();
    }
    return () => {
      if (localStream) {
        stopLocalStream();
      }
    };
  }, [isVideoEnabled, activeCall]);

  // Handle peer connection when call starts
  useEffect(() => {
    if (activeCall && isCallStarted) {
      initializePeerConnection();
    }
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [activeCall, isCallStarted]);

  // Simulate remote participant joining after 10 seconds and leaving after 20 seconds
  useEffect(() => {
    let joinTimer, leaveTimer, notifTimer;
    if (activeCall) {
      joinTimer = setTimeout(() => {
        setSimulateRemote(true);
        leaveTimer = setTimeout(() => {
          setSimulateRemote(false);
          setRemoteStream(null);
          setNotification('The other participant has left the call.');
          notifTimer = setTimeout(() => setNotification(''), 5000);
        }, 20000);
      }, 3000);
    }
    return () => {
      clearTimeout(joinTimer);
      clearTimeout(leaveTimer);
      clearTimeout(notifTimer);
    };
  }, [activeCall]);

  useEffect(() => {
    // Find the first accepted appointment to SCAD (simulate notification)
    const acceptedApp = appointments.find(
      app => app.status === 'accepted' && app.recipientType === 'scad'
    );
    if (acceptedApp) {
      setAcceptedNotification({
        studentName: acceptedApp.studentName,
        type: acceptedApp.type
      });
      setShowAcceptedNotification(true);

      // Hide after 5 seconds
      const timer = setTimeout(() => setShowAcceptedNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [appointments]);

  useEffect(() => {
    // Show a dummy "accepted appointment" notification 7 seconds after mount
    const timer = setTimeout(() => {
      setShowAcceptedNotification(true);
    }, 7000); // 7 seconds after page load

    // Hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowAcceptedNotification(false);
    }, 12000); // 5 seconds after showing

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera and microphone. Please check your permissions.');
    }
  };

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
  };

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection(configuration);
    
    // Add local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real application, you would send this to the other peer
        console.log('New ICE candidate:', event.candidate);
      }
    };

    // Handle incoming streams
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    setPeerConnection(pc);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(), // Use timestamp as unique ID
      type: requestType === 'career' ? 'Career Guidance' : 'Report Clarification',
      date: requestDate,
      time: requestTime,
      status: 'pending',
      notes: requestNotes,
      isOnline: true,
      hasIncomingCall: false,
      isRequest: true
    };
    
    // Add the new appointment to the list using functional update
    setAppointments(prevAppointments => {
      console.log('Adding new appointment:', newAppointment);
      return [...prevAppointments, newAppointment];
    });
    
    // Reset form and close modal
    setRequestType('career');
    setRequestDate('');
    setRequestTime('');
    setRequestNotes('');
    setShowRequestModal(false);

    // Auto-accept after 10 seconds for demo
    setTimeout(() => {
      setAppointments(current => current.map(app =>
        app.id === newAppointment.id ? { ...app, status: 'accepted' } : app
      ));
      setAcceptedAppointment({ ...newAppointment, status: 'accepted' });
      setShowAcceptedNotification(true);
    }, 10000);
  };

  const handleAppointmentAction = (id, action) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: action } : app
    ));
    if (action === 'accepted') {
      const app = appointments.find(app => app.id === id);
      setAcceptedAppointment(app);
      setShowAcceptedNotification(true);
    }
  };

  const handleStartCall = async (appointment) => {
    setActiveCall(appointment);
    setShowIncomingCall(false);
    setIncomingCall(null);
    setIsCallStarted(true);
    await startLocalStream();
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    stopLocalStream();
    setRemoteStream(null);
    setActiveCall(null);
    setIsVideoEnabled(true);
    setIsMuted(false);
    setIsScreenSharing(false);
    setIsCallStarted(false);
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      sessionStorage.setItem(`handledCall_${incomingCall.id}`, 'true');
    }
    setActiveCall(incomingCall);
    setShowIncomingCall(false);
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      sessionStorage.setItem(`handledCall_${incomingCall.id}`, 'true');
    }
    setShowIncomingCall(false);
    setIncomingCall(null);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        if (isVideoEnabled) {
          videoTrack.enabled = false;
        } else {
          // If the track is ended, reacquire
          if (videoTrack.readyState === 'ended' || !videoTrack.enabled) {
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const newTrack = newStream.getVideoTracks()[0];
            localStream.removeTrack(videoTrack);
            localStream.addTrack(newTrack);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
          } else {
            videoTrack.enabled = true;
          }
        }
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        // For demo, show screen in remote video
        setRemoteStream(screenStream);
        screenTrack.onended = () => {
          setIsScreenSharing(false);
          setRemoteStream(null);
        };
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
        setRemoteStream(null);
      }
    } catch (error) {
      alert('Could not share screen.');
    }
  };

  return (
    <>
      {activeCall ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #234B73 0%, #35708E 100%)',
          zIndex: 3000,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Notification for remote leaving */}
          {notification && (
            <div style={{
              position: 'fixed',
              top: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#FEE2E2',
              color: '#991B1B',
              borderRadius: 12,
              padding: '18px 32px',
              fontWeight: 600,
              fontSize: 18,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              zIndex: 4000
            }}>
              {notification}
            </div>
          )}
          {/* Call Info */}
          <div style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            borderRadius: 20,
            padding: '8px 18px',
            fontSize: 16,
            fontWeight: 500,
            zIndex: 2
          }}>
            {activeCall.type} - {new Date(activeCall.date).toLocaleDateString()} {activeCall.time}
          </div>
          {/* Local Video */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 220,
              height: 160,
              objectFit: 'cover',
              borderRadius: 12,
              border: '2px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 2
            }}
          />
          {/* Main Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {simulateRemote ? (
              <>
                <div style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 32,
                  fontSize: 80,
                  color: '#8C8C8C'
                }}>
                  <span role="img" aria-label="avatar">👤</span>
                </div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 600, letterSpacing: 1, textAlign: 'center' }}>
                  The other participant is online
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 32,
                  fontSize: 80,
                  color: '#8C8C8C'
                }}>
                  <span role="img" aria-label="avatar">👤</span>
                </div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 600, letterSpacing: 1, textAlign: 'center' }}>
                  Waiting for the other participant to join…
                </div>
              </>
            )}
          </div>
          {/* Call Controls */}
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '28px 0',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            backdropFilter: 'blur(8px)'
          }}>
            <button
              onClick={toggleMute}
              style={{
                background: isMuted ? '#FEE2E2' : 'rgba(255,255,255,0.1)',
                color: isMuted ? '#991B1B' : '#fff',
                border: 'none',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            <button
              onClick={toggleVideo}
              style={{
                background: isVideoEnabled ? 'rgba(255,255,255,0.1)' : '#FEE2E2',
                color: isVideoEnabled ? '#fff' : '#991B1B',
                border: 'none',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? '📹' : '🚫'}
            </button>
            <button
              onClick={toggleScreenShare}
              style={{
                background: isScreenSharing ? '#D1FAE5' : 'rgba(255,255,255,0.1)',
                color: isScreenSharing ? '#065F46' : '#fff',
                border: 'none',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              {isScreenSharing ? '🖥️' : '💻'}
            </button>
            <button
              onClick={handleEndCall}
              style={{
                background: '#FEE2E2',
                color: '#991B1B',
                border: 'none',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title="End call"
            >
              📞
            </button>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          {/* Timed notification for accepted appointment */}
          {showAcceptedNotification && acceptedAppointment && (
            <CompanyTimedNotification
              type="success"
              message={`Your appointment for ${acceptedAppointment.type} on ${new Date(acceptedAppointment.date).toLocaleDateString()} at ${acceptedAppointment.time} has been accepted by the SCAD Officer!`}
              onClose={() => setShowAcceptedNotification(false)}
              position="top-right"
            />
          )}
          {showAcceptedNotification && acceptedNotification && (
            <CompanyTimedNotification
              type="success"
              message={`✅ ${acceptedNotification.studentName} accepted your ${acceptedNotification.type} appointment`}
              customIcon="✅"
              position="top-right"
              onClose={() => setShowAcceptedNotification(false)}
            />
          )}
          <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', marginTop: '72px' }}>
            {/* Incoming Call Notification */}
            {showIncomingCall && incomingCall && (
              <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                zIndex: 3001,
                width: '300px'
              }}>
                <h3 style={{ color: '#234B73', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                  Incoming Call
                </h3>
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
                  {incomingCall.type} appointment with SCAD
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleAcceptCall}
                    style={{
                      flex: 1,
                      background: '#234B73',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleRejectCall}
                    style={{
                      flex: 1,
                      background: '#FEE2E2',
                      color: '#991B1B',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h1 style={{ color: '#234B73', fontSize: '32px', fontWeight: '700' }}>
                SCAD Appointments
              </h1>
              <button
                onClick={() => setShowRequestModal(true)}
                style={{
                  background: '#234B73',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Request Appointment
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 40, borderBottom: '2px solid #e5e7eb', marginBottom: 32 }}>
              <div
                onClick={() => setActiveTab('upcoming')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  color: activeTab === 'upcoming' ? '#234B73' : '#222',
                  fontWeight: activeTab === 'upcoming' ? 700 : 500,
                  borderBottom: activeTab === 'upcoming' ? '3px solid #2196f3' : '3px solid transparent',
                  paddingBottom: 6, fontSize: 18
                }}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="4"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Upcoming Appointments
              </div>
              <div
                onClick={() => setActiveTab('toMe')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  color: activeTab === 'toMe' ? '#234B73' : '#222',
                  fontWeight: activeTab === 'toMe' ? 700 : 500,
                  borderBottom: activeTab === 'toMe' ? '3px solid #2196f3' : '3px solid transparent',
                  paddingBottom: 6, fontSize: 18
                }}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Requests to Me
              </div>
              <div
                onClick={() => setActiveTab('iMade')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  color: activeTab === 'iMade' ? '#234B73' : '#222',
                  fontWeight: activeTab === 'iMade' ? 700 : 500,
                  borderBottom: activeTab === 'iMade' ? '3px solid #2196f3' : '3px solid transparent',
                  paddingBottom: 6, fontSize: 18
                }}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Requests I Made
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'upcoming' && (
              <>
                <h2 style={{ color: '#234B73', fontSize: '22px', fontWeight: '600', marginBottom: '18px' }}>Upcoming Appointments</h2>
                <div style={{ display: 'grid', gap: '16px', marginBottom: '36px' }}>
                  {appointments.filter(app => app.status === 'accepted').map(appointment => (
                    <div
                      key={appointment.id}
                      style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                        marginBottom: '36px'
                      }}
                    >
                      <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <h3 style={{ color: '#234B73', fontSize: '18px', fontWeight: '600', marginBottom: '8px', paddingRight: '120px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {appointment.type}
                          {appointment.isOnline && (
                            <span
                              title="Online"
                              style={{
                                display: 'inline-block',
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: '#22C55E',
                                marginLeft: 4,
                                border: '2px solid #fff',
                                boxShadow: '0 0 0 2px #22C55E44'
                              }}
                            />
                          )}
                        </h3>
                        <div style={{ color: '#666', fontSize: '15px' }}>
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                        <span style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: appointment.status === 'pending' ? '#FEF3C7' : 
                                    appointment.status === 'accepted' ? '#D1FAE5' : '#FEE2E2',
                          color: appointment.status === 'pending' ? '#92400E' : 
                                appointment.status === 'accepted' ? '#065F46' : '#991B1B',
                          zIndex: 2
                        }}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
                        {appointment.notes}
                      </p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'accepted')}
                              style={{
                                background: '#234B73',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                              style={{
                                background: '#FEE2E2',
                                color: '#991B1B',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {appointment.status === 'accepted' && (
                          <button
                            onClick={() => handleStartCall(appointment)}
                            style={{
                              background: '#234B73',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>📞</span> Start Call
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'toMe' && (
              <>
                <h2 style={{ color: '#234B73', fontSize: '22px', fontWeight: '600', marginBottom: '18px' }}>Requests to Me</h2>
                <div style={{ display: 'grid', gap: '16px', marginBottom: '36px' }}>
                  {appointments.filter(app => !app.isRequest).map(appointment => (
                    <div
                      key={appointment.id}
                      style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                        marginBottom: '36px'
                      }}
                    >
                      <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <h3 style={{ color: '#234B73', fontSize: '18px', fontWeight: '600', marginBottom: '8px', paddingRight: '120px' }}>
                          {appointment.type}
                        </h3>
                        <div style={{ color: '#666', fontSize: '15px' }}>
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                        <span style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: appointment.status === 'pending' ? '#FEF3C7' : 
                                    appointment.status === 'accepted' ? '#D1FAE5' : '#FEE2E2',
                          color: appointment.status === 'pending' ? '#92400E' : 
                                appointment.status === 'accepted' ? '#065F46' : '#991B1B',
                          zIndex: 2
                        }}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
                        {appointment.notes}
                      </p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'accepted')}
                              style={{
                                background: '#234B73',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                              style={{
                                background: '#FEE2E2',
                                color: '#991B1B',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {appointment.status === 'accepted' && (
                          <button
                            onClick={() => handleStartCall(appointment)}
                            style={{
                              background: '#234B73',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>📞</span> Start Call
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'iMade' && (
              <>
                <h2 style={{ color: '#234B73', fontSize: '22px', fontWeight: '600', marginBottom: '18px' }}>Requests I Made</h2>
                <div style={{ display: 'grid', gap: '16px', marginBottom: '36px' }}>
                  {appointments.filter(app => app.isRequest).map(appointment => (
                    <div
                      key={appointment.id}
                      style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                        marginBottom: '36px'
                      }}
                    >
                      <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <h3 style={{ color: '#234B73', fontSize: '18px', fontWeight: '600', marginBottom: '8px', paddingRight: '120px' }}>
                          {appointment.type}
                        </h3>
                        <div style={{ color: '#666', fontSize: '15px' }}>
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                        <span style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: appointment.status === 'pending' ? '#FEF3C7' : 
                                    appointment.status === 'accepted' ? '#D1FAE5' : '#FEE2E2',
                          color: appointment.status === 'pending' ? '#92400E' : 
                                appointment.status === 'accepted' ? '#065F46' : '#991B1B',
                          zIndex: 2
                        }}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
                        {appointment.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Request Appointment Modal */}
            {showRequestModal && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.18)',
                    zIndex: 1000
                  }}
                  onClick={() => setShowRequestModal(false)}
                />
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    zIndex: 1001,
                    width: '90%',
                    maxWidth: '500px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ color: '#234B73', fontSize: '24px', fontWeight: '600' }}>
                      Request Appointment
                    </h2>
                    <button
                      onClick={() => setShowRequestModal(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        color: '#666',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleRequestSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                        Appointment Type
                      </label>
                      <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '15px',
                          color: '#234B73'
                        }}
                      >
                        <option value="career">Career Guidance</option>
                        <option value="report">Report Clarification</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '15px',
                          color: '#234B73'
                        }}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        value={requestTime}
                        onChange={(e) => setRequestTime(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '15px',
                          color: '#234B73'
                        }}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                        Additional Notes
                      </label>
                      <textarea
                        value={requestNotes}
                        onChange={(e) => setRequestNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '15px',
                          color: '#234B73',
                          minHeight: '100px',
                          resize: 'vertical'
                        }}
                        placeholder="Please provide any additional details about your appointment request..."
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowRequestModal(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                          color: '#666',
                          fontSize: '15px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#234B73',
                          color: '#fff',
                          fontSize: '15px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
          <div style={{ position: 'relative', marginLeft: 'auto', marginRight: 24 }}>
            <button
              onClick={() => setShowNotificationsDropdown(v => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 26,
                color: '#234B73',
                position: 'relative'
              }}
              aria-label="Notifications"
            >
              <span role="img" aria-label="bell">🔔</span>
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: '#F08F36',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotificationsDropdown && (
              <div
                ref={notificationsDropdownRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 36,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 12px rgba(35,75,115,0.12)',
                  minWidth: 320,
                  zIndex: 100,
                  padding: 12
                }}
              >
                <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17, marginBottom: 8 }}>Notifications</div>
                {notifications.length === 0 ? (
                  <div style={{ color: '#8C8C8C', fontSize: 15, padding: 12 }}>No notifications.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: n.type === 'success' ? '#D1FAE5' : n.type === 'info' ? '#DBEAFE' : '#fff',
                      color: n.type === 'success' ? '#065F46' : n.type === 'info' ? '#1E40AF' : '#234B73',
                      borderRadius: 8,
                      padding: '10px 12px',
                      marginBottom: 6,
                      fontWeight: 500
                    }}>
                      <span style={{ fontSize: 20 }}>{n.icon}</span>
                      <span>{n.message}</span>
                      <span style={{ marginLeft: 'auto', color: '#8C8C8C', fontSize: 13 }}>{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SCADAppointment; 