// src/App.jsx
import { useState } from 'react'
import styled from 'styled-components'
import Switch from 'react-switch'

const TableContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    margin: 0;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td {
        padding: 12px;
        border-bottom: 1px solid #ddd;
    }
`

const ScoreDisplay = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`

const FINDING_SCORES = {
    previousVTE: 3,
    knownThrombophilia: 2,
    currentLowerLimbParalysis: 2,
    currentCancer: 2,
    immobilized7Days: 1,
    icuCcuStay: 1,
    ageOver60: 1
};

const initialFindings = Object.keys(FINDING_SCORES).reduce((acc, key) => {
    acc[key] = false;
    return acc;
}, {});

const FindingNote = styled.div`
  margin-top: 4px;
  font-size: 0.7rem;
  line-height: 1.1;
  color: #555;
  font-weight: 500;
`

const Title = styled.h1`
  margin: 0 0 24px;
  text-align: center;
  font-size: clamp(1.6rem, 2.2vw + 1rem, 3rem);
  line-height: 1.15;
  max-width: 900px;
  padding: 0 16px;
  word-break: break-word;
  overflow-wrap: anywhere;
`

const App = () => {
    const [findings, setFindings] = useState(initialFindings);
    const [score, setScore] = useState(0);

    const handleChange = (name) => {
        setFindings(prev => {
            const updated = { ...prev, [name]: !prev[name] };
            let newScore = 0;
            Object.entries(updated).forEach(([key, value]) => {
                if (value) newScore += FINDING_SCORES[key] || 0;
            });
            setScore(newScore);
            return updated;
        });
    }

    const getVTERisk = (score) => {
        if (score === 0) return '0.4%';
        if (score === 1) return '0.6%';
        if (score === 2) return '1.0%';
        if (score === 3) return '1.7%';
        if (score === 4) return '2.9%';
        if (score >= 5 && score <= 10) return '7.2%';
        if (score > 10) return '>7.2%';
        return '-';
    }

    return (
        <TableContainer>
            <Title>IMPROVE Risk Score for Venous Thromboembolism (VTE)</Title>
            <div style={{ marginBottom: '24px' }}>
                <a
                    href="https://www.mdcalc.com/calc/10349/improve-risk-score-venous-thromboembolism-vte"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '1rem', color: '#1976d2', textDecoration: 'underline', wordBreak: 'break-word', overflowWrap: 'anywhere', textAlign: 'center', display: 'inline-block', maxWidth: '900px', padding: '0 16px' }}
                >
                    Please see the original version of this calculator by Dr. Alex C. Spyropoulos at https://www.mdcalc.com/calc/10349/improve-risk-score-venous-thromboembolism-vte
                </a>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginTop: '20px'
            }}>
                <div style={{ flex: '0 0 auto' }}>
                    <Table>
                        <thead>
                        <tr>
                            <th>Clinical Finding</th>
                            <th>Present</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(findings).map(([key, value]) => (
                            <tr key={key}>
                                <td>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                      <span>{
                                        {
                                            previousVTE: 'Previous VTE',
                                            knownThrombophilia: 'Known thrombophilia',
                                            currentLowerLimbParalysis: 'Current lower-limb paralysis',
                                            currentCancer: 'Current Cancer',
                                            immobilized7Days: 'Immobilized >= 7 days',
                                            icuCcuStay: 'ICU/CCU stay',
                                            ageOver60: 'Age >60 years'
                                        }[key]
                                      }</span>
                                      {key === 'immobilized7Days' && (
                                        <FindingNote>Immediately prior to and during hospital admission</FindingNote>
                                      )}
                                    </div>
                                </td>
                                <td>
                                    <Switch
                                        onChange={() => handleChange(key)}
                                        checked={value}
                                        height={20}
                                        width={40}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <ScoreDisplay>Total Score: {score}</ScoreDisplay>
                    <ScoreDisplay>
                        3-month risk of VTE: {getVTERisk(score)}
                    </ScoreDisplay>
                </div>
                <div style={{
                    flex: '0 0 500px',
                    marginLeft: '32px',
                    padding: '16px',
                    border: score < 2 ? '2px solid #43a047' : '2px solid #e53935',
                    borderRadius: '8px',
                    background: score < 2 ? '#b6e7c9' : '#f8bcbc',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    color: '#222',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                    <h2 style={{marginTop:0}}>Recommended Intervention</h2>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                        {score < 2
                            ? 'Pharmacologic thromboprophylaxis is not warranted. Instead, early ambulation with or without mechanical prophylaxis may be appropriate.'
                            : 'Start appropriate pharmacologic (e.g., low molecular weight heparin) or mechanical (e.g., compression stockings, intermittent pneumatic compression) prophylaxis.'}
                    </p>
                </div>
            </div>
        </TableContainer>
    )
}

export default App