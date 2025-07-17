export function withAbort(cb: () => void, abortController: AbortController) {
  if (abortController.signal.aborted) return;
  cb();
}
