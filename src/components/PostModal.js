import React, { useRef } from 'react';

const PostModal = ({
  open,
  onClose,
  onSubmit,
  postHeader,
  setPostHeader,
  postBody,
  setPostBody,
  postMedia,
  setPostMedia,
  mediaURLs,
  setMediaURLs,
  userName = '',
  userInitials = '',
}) => {
  const photoInputRef = useRef();
  const videoInputRef = useRef();
  const documentInputRef = useRef();

  if (!open) return null;

  const handleMediaChange = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPostMedia(prev => ({ ...prev, [type]: file }));
    setMediaURLs(prev => {
      if (prev[type]) URL.revokeObjectURL(prev[type]);
      return { ...prev, [type]: url };
    });
  };

  const handleRemoveMedia = (type) => {
    setPostMedia(prev => ({ ...prev, [type]: null }));
    if (mediaURLs[type]) URL.revokeObjectURL(mediaURLs[type]);
    setMediaURLs(prev => ({ ...prev, [type]: null }));
    if (type === 'photo') photoInputRef.current.value = '';
    if (type === 'video') videoInputRef.current.value = '';
    if (type === 'document') documentInputRef.current.value = '';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
        width: '100%',
        maxWidth: 520,
        padding: 0,
        position: 'relative',
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>
              {userInitials}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>{userName}</div>
              <div style={{ color: '#8C8C8C', fontSize: 13 }}>Post to Anyone</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 26, color: '#8C8C8C', cursor: 'pointer', borderRadius: 6, padding: 4, transition: 'background 0.15s' }}
            aria-label="Close"
            onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={postHeader}
            onChange={e => setPostHeader(e.target.value)}
            placeholder="Header (bold, e.g. 'Looking for a summer internship')"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: 20,
              fontWeight: 700,
              color: '#234B73',
              margin: '18px 0 0 0',
              padding: '0 24px',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
            maxLength={120}
            autoFocus
          />
          <textarea
            value={postBody}
            onChange={e => setPostBody(e.target.value)}
            placeholder="Body (normal text, e.g. 'I am looking for a software engineering internship this summer. Any recommendations?')"
            style={{
              width: '100%',
              minHeight: 120,
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontSize: 18,
              color: '#234B73',
              margin: '8px 0 0 0',
              padding: '0 24px',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
            maxLength={1000}
          />
          {/* Media Previews */}
          <div style={{ padding: '0 24px', marginTop: 10 }}>
            {postMedia.photo && (
              <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                <img src={mediaURLs.photo} alt="preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                <button type="button" onClick={() => handleRemoveMedia('photo')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            )}
            {postMedia.video && (
              <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                <video src={mediaURLs.video} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} controls />
                <button type="button" onClick={() => handleRemoveMedia('video')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            )}
            {postMedia.document && (
              <div style={{ position: 'relative', display: 'inline-block', marginRight: 10, background: '#C0CEDB', borderRadius: 8, padding: '6px 12px', color: '#234B73', fontWeight: 600 }}>
                <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginRight: 4 }}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                {postMedia.document.name}
                <button type="button" onClick={() => handleRemoveMedia('document')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', marginTop: 18 }}>
            <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => photoInputRef.current.click()}>
              <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13" r="4" /></svg>
              Photo
            </button>
            <input type="file" accept="image/*" ref={photoInputRef} style={{ display: 'none' }} onChange={e => handleMediaChange('photo', e)} />
            <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => videoInputRef.current.click()}>
              <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><polygon points="10,9 16,12 10,15" /></svg>
              Video
            </button>
            <input type="file" accept="video/*" ref={videoInputRef} style={{ display: 'none' }} onChange={e => handleMediaChange('video', e)} />
            <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => documentInputRef.current.click()}>
              <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
              Document
            </button>
            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv" ref={documentInputRef} style={{ display: 'none' }} onChange={e => handleMediaChange('document', e)} />
            <div style={{ flex: 1 }} />
            <button
              type="submit"
              disabled={!(postHeader.trim() || postBody.trim() || postMedia.photo || postMedia.video || postMedia.document)}
              style={{
                background: '#F08F36',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '10px 22px',
                fontWeight: 600,
                fontSize: 15,
                cursor: (postHeader.trim() || postBody.trim() || postMedia.photo || postMedia.video || postMedia.document) ? 'pointer' : 'not-allowed',
                opacity: (postHeader.trim() || postBody.trim() || postMedia.photo || postMedia.video || postMedia.document) ? 1 : 0.6,
                boxShadow: '0 2px 8px #F08F36',
                transition: 'background 0.2s',
              }}
            >
              Post
            </button>
          </div>
          <div style={{ height: 18 }} />
        </form>
      </div>
    </div>
  );
};

export default PostModal; 