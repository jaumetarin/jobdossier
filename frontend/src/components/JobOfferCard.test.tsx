import { render, screen } from '@testing-library/react';
import { JobOfferCard } from './JobOfferCard';

describe('JobOfferCard', () => {
  it('renders the main offer information', () => {
    render(
      <JobOfferCard
        publishedAtLabel="Hace 2 h"
        offer={{
          id: 1,
          title: 'Senior React Developer',
          company: 'Acme',
          location: 'Madrid',
          modality: 'remote',
          salaryText: '45k - 55k',
          url: 'https://example.com/job/1',
          technologies: ['react', 'typescript'],
          publishedAt: '2026-05-06T10:00:00.000Z',
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /senior react developer/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText(/madrid/i)).toBeInTheDocument();
    expect(screen.getByText(/remote/i)).toBeInTheDocument();
    expect(screen.getByText('45k - 55k')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('Hace 2 h')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /ver oferta/i })).toHaveAttribute(
      'href',
      'https://example.com/job/1',
    );
  });
});
