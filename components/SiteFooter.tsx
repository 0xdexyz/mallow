export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Footer">
      <span className="site-footer-word">mallow</span>
      <p className="site-footer-tag">an autonomous social agent for crypto.</p>
      <div className="site-footer-socials">
        <a href="#" aria-label="X"><img src="/x.svg" alt="" width="20" height="20" /></a>
        <a href="#" aria-label="Docs"><img src="/docs.svg" alt="" width="20" height="20" /></a>
        <a href="#" aria-label="App"><img src="/app.svg" alt="" width="20" height="20" /></a>
      </div>
    </footer>
  );
}
