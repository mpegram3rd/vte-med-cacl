import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

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
`;

const Title = styled.h1`
  margin: 0 0 24px;
  text-align: center;
  font-size: clamp(1.6rem, 2.2vw + 1rem, 3rem);
  line-height: 1.15;
  max-width: 900px;
  padding: 0 16px;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 12px; border-bottom: 1px solid #ddd; }
`;

const ScoreDisplay = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const FindingNote = styled.div`
  margin-top: 4px;
  font-size: 0.7rem;
  line-height: 1.1;
  color: #555;
  font-weight: 500;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;
  gap: 32px;
  flex-wrap: nowrap;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const InterventionBox = styled.div<{lowRisk: boolean}>`
  flex: 0 0 500px;
  margin-left: 32px;
  padding: 16px;
  border: 2px solid ${p => p.lowRisk ? '#43a047' : '#e53935'};
  border-radius: 8px;
  background: ${p => p.lowRisk ? '#b6e7c9' : '#f8bcbc'};
  font-family: inherit;
  font-size: 1rem;
  color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  @media (max-width: 900px) {
    margin-left: 0;
    width: 100%;
  }
`;

interface FindingScores {
  previousVTE: number;
  knownThrombophilia: number;
  currentLowerLimbParalysis: number;
  currentCancer: number;
  immobilized7Days: number;
  icuCcuStay: number;
  ageOver60: number;
}

const FINDING_SCORES: FindingScores = {
  previousVTE: 3,
  knownThrombophilia: 2,
  currentLowerLimbParalysis: 2,
  currentCancer: 2,
  immobilized7Days: 1,
  icuCcuStay: 1,
  ageOver60: 1
};

interface Findings {
  previousVTE: boolean;
  knownThrombophilia: boolean;
  currentLowerLimbParalysis: boolean;
  currentCancer: boolean;
  immobilized7Days: boolean;
  icuCcuStay: boolean;
  ageOver60: boolean;
}

const initialFindings: Findings = {
  previousVTE: false,
  knownThrombophilia: false,
  currentLowerLimbParalysis: false,
  currentCancer: false,
  immobilized7Days: false,
  icuCcuStay: false,
  ageOver60: false
};

const friendlyLabels: Record<keyof Findings, string> = {
  previousVTE: 'Previous VTE',
  knownThrombophilia: 'Known thrombophilia',
  currentLowerLimbParalysis: 'Current lower-limb paralysis',
  currentCancer: 'Current Cancer',
  immobilized7Days: 'Immobilized >= 7 days',
  icuCcuStay: 'ICU/CCU stay',
  ageOver60: 'Age >60 years'
};

const App: React.FC = () => {
  const [findings, setFindings] = useState<Findings>(initialFindings);
  const [score, setScore] = useState<number>(0);

  const handleChange = (name: keyof Findings) => {
    setFindings(prev => {
      const updated = { ...prev, [name]: !prev[name] };
      let newScore = 0;
      Object.entries(updated).forEach(([k, v]) => {
        if (v) newScore += FINDING_SCORES[k as keyof FindingScores] || 0;
      });
      setScore(newScore);
      return updated;
    });
  };

  const getVTERisk = (value: number): string => {
    if (value === 0) return '0.4%';
    if (value === 1) return '0.6%';
    if (value === 2) return '1.0%';
    if (value === 3) return '1.7%';
    if (value === 4) return '2.9%';
    if (value >= 5 && value <= 10) return '7.2%';
    if (value > 10) return '>7.2%';
    return '-';
  };

  const lowRisk = score < 2;

  return (
    <TableContainer>
      <Title>IMPROVE Risk Score for Venous Thromboembolism (VTE)</Title>
      <ContentRow>
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{friendlyLabels[key as keyof Findings]}</span>
                      {key === 'immobilized7Days' && (
                        <FindingNote>Immediately prior to and during hospital admission</FindingNote>
                      )}
                    </div>
                  </td>
                  <td>
                    <Switch
                      onChange={() => handleChange(key as keyof Findings)}
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
          <ScoreDisplay>3-month risk of VTE: {getVTERisk(score)}</ScoreDisplay>
        </div>
        <InterventionBox lowRisk={lowRisk}>
          <h2 style={{ marginTop: 0 }}>Recommended Intervention</h2>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
            {lowRisk
              ? 'Pharmacologic thromboprophylaxis is not warranted. Instead, early ambulation with or without mechanical prophylaxis may be appropriate.'
              : 'Start appropriate pharmacologic (e.g., low molecular weight heparin) or mechanical (e.g., compression stockings, intermittent pneumatic compression) prophylaxis.'}
          </p>
        </InterventionBox>
      </ContentRow>
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a
          href="https://www.mdcalc.com/calc/10349/improve-risk-score-venous-thromboembolism-vte"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.95rem', color: '#1976d2', textDecoration: 'underline', wordBreak: 'break-word', overflowWrap: 'anywhere', display: 'inline-block', maxWidth: '900px', padding: '0 16px' }}
        >
          Please see the original version of this calculator by Dr. Alex C. Spyropoulos at https://www.mdcalc.com/calc/10349/improve-risk-score-venous-thromboembolism-vte
        </a>
      </div>
    </TableContainer>
  );
};

export default App;
