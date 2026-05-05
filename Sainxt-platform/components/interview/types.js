import PropTypes from 'prop-types';

export const InterviewFlowProps = {
  onComplete: PropTypes.func,
  onLoadingStateChange: PropTypes.func,
  onReviewingStateChange: PropTypes.func,
};

export const InterviewResponse = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  timeSpent: PropTypes.number.isRequired,
  notes: PropTypes.string,
  audioUrl: PropTypes.string,
  videoUrl: PropTypes.string,
};

export const EvaluationResults = {
  overallScore: PropTypes.number.isRequired,
  feedback: PropTypes.string.isRequired,
  areasForImprovement: PropTypes.arrayOf(PropTypes.string).isRequired,
  detailedFeedback: PropTypes.object,
};
