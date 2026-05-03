import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferMatchingService {
  matchesFilter(filter: any, offer: any): boolean {
    const searchableKeywordText = [
      offer.title,
      offer.description,
      offer.technologiesRaw,
      offer.technologies?.join(' '),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const locationText = (offer.location ?? '').toLowerCase();
    const modalityText = (offer.modality ?? '').toLowerCase();

    const keywordMatches = !filter.keyword
      ? true
      : searchableKeywordText.includes(filter.keyword.toLowerCase().trim());

    const locationMatches = !filter.location
      ? true
      : locationText.includes(filter.location.toLowerCase().trim());

    const modalityMatches = !filter.modality
      ? true
      : modalityText.includes(filter.modality.toLowerCase().trim());

    return keywordMatches && locationMatches && modalityMatches;
  }
}
