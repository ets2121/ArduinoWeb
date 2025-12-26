import type { SVGProps } from 'react';

export function ArduinoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={24}
      height={24}
      {...props}
    >
      <circle cx={128} cy={128} r={120} fill="hsl(var(--primary))" />
      <path
        fill="hsl(var(--primary-foreground))"
        d="M66 128h14.5v14.5H66zm0-29h14.5v14.5H66zm124 29h-14.5v14.5H190zm0-29h-14.5v14.5H190zM102.75 80v21.75h-11V80zm60.5 0v21.75h11V80zM128 66a62 62 0 00-62 62h21.75a40.25 40.25 0 0140.25-40.25V66zm0 124a62 62 0 0062-62h-21.75a40.25 40.25 0 01-40.25 40.25V190z"
      />
    </svg>
  );
}
