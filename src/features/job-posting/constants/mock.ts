import type { JobPostingAnalysis } from '@/features/job-posting/types';

export const MOCK_JOB_POSTING_ANALYSIS = {
  postId: 1,
  postAnalysisId: 101,
  title: '영진기술 웹 프론트엔드 개발자 채용',
  summary: {
    title: '영진기술 웹 프론트엔드 개발자 채용',
    summary:
      '영진기술에서 웹 프론트엔드 개발자를 채용합니다. Vue.js와 React를 활용한 웹 개발 경험이 있는 분을 찾고 있습니다.',
    company_intro: '무선 통신장비 제조 및 솔루션',
    rnr: [
      'Vue.js/React 기반 개발',
      'TypeScript 기반 개발',
      '상태관리 라이브러리 활용',
      'REST API 연동 및 비동기 처리',
      'Git을 활용한 협업',
    ],
    required_skills: ['Vue.js', 'React', 'TypeScript', 'HTML/CSS/JavaScript', 'Git'],
    differentiators: [
      'Vue.js/React 양쪽 실무 경험',
      '실시간 데이터 처리 경험',
      'Docker/Kubernetes 기반 배포 경험',
    ],
    hidden_keywords: ['#프론트엔드', '#Vue.js', '#React', '#TypeScript', '#웹개발'],
  },
} satisfies JobPostingAnalysis;
