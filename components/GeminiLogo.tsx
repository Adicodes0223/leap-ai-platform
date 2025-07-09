
import React from 'react';

const GeminiLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.111 6.273C6.388 3.868 9.015 2 12 2C15.933 2 19.23 4.97 19.782 8.75H12V6.273H5.111Z"
      className="text-blue-500 fill-current"
    />
    <path
      d="M19.782 15.25C19.23 19.03 15.933 22 12 22C9.015 22 6.388 20.132 5.111 17.727H12V15.25H19.782Z"
      className="text-purple-500 fill-current"
    />
    <path
      d="M4.218 8.75C4.77 4.97 8.067 2 12 2V8.75H4.218Z"
      transform="rotate(180 8.109 5.375)"
      className="text-teal-400 fill-current"
    />
  </svg>
);

export default GeminiLogo;
