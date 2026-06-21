import type { Experience } from '@/features/experience/types';

export const SHOW_EMPTY_EXPERIENCES = true;

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'exp-portfolio-web',
    type: '공모전',
    period: '2023.07-2023.12',
    title: '카카오 데이터 분석 인턴십',
    content:
      '카카오 서비스 데이터를 분석해 사용자 행동 패턴을 도출하고, 이탈 지표 기반의 개선 아이디어를 제안했습니다. 데이터 전처리와 시각화, 발표 자료 제작을 담당했습니다.',
  },
  {
    id: 'exp-ux-research',
    type: '교육',
    period: '2022.03-2023.02',
    title: 'UX 스터디 그룹 리더',
    content:
      'UX 리서치와 사용성 테스트 방법론을 학습하는 스터디를 운영했습니다. 매주 학습 주제를 선정하고 사례 분석 세션을 진행하며 팀원의 결과물을 리뷰했습니다.',
  },
  {
    id: 'exp-ai-service',
    type: '프로젝트',
    period: '2024.09-2024.11',
    title: '고객 맞춤 아이디어 분석 서비스',
    content:
      '고객 입력 데이터를 기반으로 아이디어를 분류하고 우선순위를 제안하는 서비스를 기획했습니다. 프로토타입 화면 설계와 사용자 흐름 정의를 담당했고 최종 발표에서 수상했습니다.',
  },
];
