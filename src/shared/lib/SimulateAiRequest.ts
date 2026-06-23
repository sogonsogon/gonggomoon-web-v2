const AI_REQUEST_DELAY_MS = 3000;

// TODO: 테스트용 임시 로직 (제거 예정)
export function simulateAiRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, AI_REQUEST_DELAY_MS);
  });
}
