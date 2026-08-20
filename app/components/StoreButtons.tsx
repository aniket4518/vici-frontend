import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/store-links";

type StoreButtonsProps = {
  /* Wrapper class — the home page and about page style the row differently. */
  className?: string;
  /* Analytics ids differ per placement, so callers pass their own. */
  playStoreId?: string;
  appStoreId?: string;
};

/* Shared Play + App Store CTA row. Icon dimensions come from
   `.store-btn-icon svg` in globals.css, so the intrinsic svg size below is
   never what renders. */
export default function StoreButtons({
  className = "store-buttons",
  playStoreId,
  appStoreId,
}: StoreButtonsProps) {
  return (
    <div className={className}>
      {/* Google Play */}
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="store-btn"
        id={playStoreId}
      >
        <span className="store-btn-icon">
          <svg viewBox="0 0 512 512" width="19" height="19" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
          </svg>
        </span>
        <span className="store-btn-text">
          <span className="store-btn-label">GET IT ON</span>
          <span className="store-btn-name">Google Play</span>
        </span>
      </a>

      {/* App Store */}
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="store-btn"
        id={appStoreId}
      >
        <span className="store-btn-icon">
          <svg viewBox="0 0 384 512" width="17" height="19" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-74.3-19.7C63.1 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
          </svg>
        </span>
        <span className="store-btn-text">
          <span className="store-btn-label">DOWNLOAD ON THE</span>
          <span className="store-btn-name">App Store</span>
        </span>
      </a>
    </div>
  );
}
