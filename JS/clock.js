const displays = {
    w: document.getElementById("white-clock"),
    b: document.getElementById("black-clock")
  };
  
  const remainingMs = { w: 5 * 60 * 1000, b: 5 * 60 * 1000 };
  let activeColor = null;
  let lastUpdate = 0;
  
  function updateClock() {
    if (activeColor === null) return;
  
    const color = activeColor;
    const now = performance.now();
    remainingMs[color] = Math.max(0, remainingMs[color] - (now - lastUpdate));
    lastUpdate = now;
  
    const totalSeconds = Math.ceil(remainingMs[color] / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    displays[color].textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
  
    if (remainingMs[color] === 0) activeColor = null;
  }
  
  export function clockExpired() {
    updateClock();
    return remainingMs.w === 0 || remainingMs.b === 0;
  }
  
  export function setClock(color) {
    if (clockExpired()) return;
    activeColor = color;
    lastUpdate = performance.now();
  }
  
  export function switchClock(color) {
    if (activeColor !== null) setClock(color);
  }
  
  setInterval(updateClock, 100);


  