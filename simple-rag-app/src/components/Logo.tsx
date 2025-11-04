import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={128}
    height={128}
    aria-hidden="false"
    viewBox="0 0 64 64"
    {...props}
  >
    <title>Simple RAG</title>
    <defs>
      <filter id="softShadow" width="200%" height="200%" x="-50%" y="-50%">
        <feDropShadow
          dx={0}
          dy={2}
          floodColor="#0b1220"
          floodOpacity={0.06}
          stdDeviation={2}
        />
      </filter>
      <style>{'.bg{fill:none}'}</style>
    </defs>
    <rect
      width={56}
      height={48}
      x={4}
      y={8}
      filter="url(#softShadow)"
      rx={8}
      style={{
        fill: '#fff',
        stroke: '#e6eef6',
        strokeWidth: 1.2,
      }}
    />
    <g>
      <circle
        cx={18}
        cy={32}
        r={6}
        style={{
          fill: '#ef4444',
        }}
      />
      <circle
        cx={32}
        cy={32}
        r={6}
        style={{
          fill: '#f59e0b',
        }}
      />
      <circle
        cx={46}
        cy={32}
        r={6}
        style={{
          fill: '#10b981',
        }}
      />
    </g>
    <path
      d="M12 44h40"
      style={{
        stroke: '#94a3b8',
        strokeWidth: 2,
        strokeLinecap: 'round',
      }}
    />
    <path
      fill="#fff"
      d="M39.195 31.437c1.451-4.785 6.15-6.495 9.397-3.42-2.221-.256-5.296 2.991-9.397 3.42Z"
      opacity={0.22}
    />
    <path
      fill="#fff"
      d="M42.317 32.378c3.649-3.419 8.573-2.55 9.848 1.736-1.796-1.332-6.083-.057-9.848-1.736Z"
      opacity={0.1}
    />
  </svg>
);

export default Logo;
