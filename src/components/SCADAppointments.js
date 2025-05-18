import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SCADNavbar from './SCADNavbar';
import CompanyTimedNotification from './CompanyTimedNotification';

const SCADAppointments = () => {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('career');
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
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
  const [rejectedIds, setRejectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAcceptedNotification, setShowAcceptedNotification] = useState(false);

  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Dummy data for pro students
  const proStudents = [
    {
      id: 1,
      name: 'Youssef Khaled',
      email: 'youssef.khaled@student.guc.edu.eg',
      major: 'Computer Science',
      isOnline: true,
      rating: 4.8,
      completedAppointments: 12
    },
    {
      id: 2,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@student.guc.edu.eg',
      major: 'Engineering',
      isOnline: false,
      rating: 4.5,
      completedAppointments: 8
    },
    {
      id: 3,
      name: 'Sarah Ali',
      email: 'sarah.ali@student.guc.edu.eg',
      major: 'Business',
      isOnline: true,
      rating: 4.9,
      completedAppointments: 15
    }
  ];

  // Dummy data for appointments
  const [appointments, setAppointments] = useState([
    // Requests I made (SCAD is requester, recipientType: 'pro')
    { id: 1, studentId: 1, studentName: 'Youssef Khaled', type: 'Career Guidance', date: '2024-03-20', time: '10:00', status: 'pending', notes: 'Need guidance on career path in software engineering', isOnline: true, hasIncomingCall: false, recipientType: 'pro' },
    { id: 2, studentId: 2, studentName: 'Ahmed Mohamed', type: 'Report Clarification', date: '2024-03-22', time: '14:30', status: 'accepted', notes: 'Clarification needed on internship report feedback', isOnline: false, hasIncomingCall: true, recipientType: 'pro' },
    // Requests to me (SCAD is recipient, recipientType: 'scad')
    { id: 3, studentId: 3, studentName: 'Sarah Ali', type: 'Career Guidance', date: '2024-03-25', time: '11:00', status: 'pending', notes: 'I want to discuss my internship progress', isOnline: true, hasIncomingCall: false, recipientType: 'scad' },
    { id: 4, studentId: 1, studentName: 'Youssef Khaled', type: 'Report Clarification', date: '2024-03-28', time: '13:00', status: 'accepted', notes: 'Need clarification on report comments', isOnline: true, hasIncomingCall: false, recipientType: 'scad' }
  ]);

  // Simulate incoming call notification (only for accepted appointments to me, not rejected)
  useEffect(() => {
    const checkIncomingCalls = () => {
      const incomingCallAppointment = appointments.find(app => app.hasIncomingCall && app.recipientType === 'pro' && !activeCall && !rejectedIds.includes(app.id));
      if (incomingCallAppointment) {
        setIncomingCall(incomingCallAppointment);
        setShowIncomingCall(true);
      }
    };
    const interval = setInterval(checkIncomingCalls, 5000);
    return () => clearInterval(interval);
  }, [appointments, activeCall, rejectedIds]);

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

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const selectedStudentData = proStudents.find(s => s.id === parseInt(selectedStudent));
    const newAppointment = {
      id: appointments.length + 1,
      studentId: selectedStudentData.id,
      studentName: selectedStudentData.name,
      type: requestType === 'career' ? 'Career Guidance' : 'Report Clarification',
      date: requestDate,
      time: requestTime,
      status: 'pending',
      notes: requestNotes,
      isOnline: selectedStudentData.isOnline,
      hasIncomingCall: false,
      recipientType: 'pro'
    };
    setAppointments([...appointments, newAppointment]);
    setShowRequestModal(false);
    // Reset form
    setRequestType('career');
    setRequestDate('');
    setRequestTime('');
    setRequestNotes('');
    setSelectedStudent('');
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
      setActiveCall(incomingCall);
      setShowIncomingCall(false);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      setRejectedIds(ids => [...ids, incomingCall.id]);
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

  // Filtered sections
  const requestsToMe = appointments.filter(app => app.recipientType === 'scad');
  const requestsIMade = appointments.filter(app => app.recipientType === 'pro');
  const upcomingAppointments = appointments.filter(app => app.status === 'accepted');

  // Dummy timed notification for accepted appointment (shows after 7s, hides after 5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAcceptedNotification(true);
    }, 7000); // Show after 7 seconds

    const hideTimer = setTimeout(() => {
      setShowAcceptedNotification(false);
    }, 12000); // Hide after 12 seconds (5s visible)

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SCADNavbar />
      
      {/* Timed Dummy Notification for Accepted Appointment */}
      {showAcceptedNotification && (
        <CompanyTimedNotification
          type="success"
          message="Ahmed Mohamed accepted your Report Clarification appointment"
          customIcon="✅"
          position="top-right"
          onClose={() => setShowAcceptedNotification(false)}
        />
      )}

      {/* Incoming Call Notification */}
      {showIncomingCall && incomingCall && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#fff',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: 320,
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>📞</span>
            <div>
              <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16 }}>
                Incoming Call
              </div>
              <div style={{ color: '#666', fontSize: 14 }}>
                From {incomingCall.studentName} for {incomingCall.type} appointment
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={handleRejectCall}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: '#FEE2E2',
                color: '#991B1B',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Reject
            </button>
            <button
              onClick={handleAcceptCall}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: '#234B73',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {/* Active Call Interface */}
      {activeCall && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
            {/* Remote Video or Placeholder */}
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  background: '#222'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #234B73 0%, #35708E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#fff',
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 1
              }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  fontSize: 60
                }}>
                  👤
                </div>
                {simulateRemote ? 'Other participant is online' : 'Waiting for the other participant to join…'}
              </div>
            )}
            {/* Local Video */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '200px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            />
            {/* Call Info */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.5)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#fff',
              fontSize: '14px',
              backdropFilter: 'blur(4px)'
            }}>
              {activeCall.type} with {activeCall.studentName} - {new Date(activeCall.date).toLocaleDateString()} {activeCall.time}
            </div>
          </div>
          {/* Call Controls */}
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            backdropFilter: 'blur(8px)'
          }}>
            <button
              onClick={toggleMute}
              style={{
                background: isMuted ? '#FEE2E2' : 'rgba(255,255,255,0.1)',
                color: isMuted ? '#991B1B' : '#fff',
                border: 'none',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
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
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
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
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
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
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title="End call"
            >
              📞
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            <div style={{ marginBottom: '32px' }}>
              {/* Upcoming Appointments Section */}
              <h2 style={{ color: '#234B73', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#666' }}>No upcoming appointments.</div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {upcomingAppointments.map(app => (
                    <div key={app.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <div style={{ fontWeight: 600, color: '#234B73', fontSize: 18, paddingRight: '120px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {app.studentName}
                        {app.isOnline && (
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
                      </div>
                      <div style={{ color: '#666', fontSize: 15 }}>{app.type} • {new Date(app.date).toLocaleDateString()} at {app.time}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{app.notes}</div>
                      <button
                        onClick={() => handleStartCall(app)}
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
                          gap: '6px',
                          marginTop: '20px'
                        }}
                      >
                        <span>📞</span> Start Call
                      </button>
                      <span style={{ 
                        position: 'absolute', 
                        top: 20, 
                        right: 20, 
                        padding: '4px 12px', 
                        borderRadius: '999px', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        background: app.status === 'pending' ? '#FEF3C7' : app.status === 'accepted' ? '#D1FAE5' : '#FEE2E2', 
                        color: app.status === 'pending' ? '#92400E' : app.status === 'accepted' ? '#065F46' : '#991B1B' 
                      }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'toMe' && (
            <div style={{ marginBottom: '32px' }}>
              {/* Requests to Me Section */}
              <h2 style={{ color: '#234B73', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Requests to Me</h2>
              {requestsToMe.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#666' }}>No requests to you yet.</div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {requestsToMe.map(app => (
                    <div key={app.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <div style={{ fontWeight: 600, color: '#234B73', fontSize: 18, paddingRight: '120px' }}>{app.studentName}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{app.type} • {new Date(app.date).toLocaleDateString()} at {app.time}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{app.notes}</div>
                      <span style={{ 
                        position: 'absolute', 
                        top: 20, 
                        right: 20, 
                        padding: '4px 12px', 
                        borderRadius: '999px', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        background: app.status === 'pending' ? '#FEF3C7' : app.status === 'accepted' ? '#D1FAE5' : '#FEE2E2', 
                        color: app.status === 'pending' ? '#92400E' : app.status === 'accepted' ? '#065F46' : '#991B1B' 
                      }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, status: 'accepted' } : a))}
                              style={{ background: '#234B73', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a))}
                              style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.status === 'accepted' && (
                          <button
                            onClick={() => handleStartCall(app)}
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
              )}
            </div>
          )}
          {activeTab === 'iMade' && (
            <div style={{ marginBottom: '32px' }}>
              {/* Requests I Made Section */}
              <h2 style={{ color: '#234B73', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Requests I Made</h2>
              {requestsIMade.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#666' }}>No requests made yet.</div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {requestsIMade.map(app => (
                    <div key={app.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <div style={{ fontWeight: 600, color: '#234B73', fontSize: 18, paddingRight: '120px' }}>{app.studentName}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{app.type} • {new Date(app.date).toLocaleDateString()} at {app.time}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{app.notes}</div>
                      <span style={{ 
                        position: 'absolute', 
                        top: 20, 
                        right: 20, 
                        padding: '4px 12px', 
                        borderRadius: '999px', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        background: app.status === 'pending' ? '#FEF3C7' : app.status === 'accepted' ? '#D1FAE5' : '#FEE2E2', 
                        color: app.status === 'pending' ? '#92400E' : app.status === 'accepted' ? '#065F46' : '#991B1B' 
                      }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
                  Select Pro Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '15px',
                    color: '#234B73'
                  }}
                  required
                >
                  <option value="">Select a pro student...</option>
                  {proStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.major}) - {student.isOnline ? 'Online' : 'Offline'}
                    </option>
                  ))}
                </select>
              </div>
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
  );
};

export default SCADAppointments; 