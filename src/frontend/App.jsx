import { useState, useEffect } from "preact/hooks";

export function App() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await import("./assets/js/map.js");
      if (cancelled) return;
      await import("./assets/js/app.js");
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div id="preact-wrapper">
      <div class="hdr">
        <div class="hdr-l">
          <div class="logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="hdr-t">
            <h1>NEMESIS</h1>
            <span>Procurement Audit Intelligence &middot; LKPP / SiRUP &middot; TA 2026</span>
          </div>
        </div>
        <div class="hdr-r">
          <div class="ll"><span class="ldot"></span> LIVE</div>
          <div class="yr">2026</div>
        </div>
      </div>
      <div class="kpi" id="kpi"></div>
      <div class="ml">
        <div class="mc">
          <div id="map"></div>
          <div class="moc" id="mf"></div>
          <div class="mlb" id="legend"></div>
        </div>
        <div class="sb">
          <div class="sbh" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div class="sbt" id="tabs"></div>
            <button class="stb" id="toggleMapBtn" onClick={() => window["dashboardActions"] && window["dashboardActions"].toggleMap()}>&#128506; Peta</button>
          </div>
          <div class="sbc" id="sbc"></div>
        </div>
      </div>
      <div class="modal-overlay" id="rupModal">
        <div class="modal">
          <div class="modal-top" id="modalTop"></div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer">
            Map region menghitung penuh paket multi-lokasi &middot; KPI nasional tidak menduplikasi
          </div>
        </div>
      </div>
      <footer class="app-footer">
        <div class="footer-inner">
          <span>Recode &amp; improved by <a href="https://github.com/el-pablos/nemesis" target="_blank" rel="noopener">el-pablos</a></span>
          <span class="footer-sep">&middot;</span>
          <span>Original by <a href="https://assai.id/nemesis" target="_blank" rel="noopener">ASSAI</a> (<a href="https://github.com/assai-id/nemesis" target="_blank" rel="noopener">source</a>)</span>
        </div>
      </footer>
    </div>
  );
}
