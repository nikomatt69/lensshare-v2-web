const onBrowserPushWorkerMessage = (event: MessageEvent) => {
  const { data } = event;
  postMessage(data);
};

self.addEventListener('message', onBrowserPushWorkerMessage);
