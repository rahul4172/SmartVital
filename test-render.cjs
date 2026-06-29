require('@babel/register')({
  presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: 'automatic'}]]
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ResultCard = require('./src/components/questionnaire/ResultCard.jsx').default;
const QuestionnaireWizard = require('./src/components/questionnaire/QuestionnaireWizard.jsx').default;

const mockResult = {
  disease: 'Heart Disease',
  risk_score: 0.85,
  risk_level: 'High',
  preventive_actions: ['Do this'],
  shap_data: [{feature: 'Age', direction: 'increases risk'}],
  narrative: 'Bad stuff'
};

try {
  const html = ReactDOMServer.renderToString(
    React.createElement(ResultCard, { disease: 'heart', result: mockResult })
  );
  console.log('SUCCESS rendered ResultCard HTML length:', html.length);
} catch (e) {
  console.error('ERROR rendering ResultCard:', e);
}

// Test what happens when result is null
try {
  const html = ReactDOMServer.renderToString(
    React.createElement(QuestionnaireWizard, { disease: 'heart', questionDefinitions: [] })
  );
  console.log('SUCCESS rendered QuestionnaireWizard HTML length:', html.length);
} catch (e) {
  console.error('ERROR rendering QuestionnaireWizard:', e);
}
