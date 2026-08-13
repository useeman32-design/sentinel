export const Svg = ({ d, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

export const Ico = {
  home: <Svg d={<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />} />,
  scan: (
    <Svg
      d={
        <>
          <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M7 20H5a1 1 0 0 1-1-1v-2M17 20h2a1 1 0 0 0 1-1v-2M4 12h16" />
        </>
      }
    />
  ),
  bot: (
    <Svg
      d={
        <>
          <rect x="5" y="8" width="14" height="11" rx="3" />
          <path d="M12 8V5M9 13h.01M15 13h.01M9 17h6" />
        </>
      }
    />
  ),
  intel: <Svg d={<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />} />,
  more: (
    <Svg
      d={
        <>
          <circle cx="6" cy="12" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="18" cy="12" r="1.4" fill="currentColor" />
        </>
      }
    />
  ),
  back: <Svg size={18} d={<path d="M15 6 9 12l6 6" />} />,
  bell: (
    <Svg
      size={18}
      d={
        <>
          <path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2h-15L6 16Z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </>
      }
    />
  ),
  link: <Svg d={<path d="M10 14a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 6.93M14 10a5 5 0 0 0-7.07 0L5.5 11.41a5 5 0 0 0 7.07 7.07L14 17.07" />} />,
  sms: (
    <Svg
      d={
        <>
          <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        </>
      }
    />
  ),
  mail: (
    <Svg
      d={
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </>
      }
    />
  ),
  qr: (
    <Svg
      d={
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v7M14 20h3" />
        </>
      }
    />
  ),
  file: (
    <Svg
      d={
        <>
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path d="M14 3v5h5" />
        </>
      }
    />
  ),
  lock: (
    <Svg
      d={
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
      }
    />
  ),
  breach: (
    <Svg
      d={
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5M12 16h.01" />
        </>
      }
    />
  ),
  academy: (
    <Svg
      d={
        <>
          <path d="M3 10 12 5l9 5-9 5-9-5Z" />
          <path d="M7 12.5V17c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5" />
        </>
      }
    />
  ),
  chevron: <Svg size={16} d={<path d="m9 6 6 6-6 6" />} />,
};
