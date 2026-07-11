import { useEffect, useState } from "react";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem("webtrivo-cookie-ok") !== "true");
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-notice">
      <p>We use essential storage for theme and preference settings. No tracking cookies are required for this static site.</p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("webtrivo-cookie-ok", "true");
          setVisible(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}
