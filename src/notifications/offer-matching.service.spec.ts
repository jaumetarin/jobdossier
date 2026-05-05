import { OfferMatchingService } from './offer-matching.service';

describe('OfferMatchingService', () => {
  let service: OfferMatchingService;

  beforeEach(() => {
    service = new OfferMatchingService();
  });

  it('matches when the filter is empty', () => {
    const result = service.matchesFilter(
      {
        keyword: null,
        location: null,
        modality: null,
      },
      {
        title: 'React Developer',
        description: 'Frontend role',
        technologiesRaw: 'React TypeScript',
        technologies: ['react', 'typescript'],
        location: 'Madrid',
        modality: 'remote',
      },
    );

    expect(result).toBe(true);
  });

  it('matches keyword against title, description and technologies', () => {
    const result = service.matchesFilter(
      {
        keyword: 'typescript',
        location: null,
        modality: null,
      },
      {
        title: 'Frontend Engineer',
        description: 'Building dashboards',
        technologiesRaw: 'React TypeScript',
        technologies: ['react', 'typescript'],
        location: 'Valencia',
        modality: 'hybrid',
      },
    );

    expect(result).toBe(true);
  });

  it('matches location and modality ignoring case and whitespace', () => {
    const result = service.matchesFilter(
      {
        keyword: null,
        location: '  madrid ',
        modality: ' REMOTE ',
      },
      {
        title: 'Backend Engineer',
        description: 'NestJS APIs',
        technologiesRaw: 'Node NestJS',
        technologies: ['node', 'nestjs'],
        location: 'Madrid capital',
        modality: 'remote-friendly',
      },
    );

    expect(result).toBe(true);
  });

  it('returns false when keyword does not match', () => {
    const result = service.matchesFilter(
      {
        keyword: 'java',
        location: null,
        modality: null,
      },
      {
        title: 'React Developer',
        description: 'Frontend role',
        technologiesRaw: 'React TypeScript',
        technologies: ['react', 'typescript'],
        location: 'Madrid',
        modality: 'remote',
      },
    );

    expect(result).toBe(false);
  });

  it('returns false when one of the filter fields does not match', () => {
    const result = service.matchesFilter(
      {
        keyword: 'react',
        location: 'Barcelona',
        modality: 'remote',
      },
      {
        title: 'React Developer',
        description: 'Frontend role',
        technologiesRaw: 'React TypeScript',
        technologies: ['react', 'typescript'],
        location: 'Madrid',
        modality: 'remote',
      },
    );

    expect(result).toBe(false);
  });
});
