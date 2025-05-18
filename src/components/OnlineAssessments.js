import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../App';
import { FaCheck } from 'react-icons/fa';

const dummyAssessments = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    questions: [
      {
        q: 'What is the output of 2 + "2" in JavaScript?',
        options: ['4', '22', 'NaN', 'Error'],
        answer: 1
      },
      {
        q: 'Which keyword declares a constant in JS?',
        options: ['let', 'var', 'const', 'static'],
        answer: 2
      },
      {
        q: 'What does JSON stand for?',
        options: ['JavaScript Object Notation', 'Java Source Object Notation', 'Java Syntax Over Network', 'None'],
        answer: 0
      }
    ]
  },
  {
    id: 2,
    title: 'React Basics',
    questions: [
      {
        q: 'What hook is used for state in React?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        answer: 0
      },
      {
        q: 'JSX stands for?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript XHR', 'None'],
        answer: 0
      }
    ]
  }
];

const OnlineAssessments = () => {
  const navigate = useNavigate();
  const { assessmentScores, setAssessmentScores, posts, setPosts, user } = useAuth();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [postScore, setPostScore] = useState(false);
  const [scorePosted, setScorePosted] = useState(false);

  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setAnswers(Array(assessment.questions.length).fill(null));
    setScore(null);
    setShowScore(false);
  };

  const handleAnswer = (qIdx, optIdx) => {
    setAnswers(ans => ans.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const handleSubmit = () => {
    let s = 0;
    selectedAssessment.questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++;
    });
    setScore(s);
    setShowScore(true);
    
    // Save score to auth context
    setAssessmentScores(prev => ({
      ...prev,
      [selectedAssessment.id]: {
        score: s,
        total: selectedAssessment.questions.length,
        title: selectedAssessment.title,
        date: new Date().toISOString()
      }
    }));
  };

  const handlePostScore = () => {
    if (!postScore) {
      // Add the score to the user's profile posts
      setPosts(prevPosts => [
        {
          id: Date.now(),
          title: `Assessment Score: ${selectedAssessment.title}`,
          content: `I scored ${score}/${selectedAssessment.questions.length} on the ${selectedAssessment.title} assessment!`,
          date: new Date().toISOString().slice(0, 10),
          type: 'assessment',
          assessmentDetails: {
            title: selectedAssessment.title,
            score: score,
            total: selectedAssessment.questions.length,
            date: new Date().toISOString()
          }
        },
        ...prevPosts
      ]);
      setPostScore(true);
      setScorePosted(true);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: 800, margin: '72px auto 0 auto' }}>
        <h1 style={{ color: '#234B73', fontSize: '32px', fontWeight: '700', marginBottom: 32 }}>
          Online Assessments
        </h1>
        {!selectedAssessment ? (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Available Assessments</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {dummyAssessments.map(assess => (
                <li key={assess.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F7FA', borderRadius: 8, padding: '16px 24px' }}>
                    <div>
                      <span style={{ color: '#234B73', fontWeight: 600, fontSize: 18 }}>{assess.title}</span>
                      {assessmentScores[assess.id] && (
                        <div style={{ color: '#8C8C8C', fontSize: 14, marginTop: 4 }}>
                          Previous Score: {assessmentScores[assess.id].score}/{assessmentScores[assess.id].total}
                        </div>
                      )}
                    </div>
                    <button
                      style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => handleSelectAssessment(assess)}
                    >
                      {assessmentScores[assess.id] ? 'Retake Assessment' : 'Take Assessment'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : showScore ? (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, textAlign: 'center' }}>
            <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Assessment Complete!</h2>
            <div style={{ fontSize: 20, color: '#234B73', fontWeight: 700, marginBottom: 12 }}>
              Your Score: {score} / {selectedAssessment.questions.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, color: '#234B73', marginBottom: 18 }}>
              <button
                style={{ 
                  background: scorePosted ? '#22C55E' : '#F08F36', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '10px 28px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: scorePosted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.2s'
                }}
                disabled={scorePosted}
                onClick={handlePostScore}
              >
                {scorePosted ? (
                  <>
                    <FaCheck style={{ fontSize: 20 }} />
                    Score Posted!
                  </>
                ) : (
                  'Post my score on my profile'
                )}
              </button>
            </div>
            <button
              style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}
              onClick={() => {
                setSelectedAssessment(null);
                setShowScore(false);
                setPostScore(false);
                setScorePosted(false);
              }}
            >
              Back to Assessments
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 600, marginBottom: 18 }}>{selectedAssessment.title}</h2>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              {selectedAssessment.questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: 22 }}>
                  <div style={{ color: '#234B73', fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{idx + 1}. {q.q}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.options.map((opt, oidx) => (
                      <label key={oidx} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          checked={answers[idx] === oidx}
                          onChange={() => handleAnswer(idx, oidx)}
                          style={{ accentColor: '#234B73', width: 18, height: 18 }}
                        />
                        <span style={{ color: '#234B73', fontSize: 15 }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}
                disabled={answers.some(a => a === null)}
              >
                Submit Assessment
              </button>
              <button
                type="button"
                style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10, marginLeft: 10 }}
                onClick={() => setSelectedAssessment(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default OnlineAssessments; 