import { spaceObjects } from "../data/spaceObjects";
import type {
  ApiResponse,
  AuthCredentials,
  AuthSession,
  SolarEvent,
  SpaceObject,
} from "../types";

const AUTH_TOKEN_KEY = "space-object-dashboard-token";
const AUTH_USER_KEY = "space-object-dashboard-user";
const FAVOURITES_KEY = "space-object-dashboard-favourites";
const DONKI_CACHE_PREFIX = "space-object-dashboard-donki-cache";
const SSC_CACHE_KEY = "space-object-dashboard-ssc-cache";
const DONKI_CACHE_TTL_MS = 10 * 60 * 1000;
const SSC_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedDonkiEvents = {
  cachedAt: number;
  data: SolarEvent[];
};

type CachedSscObjects = {
  cachedAt: number;
  data: SpaceObject[];
};

const delay = (duration = 550, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("The operation was aborted.", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(resolve, duration);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("The operation was aborted.", "AbortError"));
      },
      { once: true },
    );
  });

const readFavouriteIds = (): string[] => {
  const stored = localStorage.getItem(FAVOURITES_KEY);
  if (!stored) return spaceObjects.filter((item) => item.favourite).map((item) => item.id);

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const writeFavouriteIds = (ids: string[]) => {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
};

const withFavouriteState = (object: SpaceObject): SpaceObject => ({
  ...object,
  favourite: readFavouriteIds().includes(object.id),
});

const shouldSimulateFailure = () =>
  localStorage.getItem("space-object-dashboard-force-error") === "true";

const donkiCacheKey = (options?: { days?: number; limit?: number }) =>
  `${DONKI_CACHE_PREFIX}:${options?.days ?? 30}:${options?.limit ?? 60}`;

const readDonkiCache = (options?: {
  days?: number;
  limit?: number;
}): CachedDonkiEvents | null => {
  const stored = localStorage.getItem(donkiCacheKey(options));
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "cachedAt" in parsed &&
      "data" in parsed &&
      typeof parsed.cachedAt === "number" &&
      Array.isArray(parsed.data)
    ) {
      return parsed as CachedDonkiEvents;
    }
  } catch {
    return null;
  }

  return null;
};

const writeDonkiCache = (
  options: { days?: number; limit?: number } | undefined,
  data: SolarEvent[],
) => {
  localStorage.setItem(
    donkiCacheKey(options),
    JSON.stringify({ cachedAt: Date.now(), data } satisfies CachedDonkiEvents),
  );
};

const readSscCache = (): CachedSscObjects | null => {
  const stored = localStorage.getItem(SSC_CACHE_KEY);
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "cachedAt" in parsed &&
      "data" in parsed &&
      typeof parsed.cachedAt === "number" &&
      Array.isArray(parsed.data)
    ) {
      return parsed as CachedSscObjects;
    }
  } catch {
    return null;
  }

  return null;
};

const writeSscCache = (data: SpaceObject[]) => {
  localStorage.setItem(
    SSC_CACHE_KEY,
    JSON.stringify({ cachedAt: Date.now(), data } satisfies CachedSscObjects),
  );
};

export const authStorage = {
  tokenKey: AUTH_TOKEN_KEY,
  getSession(): AuthSession | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(AUTH_USER_KEY);
    if (!token || !user) return null;

    try {
      return { token, user: JSON.parse(user) as AuthSession["user"] };
    } catch {
      return null;
    }
  },
  clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};

export async function login(
  credentials: AuthCredentials,
): Promise<ApiResponse<AuthSession>> {
  await delay(420);

  if (!credentials.email.includes("@") || credentials.password.length < 6) {
    throw new Error("Use a valid email and a password of at least 6 characters.");
  }

  const session: AuthSession = {
    token: `mock-token-${crypto.randomUUID()}`,
    user: {
      id: "operator-01",
      name: "Mission Operator",
      email: credentials.email,
      role: "Mission Operations Analyst",
    },
  };

  localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));

  return { data: session, status: "success", message: "Login successful" };
}

