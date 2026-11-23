export async function getEngineMove(fen) {
    const response = await fetch("https://chess-api.com/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fen: fen,
        depth: 8
      })
    });
  
    if (!response.ok) {
      throw new Error("Server returned status " + response.status);
    }
  
    const data = await response.json();
  
    if (!data.move) {
      throw new Error("The API did not return a move.");
    }
  
    return data;
  }