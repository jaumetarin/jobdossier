import { OfferNotificationService } from './offer-notification.service';

describe('OfferNotificationService', () => {
  const prismaService = {
    userFilter: {
      findMany: jest.fn(),
    },
  };

  const notificationsGateway = {
    emitNewOfferToUser: jest.fn(),
  };

  const offerMatchingService = {
    matchesFilter: jest.fn(),
  };

  let service: OfferNotificationService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new OfferNotificationService(
      prismaService as never,
      notificationsGateway as never,
      offerMatchingService as never,
    );
  });

  it('does nothing when there are no new jobs', async () => {
    await service.notifyUsersAboutNewOffers([]);

    expect(prismaService.userFilter.findMany).not.toHaveBeenCalled();
    expect(notificationsGateway.emitNewOfferToUser).not.toHaveBeenCalled();
  });

  it('notifies matching users once per job even if multiple filters of the same user match', async () => {
    const newJob = { id: 101, title: 'React Developer' };

    prismaService.userFilter.findMany.mockResolvedValue([
      { id: 1, userId: 7, keyword: 'react' },
      { id: 2, userId: 7, location: 'madrid' },
      { id: 3, userId: 8, keyword: 'java' },
    ]);

    offerMatchingService.matchesFilter.mockImplementation((filter) => {
      return filter.userId === 7;
    });

    await service.notifyUsersAboutNewOffers([newJob]);

    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenCalledTimes(1);
    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenCalledWith(7, newJob);
  });

  it('notifies different users when the job matches filters from different users', async () => {
    const newJob = { id: 202, title: 'Backend Engineer' };

    prismaService.userFilter.findMany.mockResolvedValue([
      { id: 1, userId: 3, keyword: 'node' },
      { id: 2, userId: 4, keyword: 'backend' },
    ]);

    offerMatchingService.matchesFilter.mockReturnValue(true);

    await service.notifyUsersAboutNewOffers([newJob]);

    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenCalledTimes(2);
    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenNthCalledWith(1, 3, newJob);
    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenNthCalledWith(2, 4, newJob);
  });

  it('evaluates each new job independently', async () => {
    const firstJob = { id: 1, title: 'React Developer' };
    const secondJob = { id: 2, title: 'Java Developer' };

    prismaService.userFilter.findMany.mockResolvedValue([
      { id: 1, userId: 5, keyword: 'react' },
    ]);

    offerMatchingService.matchesFilter
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    await service.notifyUsersAboutNewOffers([firstJob, secondJob]);

    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenCalledTimes(1);
    expect(notificationsGateway.emitNewOfferToUser).toHaveBeenCalledWith(5, firstJob);
  });
});
