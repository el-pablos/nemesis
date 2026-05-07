import { useState, useEffect } from 'preact/hooks';

// For this strictly structural integration phase, we wrap the vanilla mount
// without altering the UI or logic to maintain identical CSS and user paths.

export function App() {
  useEffect(() => {
    // Load map.js first so window.AuditMap is defined before app.js runs.
    let cancelled = false;
    (async () => {
      await import('./assets/js/map.js');
      if (cancelled) return;
      await import('./assets/js/app.js');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="preact-wrapper">
      <div class="hdr">
        <div class="hdr-l">
          <div class="logo">NMS</div>
          <div class="hdr-t">
            <h1>Nemesis &mdash; Procurement Audit</h1>
            <span>Analisis pengadaan per Kab/Kota &middot; LKPP / SiRUP &middot; TA 2026</span>
          </div>
        </div>
        <div class="hdr-r">
          <div class="ll">
            <span class="ldot"></span> LIVE
          </div>
          <div class="yr">TA 2026</div>
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
          <div class="sbh" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div class="sbt" id="tabs"></div>
            <button class="stb" id="toggleMapBtn" onClick={() => window['dashboardActions'] && window['dashboardActions'].toggleMap()}>&#128506; Sembunyikan Peta</button>
          </div>
          <div class="sbc" id="sbc"></div>
        </div>
      </div>
      <div class="modal-overlay" id="rupModal">
        <div class="modal">
          <div class="modal-top" id="modalTop"></div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer">
            Map memakai agregasi penuh untuk paket multi-lokasi &middot; KPI nasional tidak
            menduplikasi paket multi-lokasi
          </div>
        </div>
      </div>
    </div>
  );
}
