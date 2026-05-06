import { useEffect, useState, type ComponentProps } from 'react';
import { clearToken } from '../services/auth';
import { getFilters, createFilter, deleteFilter } from '../services/filters';
import { getOffers } from '../services/offers';
import { api } from '../services/api';
import { useNewOffers } from '../hooks/useNewOffers';
import { type CurrentUser } from '../types/auth';
import { type UserFilter } from '../types/filter';
import {
  type ImportOffersResponse,
  type JobOffer,
  type OffersQuery,
} from '../types/offer';
import { JobOfferCard } from '../components/JobOfferCard';
import {
  getSalaryByStack,
  getTopCompanies,
  getTopTechnologies,
} from '../services/analytics';
import {
  type SalaryByStack,
  type TopCompany,
  type TopTechnology,
} from '../types/analytics';


function formatPublishedAt(value: string | null) {
  if (!value) {
    return 'Fecha no disponible';
  }

  const publishedAt = new Date(value);

  if (Number.isNaN(publishedAt.getTime())) {
    return 'Fecha no disponible';
  }

  const diffInMinutes = Math.floor((Date.now() - publishedAt.getTime()) / 60000);

  if (diffInMinutes < 1) {
    return 'Hace menos de un minuto';
  }

  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `Hace ${diffInHours} h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `Hace ${diffInDays} días`;
  }

  return publishedAt.toLocaleDateString('es-ES');
}

export function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [notificationFilters, setNotificationFilters] = useState<UserFilter[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isSavingNotificationFilter, setIsSavingNotificationFilter] = useState(false);
  const [unseenOffersCount, setUnseenOffersCount] = useState(0);

  const [alertKeyword, setAlertKeyword] = useState('');
  const [alertLocation, setAlertLocation] = useState('');
  const [alertModality, setAlertModality] = useState('');

  const [dashboardSearch, setDashboardSearch] = useState('');
  const [dashboardTechnology, setDashboardTechnology] = useState('');
  const [dashboardLocation, setDashboardLocation] = useState('');
  const [dashboardModality, setDashboardModality] = useState('');

  const [activeQuery, setActiveQuery] = useState<OffersQuery>({});

  const activeDashboardFiltersCount = [
    activeQuery.search,
    activeQuery.technology,
    activeQuery.location,
    activeQuery.modality,
  ].filter(Boolean).length;

  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [topTechnologies, setTopTechnologies] = useState<TopTechnology[]>([]);
  const [salaryByStack, setSalaryByStack] = useState<SalaryByStack[]>([]);
  const [analyticsError, setAnalyticsError] = useState('');

  function buildDashboardQuery(): OffersQuery {
    return {
      search: dashboardSearch.trim() || undefined,
      technology: dashboardTechnology.trim() || undefined,
      location: dashboardLocation.trim() || undefined,
      modality: dashboardModality.trim() || undefined,
    };
  }

  function syncDashboardInputs(query: OffersQuery) {
    setDashboardSearch(query.search ?? '');
    setDashboardTechnology(query.technology ?? '');
    setDashboardLocation(query.location ?? '');
    setDashboardModality(query.modality ?? '');
  }

   async function loadDashboardData(query: OffersQuery = activeQuery) {
    setError('');
    setAnalyticsError('');

    try {
      const [userResponse, offersResponse, filtersResponse] = await Promise.all([
        api.get<CurrentUser>('/auth/me'),
        getOffers(query),
        getFilters(),
      ]);

      setUser(userResponse.data);
      setOffers(offersResponse.items);
      setNotificationFilters(filtersResponse);

      const [companiesResult, technologiesResult, salaryResult] =
        await Promise.allSettled([
          getTopCompanies(),
          getTopTechnologies(10),
          getSalaryByStack(),
        ]);

      if (companiesResult.status === 'fulfilled') {
        setTopCompanies(companiesResult.value);
      } else {
        setTopCompanies([]);
      }

      if (technologiesResult.status === 'fulfilled') {
        setTopTechnologies(technologiesResult.value);
      } else {
        setTopTechnologies([]);
      }

      if (salaryResult.status === 'fulfilled') {
        setSalaryByStack(salaryResult.value);
      } else {
        setSalaryByStack([]);
      }

      if (
        companiesResult.status === 'rejected' ||
        technologiesResult.status === 'rejected' ||
        salaryResult.status === 'rejected'
      ) {
        setAnalyticsError('No se pudieron cargar los analytics.');
      }
    } catch {
      setError('No se pudieron cargar los datos del dashboard.');
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    void loadDashboardData({});
  }, []);

  useEffect(() => {
    document.title =
      unseenOffersCount > 0 ? `(${unseenOffersCount}) Jobdossier` : 'Jobdossier';

    return () => {
      document.title = 'Jobdossier';
    };
  }, [unseenOffersCount]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        setUnseenOffersCount(0);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useNewOffers({
    activeQuery,
    onNewOffer: (offer) => {
      setOffers((currentOffers) => {
        const alreadyExists = currentOffers.some(
          (currentOffer) => currentOffer.id === offer.id,
        );

        if (alreadyExists) {
          return currentOffers;
        }

        return [offer, ...currentOffers];
      });

      setSuccessMessage(`Nueva oferta recibida: ${offer.title}`);

      if (document.hidden) {
        setUnseenOffersCount((currentCount) => currentCount + 1);
      }
    },
  });

  function handleLogout() {
    clearToken();
    window.location.href = '/login';
  }

  async function handleImportOffers() {
    setIsImporting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post<ImportOffersResponse>('/fetcher/import-all');

      setSuccessMessage(
        `Importación completada: ${response.data.created} nuevas, ${response.data.skipped} duplicadas, ${response.data.fetched} procesadas.`,
      );

      setIsLoading(true);
      await loadDashboardData(activeQuery);
    } catch {
      setError('No se pudieron importar ofertas. Inténtalo de nuevo.');
    } finally {
      setIsImporting(false);
    }
  }

  const handleCreateNotificationFilter: ComponentProps<'form'>['onSubmit'] = async (
    event,
  ) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSavingNotificationFilter(true);

    try {
      await createFilter({
        keyword: alertKeyword.trim() || undefined,
        location: alertLocation.trim() || undefined,
        modality: alertModality.trim() || undefined,
      });

      setAlertKeyword('');
      setAlertLocation('');
      setAlertModality('');
      setSuccessMessage('Alerta guardada correctamente.');

      await loadDashboardData(activeQuery);
    } catch {
      setError('No se pudo guardar la alerta. Añade al menos un campo válido.');
    } finally {
      setIsSavingNotificationFilter(false);
    }
  };

  async function handleDeleteNotificationFilter(filterId: number) {
    setError('');
    setSuccessMessage('');

    try {
      await deleteFilter(filterId);
      setSuccessMessage('Alerta eliminada correctamente.');
      await loadDashboardData(activeQuery);
    } catch {
      setError('No se pudo eliminar la alerta.');
    }
  }

  async function handleUseNotificationFilterInDashboard(filter: UserFilter) {
    const nextQuery: OffersQuery = {
      search: filter.keyword ?? undefined,
      location: filter.location ?? undefined,
      modality: filter.modality ?? undefined,
    };

    syncDashboardInputs(nextQuery);
    setActiveQuery(nextQuery);
    setIsLoading(true);
    setSuccessMessage('Alerta aplicada al dashboard.');
    await loadDashboardData(nextQuery);
  }

  const handleDashboardFilterSubmit: ComponentProps<'form'>['onSubmit'] = async (
    event,
  ) => {
    event.preventDefault();

    const nextQuery = buildDashboardQuery();

    setError('');
    setSuccessMessage('Filtros del dashboard aplicados.');
    setActiveQuery(nextQuery);
    setIsLoading(true);
    await loadDashboardData(nextQuery);
  };

  async function handleClearDashboardFilters() {
    syncDashboardInputs({});
    setActiveQuery({});
    setError('');
    setSuccessMessage('Vista general restaurada.');
    setIsLoading(true);
    await loadDashboardData({});
  }

  return (
    <main style={{ maxWidth: 1120, margin: '2rem auto', padding: '0 1rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0' }}>Jobdossier</h1>
          <p style={{ margin: 0 }}>
            {user ? `Sesión iniciada como ${user.email}` : 'Cargando usuario...'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => void handleImportOffers()} disabled={isImporting}>
            {isImporting ? 'Importando...' : 'Importar ofertas'}
          </button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      {isLoading ? <p>Cargando dashboard...</p> : null}
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      {successMessage ? <p style={{ color: '#15803d' }}>{successMessage}</p> : null}

      <section
        style={{
          background: '#fff',
          border: '1px solid #d1d5db',
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Filtros del dashboard</h2>
        <p style={{ marginTop: 0, color: '#4b5563' }}>
          Estos filtros solo cambian la vista actual. No modifican tus alertas guardadas.
        </p>

        <form
          onSubmit={handleDashboardFilterSubmit}
          style={{
            display: 'grid',
            gap: '0.75rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            marginBottom: '1rem',
          }}
        >
          <input
            type="text"
            placeholder="Buscar por texto"
            value={dashboardSearch}
            onChange={(event) => setDashboardSearch(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <input
            type="text"
            placeholder="Tecnología"
            value={dashboardTechnology}
            onChange={(event) => setDashboardTechnology(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <input
            type="text"
            placeholder="Ubicación"
            value={dashboardLocation}
            onChange={(event) => setDashboardLocation(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <input
            type="text"
            placeholder="Modalidad"
            value={dashboardModality}
            onChange={(event) => setDashboardModality(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <button type="submit" style={{ padding: '0.75rem' }}>
            Aplicar filtros
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => void handleClearDashboardFilters()}>
            Ver todas las ofertas
          </button>
          <span style={{ color: '#4b5563' }}>
            {activeDashboardFiltersCount > 0
              ? `Vista filtrada con ${activeDashboardFiltersCount} criterio(s).`
              : 'Vista general sin filtros activos.'}
          </span>
        </div>
      </section>

      <section
        style={{
          background: '#fff',
          border: '1px solid #d1d5db',
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Alertas guardadas</h2>
        <p style={{ marginTop: 0, color: '#4b5563' }}>
          Estas alertas sí se guardan y las usa el backend para decidir qué ofertas nuevas te notifica.
        </p>

        <form
          onSubmit={handleCreateNotificationFilter}
          style={{
            display: 'grid',
            gap: '0.75rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            marginBottom: '1rem',
          }}
        >
          <input
            type="text"
            placeholder="Keyword de alerta"
            value={alertKeyword}
            onChange={(event) => setAlertKeyword(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <input
            type="text"
            placeholder="Ubicación"
            value={alertLocation}
            onChange={(event) => setAlertLocation(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <input
            type="text"
            placeholder="Modalidad"
            value={alertModality}
            onChange={(event) => setAlertModality(event.target.value)}
            style={{ padding: '0.75rem' }}
          />

          <button
            type="submit"
            disabled={isSavingNotificationFilter}
            style={{ padding: '0.75rem' }}
          >
            {isSavingNotificationFilter ? 'Guardando...' : 'Guardar alerta'}
          </button>
        </form>

        {notificationFilters.length === 0 ? (
          <p>No tienes alertas guardadas todavía.</p>
        ) : null}

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {notificationFilters.map((filter) => (
            <article
              key={filter.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p style={{ margin: '0 0 0.25rem 0' }}>
                  <strong>Keyword:</strong> {filter.keyword ?? '—'}
                </p>
                <p style={{ margin: '0 0 0.25rem 0' }}>
                  <strong>Ubicación:</strong> {filter.location ?? '—'}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Modalidad:</strong> {filter.modality ?? '—'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => void handleUseNotificationFilterInDashboard(filter)}>
                  Usar en dashboard
                </button>
                <button onClick={() => void handleDeleteNotificationFilter(filter.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
                <section
        style={{
          background: '#fff',
          border: '1px solid #d1d5db',
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Analytics</h2>
        <p style={{ marginTop: 0, color: '#4b5563' }}>
          Estos datos los calcula el microservicio Spring Boot y llegan al frontend a través del backend NestJS.
        </p>

        {analyticsError ? <p style={{ color: '#b91c1c' }}>{analyticsError}</p> : null}

        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <article
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: '0.75rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Top tecnologías</h3>
            {topTechnologies.length === 0 ? <p>Sin datos todavía.</p> : null}
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {topTechnologies.slice(0, 5).map((item) => (
                <p key={item.technology} style={{ margin: 0 }}>
                  <strong>{item.technology}</strong>: {item.count}
                </p>
              ))}
            </div>
          </article>

          <article
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: '0.75rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Empresas top</h3>
            {topCompanies.length === 0 ? <p>Sin datos todavía.</p> : null}
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {topCompanies.slice(0, 5).map((item) => (
                <p key={item.company} style={{ margin: 0 }}>
                  <strong>{item.company}</strong>: {item.count}
                </p>
              ))}
            </div>
          </article>

          <article
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: '0.75rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Salario medio por stack</h3>
            {salaryByStack.length === 0 ? <p>Sin datos todavía.</p> : null}
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {salaryByStack.slice(0, 5).map((item) => (
                <p key={item.technology} style={{ margin: 0 }}>
                  <strong>{item.technology}</strong>: {Math.round(item.averageSalary)} €
                  {' · '}
                  muestra {item.sampleSize}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      {!isLoading && !error ? (
        <section>
          <h2 style={{ marginTop: 0 }}>Ofertas</h2>
          {offers.length === 0 ? <p>No hay ofertas todavía.</p> : null}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {offers.map((offer) => (
              <JobOfferCard
  key={offer.id}
  offer={offer}
  publishedAtLabel={formatPublishedAt(offer.publishedAt)}
/>

            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
