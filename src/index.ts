import * as WebSocket from "ws";

// Define payload types
interface Payload {
  method: string;
  keys?: string[];
}

const ws = new WebSocket("wss://pumpportal.fun/api/data");

ws.on("open", () => {
  // Subscribing to token creation events
  const subscribeNewTokenPayload: Payload = {
    method: "subscribeNewToken",
  };
  ws.send(JSON.stringify(subscribeNewTokenPayload));

  // Subscribing to trades made by accounts
  const subscribeAccountTradePayload: Payload = {
    method: "subscribeAccountTrade",
    keys: ["AArPXm8JatJiuyEffuC1un2Sc835SULa4uQqDcaGpAjV"],
  };
  ws.send(JSON.stringify(subscribeAccountTradePayload));

  // Subscribing to trades on tokens
  const subscribeTokenTradePayload: Payload = {
    method: "subscribeTokenTrade",
    keys: ["91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p"],
  };
  ws.send(JSON.stringify(subscribeTokenTradePayload));
});

ws.on("message", (data: WebSocket.RawData) => {
  try {
    const parsedData = JSON.parse(data.toString());
    console.log(parsedData);
  } catch (error) {
    console.error("Error parsing message data:", error);
  }
});

ws.on("error", (error: any) => {
  console.error("WebSocket error:", error);
});

ws.on("close", () => {
  console.log("WebSocket connection closed.");
});