import React, { useState } from 'react';
import SCADNavbar from './SCADNavbar';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

const initialWorkshops = [
  {
    id: 1,
    name: 'Career Launchpad',
    description: 'Kickstart your career with essential skills and strategies.',
    startDate: '2025-07-10',
    startTime: '10:00',
    endDate: '2025-07-10',
    endTime: '13:00',
    speakerBio: 'Dr. Sarah Johnson, Career Coach at GUC',
    agenda: '10:00-11:00: Resume Building\n11:00-12:00: Interview Skills\n12:00-13:00: Q&A Session',
  },
  {
    id: 2,
    name: 'Tech Industry Insights',
    description: 'Explore the latest trends and opportunities in tech.',
    startDate: '2025-07-15',
    startTime: '14:00',
    endDate: '2025-07-15',
    endTime: '16:00',
    speakerBio: 'Eng. Ahmed Mostafa, CTO at TechCorp',
    agenda: '14:00-15:00: Industry Trends\n15:00-16:00: Panel Discussion',
  },
  {
    id: 3,
    name: 'Personal Branding for Students',
    description: 'Learn how to build your personal brand and stand out to employers.',
    startDate: '2025-07-20',
    startTime: '11:00',
    endDate: '2025-07-20',
    endTime: '13:00',
    speakerBio: 'Ms. Laila Hassan, LinkedIn Top Voice',
    agenda: '11:00-12:00: Building Your Online Presence\n12:00-13:00: Networking Strategies',
  },
  {
    id: 4,
    name: 'Entrepreneurship 101',
    description: 'A practical guide to launching your own startup as a student.',
    startDate: '2025-07-25',
    startTime: '09:00',
    endDate: '2025-07-25',
    endTime: '12:00',
    speakerBio: 'Omar El-Shenawy, Founder of StartUpX',
    agenda: '09:00-10:30: Ideation & Validation\n10:30-12:00: Pitching & Fundraising',
  },
  {
    id: 5,
    name: 'Women in STEM',
    description: 'Inspiring stories and advice from leading women in STEM fields.',
    startDate: '2025-07-30',
    startTime: '15:00',
    endDate: '2025-07-30',
    endTime: '17:00',
    speakerBio: 'Panel: Dr. Mona Zaki, Eng. Sara Fathy, Dr. Heba El-Sayed',
    agenda: '15:00-16:00: Panel Discussion\n16:00-17:00: Q&A and Networking',
  },
];

const emptyWorkshop = {
  name: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  speakerBio: '',
  agenda: '',
};

