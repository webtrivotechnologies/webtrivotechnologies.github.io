import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 720);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="page-loader" role="status" aria-label="Loading Webtrivo Technologies">
      <div className="loader-mark">W</div>
      <span>Webtrivo Technologies</span>
    </div>
  );
}