export async function getObjects(options?: {
  signal?: AbortSignal;
}): Promise<ApiResponse<SpaceObject[]>> {
  await delay(760, options?.signal);

  if (shouldSimulateFailure()) {
    throw new Error("Unable to reach the object telemetry service.");
  }

  return {
    data: spaceObjects.map(withFavouriteState),
    status: "success",
  };
}

export async function getNasaSscObjects(options?: {
  signal?: AbortSignal;
  cache?: "prefer" | "network";
}): Promise<ApiResponse<SpaceObject[]>> {
  const cached = readSscCache();
  if (
    options?.cache !== "network" &&
    cached &&
    Date.now() - cached.cachedAt < SSC_CACHE_TTL_MS
  ) {
    return {
      data: cached.data.map(withFavouriteState),
      status: "success",
      message: "Cached NASA SSC data",
    };
  }

  const response = await fetch("/api/nasa/ssc/objects", {
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error("NASA SSC live satellite feed is unavailable.");
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("data" in payload) ||
    !Array.isArray(payload.data)
  ) {
    throw new Error("NASA SSC returned an unexpected response.");
  }

  const data = payload.data.map((object) => withFavouriteState(object as SpaceObject));
  writeSscCache(data);

  return {
    data,
    status: "success",
    message: "Live NASA SSC data",
  };
}

export async function getDonkiSolarEvents(options?: {
  days?: number;
  limit?: number;
  cache?: "prefer" | "network";
  signal?: AbortSignal;
}): Promise<ApiResponse<SolarEvent[]>> {
  const cacheOptions = { days: options?.days, limit: options?.limit };
  const cached = readDonkiCache(cacheOptions);

  if (
    options?.cache !== "network" &&
    cached &&
    Date.now() - cached.cachedAt < DONKI_CACHE_TTL_MS
  ) {
    return {
      data: cached.data,
      status: "success",
      message: "Cached NASA DONKI data",
    };
  }

  const searchParams = new URLSearchParams();
  if (options?.days) searchParams.set("days", String(options.days));
  if (options?.limit) searchParams.set("limit", String(options.limit));
  const url = `/api/nasa/donki/events${searchParams.size ? `?${searchParams}` : ""}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error("NASA DONKI solar event feed is unavailable.");
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("data" in payload) ||
    !Array.isArray(payload.data)
  ) {
    throw new Error("NASA DONKI returned an unexpected response.");
  }

  const data = payload.data as SolarEvent[];
  writeDonkiCache(cacheOptions, data);

  return {
    data,
    status: "success",
    message: "Live NASA DONKI data",
  };
}

export async function getObjectById(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<SpaceObject>> {
  await delay(520, options?.signal);

  if (shouldSimulateFailure()) {
    throw new Error("Object detail service returned an error.");
  }

  const object = spaceObjects.find((item) => item.id === id);
  if (object) {
    return { data: withFavouriteState(object), status: "success" };
  }

  if (id.startsWith("nasa-")) {
    const response = await getNasaSscObjects({ signal: options?.signal });
    const nasaObject = response.data.find((item) => item.id === id);
    if (nasaObject) {
      return { data: withFavouriteState(nasaObject), status: "success" };
    }
  }

  throw new Error("Space object not found.");
}

export async function toggleFavourite(
  id: string,
): Promise<ApiResponse<{ id: string; favourite: boolean }>> {
  await delay(260);

  const currentIds = readFavouriteIds();
  const favourite = !currentIds.includes(id);
  const nextIds = favourite
    ? [...currentIds, id]
    : currentIds.filter((currentId) => currentId !== id);

  writeFavouriteIds(nextIds);

  return {
    data: { id, favourite },
    status: "success",
    message: favourite ? "Added to watchlist" : "Removed from watchlist",
  };
}
