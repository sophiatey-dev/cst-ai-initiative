"use client";

import type { ReactNode } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const withBase = (path:string) => path.startsWith("/") ? `${BASE_PATH}${path}` : path;

type KakuIdentityHeroProps = {
  protocol: string;
  eyebrow: string;
  headline: ReactNode;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  identityLabel: string;
  imageAlt: string;
  scrollLabel: string;
  imageSrc?: string;
  primaryExternal?: boolean;
};

type KakuIdentityFieldProps = {
  label: string;
  imageAlt?: string;
  showImage?: boolean;
};

/** Shared background field for every CST AI Initiative interior-page hero. */
export function KakuIdentityField({label,imageAlt="KA-KU Identity",showImage=true}:KakuIdentityFieldProps){
  return <div className={`kaku-identity-field${showImage?"":" no-character"}`} aria-hidden="true">
    {showImage&&<img src={withBase("/assets/brand/kaku-identity.png")} alt={imageAlt}/>}
    <div className="identity-field-orbit"/>
    <div className="identity-field-scan"/>
    <div className="identity-field-signal"><i/><span>{label}</span><b>SYNC_87%</b></div>
  </div>;
}

/**
 * The reusable KA-KU Identity hero.
 * Keep page-specific meaning in props; keep the visual language centralized here.
 */
export function KakuIdentityHero({
  protocol,
  eyebrow,
  headline,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  identityLabel,
  imageAlt,
  scrollLabel,
  imageSrc="/assets/brand/kaku-identity.png",
  primaryExternal=false,
}:KakuIdentityHeroProps){
  return (
    <section className="hero wow-hero kaku-identity-hero" data-protocol={protocol}>
      <div className="hero-protocol" aria-hidden="true">
        <img src={withBase(imageSrc)} alt="" />
        <div className="protocol-scan" />
        <div className="protocol-glitch glitch-a" />
        <div className="protocol-glitch glitch-b" />
      </div>

      <div className="wow-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{headline}</h1>
        <p>{description}</p>
        <div className="actions">
          <a className="button" href={primaryHref} {...(primaryExternal?{target:"_blank",rel:"noreferrer"}:{})}>
            {primaryLabel} ↗
          </a>
          <a className="wow-round-link" href={secondaryHref}>{secondaryLabel}<span>→</span></a>
        </div>
      </div>

      <div className="wow-hero-character">
        <img src={withBase(imageSrc)} alt={imageAlt}/>
        <span>{identityLabel}</span>
      </div>
      <div className="wow-hero-scroll">{scrollLabel} ↓</div>
    </section>
  );
}
