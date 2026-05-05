import { type JobOffer } from '../types/offer';

type JobOfferCardProps = {
  offer: JobOffer;
  publishedAtLabel: string;
};

export function JobOfferCard({
  offer,
  publishedAtLabel,
}: JobOfferCardProps) {
  return (
    <article
      style={{
        background: '#fff',
        border: '1px solid #d1d5db',
        borderRadius: 12,
        padding: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0' }}>{offer.title}</h3>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>{offer.company}</strong>
          </p>
        </div>
        <small style={{ color: '#6b7280' }}>{publishedAtLabel}</small>
      </div>

      <p style={{ margin: '0.25rem 0' }}>
        {offer.location ?? 'Ubicación no especificada'}
        {' · '}
        {offer.modality ?? 'Modalidad no especificada'}
      </p>

      <p style={{ margin: '0.25rem 0' }}>
        {offer.salaryText ?? 'Salario no especificado'}
      </p>

      {offer.technologies.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            margin: '0.75rem 0',
          }}
        >
          {offer.technologies.map((technology) => (
            <span
              key={`${offer.id}-${technology}`}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: 999,
                background: '#eef2ff',
                color: '#3730a3',
                fontSize: '0.85rem',
              }}
            >
              {technology}
            </span>
          ))}
        </div>
      ) : null}

      <a href={offer.url} target="_blank" rel="noreferrer">
        Ver oferta
      </a>
    </article>
  );
}
