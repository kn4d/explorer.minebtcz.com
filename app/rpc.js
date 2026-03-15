export async function rpc(method, params = []) {
  const host = process.env.BTCZ_RPC_HOST;
  const port = process.env.BTCZ_RPC_PORT;
  const user = process.env.BTCZ_RPC_USER;
  const pass = process.env.BTCZ_RPC_PASSWORD;

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const url = `http://${host}:${port}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Authorization": `Basic ${auth}`
    },
    body: JSON.stringify({
      jsonrpc: "1.0",
      id: "btcz-explorer",
      method,
      params
    })
  });

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`RPC non-JSON response status=${res.status} body=${text.slice(0, 300)}`);
  }

  if (json.error) {
    throw new Error(`${method}: ${JSON.stringify(json.error)}`);
  }

  return json.result;
}