const SCADWorkshops = () => {
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [currentWorkshop, setCurrentWorkshop] = useState(emptyWorkshop);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Open modal for create or edit
  const openModal = (type, workshop = emptyWorkshop, id = null) => {
    setModalType(type);
    setCurrentWorkshop(workshop);
    setEditId(id);
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentWorkshop((prev) => ({ ...prev, [name]: value }));
  };

  // Create or update workshop
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === 'create') {
      setWorkshops((prev) => [
        ...prev,
        { ...currentWorkshop, id: Date.now() },
      ]);
    } else if (modalType === 'edit') {
      setWorkshops((prev) =>
        prev.map((w) => (w.id === editId ? { ...currentWorkshop, id: editId } : w))
      );
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setSaveSuccess(false);
      setCurrentWorkshop(emptyWorkshop);
      setEditId(null);
    }, 1000);
  };

  // Delete workshop
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setWorkshops((prev) => prev.filter((w) => w.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // List only upcoming workshops (today or later)
  const today = new Date().toISOString().split('T')[0];
  const upcomingWorkshops = workshops.filter((w) => w.startDate >= today);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SCADNavbar />
      <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700 }}>Manage Online Workshops</h1>
            <button
              onClick={() => openModal('create')}
              style={{ background: '#234B73', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              + Add Workshop
            </button>
          </div>
          <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Upcoming Workshops</h2>
          {upcomingWorkshops.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: 32 }}>No upcoming workshops.</div>
          ) : (
            <div style={{ display: 'grid', gap: 20 }}>
              {upcomingWorkshops.map((w) => (
                <div key={w.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#234B73', fontSize: 20 }}>{w.name}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => openModal('edit', w, w.id)} style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                        <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(w.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                        <svg width="20" height="20" fill="none" stroke="#991B1B" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ color: '#35708E', fontWeight: 500, fontSize: 16 }}>{w.description}</div>
                  <div style={{ color: '#234B73', fontSize: 15, margin: '4px 0' }}>
                    <b>Start:</b> {w.startDate} {w.startTime} &nbsp; | &nbsp;
                    <b>End:</b> {w.endDate} {w.endTime}
                  </div>
                  <div style={{ color: '#234B73', fontSize: 15 }}><b>Speaker:</b> {w.speakerBio}</div>
                  <div style={{ color: '#234B73', fontSize: 15 }}><b>Agenda:</b><br />
                    <pre style={{ background: '#f3f4f6', borderRadius: 8, padding: 12, fontFamily: 'inherit', fontSize: 15, margin: 0 }}>{w.agenda}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal for create/edit */}
      {showModal && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000 }} onClick={() => setShowModal(false)} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
            padding: '36px 32px 28px 32px',
            zIndex: 1001,
            minWidth: 340,
            width: '100%',
            maxWidth: 540,
            maxHeight: '80vh',
            overflowY: 'auto',
            margin: 24
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>{modalType === 'create' ? 'Add Workshop' : 'Edit Workshop'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }} aria-label="Close modal">×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ color: '#234B73', fontWeight: 500 }}>Workshop Name
                <input name="name" value={currentWorkshop.name} onChange={handleChange} required style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }} />
              </label>
              <label style={{ color: '#234B73', fontWeight: 500 }}>Short Description
                <textarea name="description" value={currentWorkshop.description} onChange={handleChange} required rows={2} style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73', resize: 'vertical' }} />
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ color: '#234B73', fontWeight: 500, flex: 1 }}>Start Date
                  <input type="date" name="startDate" value={currentWorkshop.startDate} onChange={handleChange} required style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }} />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500, flex: 1 }}>Start Time
                  <input type="time" name="startTime" value={currentWorkshop.startTime} onChange={handleChange} required style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ color: '#234B73', fontWeight: 500, flex: 1 }}>End Date
                  <input type="date" name="endDate" value={currentWorkshop.endDate} onChange={handleChange} required style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }} />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500, flex: 1 }}>End Time
                  <input type="time" name="endTime" value={currentWorkshop.endTime} onChange={handleChange} required style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }} />
                </label>
              </div>
              <label style={{ color: '#234B73', fontWeight: 500 }}>Speaker Bio
                <textarea name="speakerBio" value={currentWorkshop.speakerBio} onChange={handleChange} required rows={2} style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73', resize: 'vertical' }} />
              </label>
              <label style={{ color: '#234B73', fontWeight: 500 }}>Workshop Agenda
                <textarea name="agenda" value={currentWorkshop.agenda} onChange={handleChange} required rows={3} style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73', resize: 'vertical' }} placeholder="e.g. 10:00-11:00: Topic 1\n11:00-12:00: Topic 2" />
              </label>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 8, border: '1.5px solid #234B73', background: '#fff', color: '#234B73', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: saveSuccess ? '#22C55E' : '#F08F36',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: saveSuccess ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  {saveSuccess ? <FaCheck style={{ fontSize: 18 }} /> : null}
                  {saveSuccess ? 'Saved' : (modalType === 'create' ? 'Add Workshop' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {showDeleteModal && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={cancelDelete} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,112,142,0.18)', border: '2px solid #C0CEDB', padding: '32px 28px 24px 28px', zIndex: 2001, minWidth: 320, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ color: '#234B73', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Delete Workshop</div>
            <div style={{ color: '#991B1B', fontSize: 17, marginBottom: 24 }}>Are you sure you want to delete this workshop?</div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center' }}>
              <button onClick={confirmDelete} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Delete</button>
              <button onClick={cancelDelete} style={{ background: '#C0CEDB', color: '#234B73', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SCADWorkshops; 