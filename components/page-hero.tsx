import Image from 'next/image';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  alt,
  imagePosition = 'center',
}: PageHeroProps) {
  return (
    <section className="page-hero" aria-labelledby="page-heading">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="page-hero__image"
        style={{ objectPosition: imagePosition }}
      />
      <div className="page-hero__shade" />
      <div className="page-hero__content shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-heading">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
