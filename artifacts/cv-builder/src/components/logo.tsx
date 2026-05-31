import { Link } from "wouter";

const logoSrc = `${import.meta.env.BASE_URL}MonCV-PRLOGO.gif`;

/** Ratio du GIF MonCV-PRLOGO (1600×912) */
const LOGO_ASPECT = 1600 / 912;

interface LogoProps {
  className?: string;
  height?: number;
  /** Pass null to render without link */
  href?: string | null;
}

export default function Logo({ className = "", height = 56, href = "/" }: LogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  const img = (
    <img
      src={logoSrc}
      alt="MonCV — CVPro"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      style={{ height, width, maxWidth: "none" }}
    />
  );

  if (href !== null) {
    return (
      <Link href={href} className="inline-flex items-center shrink-0">
        {img}
      </Link>
    );
  }

  return <span className="inline-flex items-center shrink-0">{img}</span>;
}
