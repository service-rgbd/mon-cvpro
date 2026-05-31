import { Link } from "wouter";

const footerLogoSrc = `${import.meta.env.BASE_URL}MonCV-PRO.png`;

/** Ratio MonCV-PRO (~1024×583) */
const FOOTER_LOGO_ASPECT = 1024 / 583;

interface FooterLogoProps {
  className?: string;
  height?: number;
  href?: string | null;
}

export default function FooterLogo({ className = "", height = 72, href = "/" }: FooterLogoProps) {
  const width = Math.round(height * FOOTER_LOGO_ASPECT);

  const img = (
    <img
      src={footerLogoSrc}
      alt="MonCV Pro"
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
