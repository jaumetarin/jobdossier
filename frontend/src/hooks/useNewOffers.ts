import { useEffect, useEffectEvent } from 'react';
import { io } from 'socket.io-client';
import { getToken } from '../services/auth';
import { type JobOffer, type OffersQuery } from '../types/offer';

const socketUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type UseNewOffersOptions = {
  activeQuery: OffersQuery;
  onNewOffer: (offer: JobOffer) => void;
};

function matchesActiveQuery(offer: JobOffer, query: OffersQuery) {
  const search = query.search?.trim().toLowerCase();
  const technology = query.technology?.trim().toLowerCase();
  const location = query.location?.trim().toLowerCase();
  const modality = query.modality?.trim().toLowerCase();

  if (search) {
    const haystack = [
      offer.title,
      offer.company,
      offer.location ?? '',
      offer.modality ?? '',
      ...(offer.technologies ?? []),
    ]
      .join(' ')
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (technology) {
    const technologyHaystack = [
      offer.title,
      offer.company,
      ...(offer.technologies ?? []),
    ]
      .join(' ')
      .toLowerCase();

    if (!technologyHaystack.includes(technology)) {
      return false;
    }
  }

  if (location) {
    if (!(offer.location ?? '').toLowerCase().includes(location)) {
      return false;
    }
  }

  if (modality) {
    if (!(offer.modality ?? '').toLowerCase().includes(modality)) {
      return false;
    }
  }

  return true;
}

export function useNewOffers({
  activeQuery,
  onNewOffer,
}: UseNewOffersOptions) {
  const token = getToken();

  const handleIncomingOffer = useEffectEvent((offer: JobOffer) => {
    if (!matchesActiveQuery(offer, activeQuery)) {
      return;
    }

    onNewOffer(offer);
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(socketUrl, {
      auth: {
        token,
      },
    });

    socket.on('new-offer', handleIncomingOffer);

    return () => {
      socket.off('new-offer', handleIncomingOffer);
      socket.disconnect();
    };
  }, [handleIncomingOffer, token]);
}
