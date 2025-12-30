window.addEventListener('error', function (e) {
    // Ignore resizing errors often seen in extensions
    if (e.message && e.message.includes('ResizeObserver')) return;

    document.body.innerHTML = '<div style="color:red; background:black; padding:20px; font-size:14px; font-family:monospace; z-index:9999; position:absolute; top:0; left:0; width:100%; height:100%;"><h3>Global Script Error</h3>' + e.message + '<br><small>' + e.filename + ':' + e.lineno + '</small></div>';
    console.error("Global Error (Debug):", e);
});
console.log("Gravity: Debug script loaded");
