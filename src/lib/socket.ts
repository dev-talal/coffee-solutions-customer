export interface MessageDataBase {
  channel: string;
  data: string;
  event: string;
}

export interface ReverbConnectionOptions<T = MessageDataBase> {
  userId: number | string;
  onMessage: (message: T) => void;
  maxRetries?: number;
}

export function connectReverb({
  userId,
  onMessage,
  maxRetries = 10,
}: ReverbConnectionOptions): WebSocket {
  let retries = 0;
  let ws: WebSocket | null = null;

  const connect = (): void => {
    ws = new WebSocket(`ws://127.0.0.1:8080/app/n0aem7nixeg7mycg4gb4`);
    const channelName = `user.${userId}`;

    ws.onopen = () => {
      console.log("✅ Connected to Reverb");
      retries = 0;

      const payload = {
        event: "pusher:subscribe",
        data: { channel: channelName },
      };

      ws?.send(JSON.stringify(payload));
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("⚠️ Error parsing Reverb message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
    };

    ws.onclose = () => {
      console.warn("❌ Disconnected from Reverb");

      if (retries < maxRetries) {
        const delay = Math.min(1000 * 2 ** retries, 30000);
        console.log(`🔁 Reconnecting in ${delay / 1000}s...`);
        retries++;
        setTimeout(connect, delay);
      } else {
        console.error("🛑 Max reconnect attempts reached.");
      }
    };
  };

  connect();

  return ws!;
}
