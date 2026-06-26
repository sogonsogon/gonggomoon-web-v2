import { StrategyAnalysisCardData } from '@/features/strategy/types';

export const MOCK_STRATEGY_RESULT = {
  createdAt: '2026.06.17',
  jobTitle: '토스 Backend 신입 채용',
  cards: [
    {
      id: 'positioning-message',
      order: 1,
      type: 'summary',
      title: '핵심 포지셔닝 메시지',
      content:
        '작은 기능을 끝까지 책임지고 개선해 본 경험을 바탕으로, 복잡한 백엔드 시스템에서도 안정성과 사용자 경험을 함께 고려하는 신입 Backend 개발자로 포지셔닝하세요.',
    },
    {
      id: 'supplement-keywords',
      order: 2,
      type: 'list',
      title: '보완 키워드',
      items: [
        '대용량 트래픽 대응 경험은 부족하므로, 성능 개선을 위해 어떤 지표를 보고 판단했는지 구체화하세요.',
        '협업 과정에서는 기획자/프론트엔드와 API 스펙을 맞춘 경험을 중심으로 설명하세요.',
        '결과 중심보다 문제 발견, 원인 분석, 해결 시도, 재발 방지 흐름을 강조하세요.',
      ],
    },
    {
      id: 'experience-connection',
      order: 3,
      type: 'list',
      title: '경험별 포인트',
      items: [
        '카카오 데이터 분석 인턴십은 데이터 기반 의사결정과 지표 해석 역량으로 연결할 수 있습니다.',
        'UX 스터디 그룹 리더 경험은 사용자 관점에서 문제를 정의하고 협업한 사례로 활용하세요.',
        '아이디어 분석앱 프로젝트는 요구사항 정리, 서비스 구조 설계, 결과 발표 경험을 묶어 설명하세요.',
      ],
    },
    {
      id: 'experience-strategy',
      order: 4,
      type: 'list',
      title: '경험 정렬 전략',
      items: [
        '프로젝트를 나열하기보다 문제 상황과 본인이 맡은 책임 범위를 먼저 제시하세요.',
        '기술 선택 이유와 구현 과정의 trade-off를 짧게 정리하세요.',
        '정량 성과가 부족하다면 사용성 개선, 처리 시간 단축, 협업 비용 감소 같은 관찰 가능한 변화를 사용하세요.',
      ],
    },
    {
      id: 'highlight-keywords',
      order: 5,
      type: 'keywords',
      title: '강조 키워드',
      keywords: ['문제 해결', '데이터 기반 개선', '협업', '사용자 경험', 'API 설계', '운영 관점'],
    },
    {
      id: 'core-capabilities',
      order: 6,
      type: 'list',
      title: '강조 역량',
      items: [
        '지표를 해석하고 개선 우선순위를 정하는 능력',
        '모호한 요구사항을 실행 가능한 작업으로 구체화하는 능력',
        '팀과 API/데이터 흐름을 맞추며 구현하는 협업 능력',
      ],
    },
    {
      id: 'cover-letter-tone',
      order: 7,
      type: 'list',
      title: 'KPI(핵심 성과 지표)',
      items: [
        '문제 상황을 담백하게 설명하고 본인의 판단 근거를 분명히 드러내세요.',
        '신입 지원자인 만큼 배운 점보다 다음 프로젝트에서 어떻게 적용했는지를 강조하세요.',
        '과장된 표현보다 실제 행동, 선택, 결과를 중심으로 작성하세요.',
      ],
    },
  ] satisfies StrategyAnalysisCardData[],
} as const;
