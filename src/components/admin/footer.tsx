export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
        <p>&copy; {year} Anavrin Property. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-600">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-600">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-600">
            Support
          </a>
          <span className="text-slate-300">v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
