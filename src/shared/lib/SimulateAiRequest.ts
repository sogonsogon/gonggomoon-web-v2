const AI_REQUEST_DELAY_MS = 3000;

export function simulateAiRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, AI_REQUEST_DELAY_MS);
  });
}
