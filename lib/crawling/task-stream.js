const subscribers = new Map(); // taskId -> Set(callback)

export function emitTaskEvent(taskId, event) {
  const subs = subscribers.get(taskId);
  if (subs) {
    for (const cb of subs) {
      cb(event);
    }
  }
}

export function getTaskStatusStream(taskId, callback) {
  let subs = subscribers.get(taskId);
  if (!subs) {
    subs = new Set();
    subscribers.set(taskId, subs);
  }
  subs.add(callback);

  return {
    unsubscribe: () => {
      subs.delete(callback);
      if (subs.size === 0) {
        subscribers.delete(taskId);
      }
    },
  };
}