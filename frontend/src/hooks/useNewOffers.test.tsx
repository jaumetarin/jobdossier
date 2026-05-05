import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNewOffers } from './useNewOffers';
import { getToken } from '../services/auth';
import { io } from 'socket.io-client';

const socketMock = {
  on: vi.fn(),
  off: vi.fn(),
  disconnect: vi.fn(),
};

const eventHandlers = new Map<string, (offer: any) => void>();

vi.mock('../services/auth', () => ({
  getToken: vi.fn(),
}));

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => socketMock),
}));

describe('useNewOffers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventHandlers.clear();

    socketMock.on.mockImplementation((event, handler) => {
      eventHandlers.set(event, handler);
      return socketMock;
    });

    socketMock.off.mockReturnValue(socketMock);
    vi.mocked(getToken).mockReturnValue('jwt-token');
  });

  it('connects with the JWT and forwards matching offers', () => {
    const onNewOffer = vi.fn();

    renderHook(() =>
      useNewOffers({
        activeQuery: { technology: 'react' },
        onNewOffer,
      }),
    );

    expect(io).toHaveBeenCalledWith('http://localhost:3000', {
      auth: {
        token: 'jwt-token',
      },
    });

    const newOfferHandler = eventHandlers.get('new-offer');

    expect(newOfferHandler).toBeDefined();

    newOfferHandler?.({
      id: 1,
      title: 'React Developer',
      company: 'Acme',
      location: 'Madrid',
      modality: 'remote',
      salaryText: null,
      url: 'https://example.com/job/1',
      technologies: ['react', 'typescript'],
      publishedAt: null,
    });

    expect(onNewOffer).toHaveBeenCalledTimes(1);
  });

  it('ignores offers that do not match the active query', () => {
    const onNewOffer = vi.fn();

    renderHook(() =>
      useNewOffers({
        activeQuery: { technology: 'java' },
        onNewOffer,
      }),
    );

    const newOfferHandler = eventHandlers.get('new-offer');

    newOfferHandler?.({
      id: 2,
      title: 'React Developer',
      company: 'Acme',
      location: 'Madrid',
      modality: 'remote',
      salaryText: null,
      url: 'https://example.com/job/2',
      technologies: ['react', 'typescript'],
      publishedAt: null,
    });

    expect(onNewOffer).not.toHaveBeenCalled();
  });

  it('disconnects the socket on unmount', () => {
    const onNewOffer = vi.fn();

    const { unmount } = renderHook(() =>
      useNewOffers({
        activeQuery: {},
        onNewOffer,
      }),
    );

    unmount();

    expect(socketMock.off).toHaveBeenCalledWith(
      'new-offer',
      expect.any(Function),
    );
    expect(socketMock.disconnect).toHaveBeenCalled();
  });
});
