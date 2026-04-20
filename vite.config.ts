import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { ObjectStatus, RiskLevel, SolarEvent, SolarEventRisk, SolarEventType, SpaceObject } from './src/types'

const NASA_SSC_BASE_URL = 'https://sscweb.gsfc.nasa.gov/WS/sscr/2'
const NASA_DONKI_BASE_URL = 'https://api.nasa.gov/DONKI'
const EARTH_RADIUS_KM = 6371

type SscCoordinateData = {
  Latitude?: unknown
  Longitude?: unknown
  RadialLength?: unknown
}

type SscSatelliteData = {
  Id?: unknown
  Coordinates?: unknown
  Time?: unknown
  RadialLength?: unknown
}

type DonkiFlare = {
  flrID?: string
  beginTime?: string
  peakTime?: string
  classType?: string
  sourceLocation?: string
  activeRegionNum?: number
  link?: string
}

type DonkiCme = {
  activityID?: string
  startTime?: string
  sourceLocation?: string
  note?: string
  link?: string
  cmeAnalyses?: Array<{
    isMostAccurate?: boolean
    speed?: number
    halfAngle?: number
    type?: string
  }>
}

type DonkiGst = {
  gstID?: string
  startTime?: string
  link?: string
  allKpIndex?: Array<{
    observedTime?: string
    kpIndex?: number
    source?: string
  }>
}

type DonkiNotification = {
  messageType?: string
  messageID?: string
  messageURL?: string
  messageIssueTime?: string
  messageBody?: string
}

const sscSatellites = [
  'iss',
  'mms1',
  'mms2',
  'mms3',
  'mms4',
  'ace',
  'wind',
  'themisa',
]

const satelliteMeta: Record<
  string,
  Pick<SpaceObject, 'name' | 'category' | 'owner' | 'description' | 'imageUrl' | 'imageHistory'>
> = {
  iss: {
    name: 'International Space Station',
    category: 'Crewed orbital laboratory',
    owner: 'NASA / International Partners',
    description:
      'A live NASA SSC position for the International Space Station, shown as a low Earth orbit operations target.',
    imageUrl:
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80',
    imageHistory: [
      {
        id: 'img-iss-1',
        title: 'Low Earth orbit operations pass',
        capturedAt: 'Live SSC track',
        url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'img-iss-2',
        title: 'Crewed platform context',
        capturedAt: 'Recent visual record',
        url: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  ace: {
    name: 'ACE',
    category: 'Solar wind monitor',
    owner: 'NASA',
    description:
      'Advanced Composition Explorer live SSC location, monitoring solar wind from a deep-space vantage point.',
    imageUrl:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
    imageHistory: [
      {
        id: 'img-ace-1',
        title: 'Solar wind monitoring track',
        capturedAt: 'Live SSC track',
        url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'img-ace-2',
        title: 'Heliospheric context',
        capturedAt: 'Recent visual record',
        url: 'https://images.unsplash.com/photo-1537420327992-d6e192287183?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  wind: {
    name: 'Wind',
    category: 'Solar-terrestrial observatory',
    owner: 'NASA',
    description:
      'NASA Wind spacecraft live SSC location for solar wind, plasma, and magnetic field observations.',
    imageUrl:
      'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80',
    imageHistory: [
      {
        id: 'img-wind-1',
        title: 'Solar-terrestrial observation pass',
        capturedAt: 'Live SSC track',
        url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'img-wind-2',
        title: 'Magnetic field event context',
        capturedAt: 'Recent visual record',
        url: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  themisa: {
    name: 'THEMIS-A',
    category: 'Magnetosphere probe',
    owner: 'NASA',
    description:
      'THEMIS-A live SSC location used to study substorms and energy transfer through Earth’s magnetosphere.',
    imageUrl:
      'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=900&q=80',
    imageHistory: [
      {
        id: 'img-themisa-1',
        title: 'Magnetosphere survey arc',
        capturedAt: 'Live SSC track',
        url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'img-themisa-2',
        title: 'Auroral event context',
        capturedAt: 'Recent visual record',
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
}

const mmsMeta = (id: string) => ({
  name: `MMS-${id.replace('mms', '')}`,
  category: 'Magnetospheric Multiscale mission',
  owner: 'NASA',
  description:
    'One of NASA’s Magnetospheric Multiscale formation-flying spacecraft, tracked live through SSC position data.',
  imageUrl:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  imageHistory: [
    {
      id: `img-${id}-1`,
      title: 'Formation-flight position sample',
      capturedAt: 'Live SSC track',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: `img-${id}-2`,
      title: 'Magnetic reconnection event context',
      capturedAt: 'Recent visual record',
      url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    },
  ],
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const unwrapSscValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    if (value.length === 2 && typeof value[0] === 'string') {
      return unwrapSscValue(value[1])
    }

    return value.map(unwrapSscValue)
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, unwrapSscValue(nestedValue)]),
    )
  }

  return value
}

const numberAt = (value: unknown, index: number): number | null => {
  if (!Array.isArray(value)) return null
  const numericValue = value[index]
  return typeof numericValue === 'number' ? numericValue : null
}

const stringAt = (value: unknown, index: number): string | null => {
  if (!Array.isArray(value)) return null
  const stringValue = value[index]
  return typeof stringValue === 'string' ? stringValue : null
}

const normalizeLongitude = (longitude: number) =>
  longitude > 180 ? longitude - 360 : longitude

const riskFromAltitude = (altitude: number): RiskLevel => {
  if (altitude < 800) return 'medium'
  if (altitude > 80000) return 'high'
  return 'low'
}

const statusFromAge = (lastUpdated: string | null): ObjectStatus => {
  if (!lastUpdated) return 'warning'
  const ageMinutes = (Date.now() - new Date(lastUpdated).getTime()) / 60000
  return ageMinutes > 180 ? 'warning' : 'active'
}

const radiusFromAltitude = (altitude: number) =>
  1.72 + Math.min(1.62, (Math.log1p(Math.max(altitude, 1)) / Math.log1p(170000)) * 1.62)

const formatUtcForSsc = (date: Date) =>
  date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

const formatDateOnly = (date: Date) => date.toISOString().slice(0, 10)

const toSpaceObject = (satellite: SscSatelliteData): SpaceObject | null => {
  const id = typeof satellite.Id === 'string' ? satellite.Id.toLowerCase() : null
  const coordinates = Array.isArray(satellite.Coordinates)
    ? (satellite.Coordinates[0] as SscCoordinateData | undefined)
    : undefined

  if (!id || !coordinates) return null

  const latitudeValues = coordinates.Latitude
  const longitudeValues = coordinates.Longitude
  const radialValues = satellite.RadialLength
  const timeValues = satellite.Time

  if (!Array.isArray(latitudeValues) || !Array.isArray(longitudeValues) || !Array.isArray(radialValues)) {
    return null
  }

  const latestIndex = Math.max(0, Math.min(latitudeValues.length, longitudeValues.length, radialValues.length) - 1)
  const latitude = numberAt(latitudeValues, latestIndex)
  const longitude = numberAt(longitudeValues, latestIndex)
  const radialLength = numberAt(radialValues, latestIndex)
  const lastUpdated = stringAt(timeValues, latestIndex)

  if (latitude === null || longitude === null || radialLength === null) return null

  const altitude = Math.max(0, Math.round(radialLength - EARTH_RADIUS_KM))
  const metadata = satelliteMeta[id] ?? mmsMeta(id)
  const status = statusFromAge(lastUpdated)
  const riskLevel = riskFromAltitude(altitude)

  return {
    id: `nasa-${id}`,
    name: metadata.name,
    status,
    altitude,
    lastUpdated: lastUpdated ?? new Date().toISOString(),
    riskLevel,
    imageUrl: metadata.imageUrl,
    imageHistory: metadata.imageHistory,
    description: `${metadata.description} Coordinates are sourced from NASA SSC in GEO latitude/longitude.`,
    category: metadata.category,
    velocity: 'Live SSC ephemeris',
    inclination: 'NASA SSC GEO',
    owner: metadata.owner,
    telemetryHealth: status === 'active' ? 94 : 72,
    favourite: false,
    globe: {
      latitude,
      longitude: normalizeLongitude(longitude),
      orbitalRadius: radiusFromAltitude(altitude),
    },
    timeline: [
      {
        id: `evt-${id}-live`,
        timestamp: 'Live SSC',
        title: 'NASA SSC position ingested',
        description: `Latest GEO sample received at ${lastUpdated ?? 'the current request window'}.`,
      },
      {
        id: `evt-${id}-range`,
        timestamp: 'Current window',
        title: 'Orbit path refreshed',
        description: `Altitude normalized to ${altitude.toLocaleString()} km for globe visualization.`,
      },
    ],
  }
}

const sendJson = (response: ServerResponse, statusCode: number, body: unknown) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

const flareRisk = (classType?: string): SolarEventRisk => {
  if (!classType) return 'low'
  const letter = classType.charAt(0).toUpperCase()
  const magnitude = Number.parseFloat(classType.slice(1))
  if (letter === 'X' || (letter === 'M' && magnitude >= 5)) return 'high'
  if (letter === 'M' || (letter === 'C' && magnitude >= 5)) return 'medium'
  return 'low'
}

const cmeRisk = (speed?: number, halfAngle?: number): SolarEventRisk => {
  if ((speed ?? 0) >= 1000 || (halfAngle ?? 0) >= 60) return 'high'
  if ((speed ?? 0) >= 500 || (halfAngle ?? 0) >= 30) return 'medium'
  return 'low'
}

const gstRisk = (kp?: number): SolarEventRisk => {
  if ((kp ?? 0) >= 7) return 'high'
  if ((kp ?? 0) >= 5) return 'medium'
  return 'low'
}

const notificationRisk = (type?: string, body?: string): SolarEventRisk => {
  const text = `${type ?? ''} ${body ?? ''}`.toLowerCase()
  if (text.includes('severe') || text.includes('significantly elevated') || text.includes('above 1000')) {
    return 'high'
  }
  if (['sep', 'rbe', 'gst', 'ips'].includes((type ?? '').toLowerCase()) || text.includes('elevated')) {
    return 'medium'
  }
  return 'low'
}

const effectFor = (type: SolarEventType, risk: SolarEventRisk, metric: string): string => {
  if (risk === 'high') {
    return type === 'GST'
      ? `High risk estimate: ${metric} could increase atmospheric drag on LEO spacecraft, introduce attitude-control loads, and disrupt GNSS/radio links.`
      : `High risk estimate: ${metric} could raise radiation exposure, cause single-event upsets, and temporarily degrade satellite communications or sensors.`
  }

  if (risk === 'medium') {
    return `Moderate risk estimate: ${metric} may require closer telemetry monitoring, drag-model updates for LEO assets, and extra caution around sensitive payload operations.`
  }

  return `Low risk estimate: ${metric} is unlikely to cause major satellite impacts, but it remains useful context for operations monitoring.`
}

const toFlareEvent = (event: DonkiFlare): SolarEvent | null => {
  if (!event.flrID || !event.beginTime) return null
  const risk = flareRisk(event.classType)
  const metric = event.classType ? `class ${event.classType}` : 'flare classification unavailable'

  return {
    id: event.flrID,
    type: 'FLR',
    title: `Solar flare ${event.classType ?? ''}`.trim(),
    occurredAt: event.peakTime ?? event.beginTime,
    source: 'NASA DONKI Solar Flare',
    risk,
    summary: `Solar flare from ${event.sourceLocation || 'an unlisted source region'}${event.activeRegionNum ? `, active region ${event.activeRegionNum}` : ''}.`,
    satelliteEffect: effectFor('FLR', risk, metric),
    metricLabel: 'Flare class',
    metricValue: event.classType ?? 'Unknown',
    link: event.link,
  }
}

const toCmeEvent = (event: DonkiCme): SolarEvent | null => {
  if (!event.activityID || !event.startTime) return null
  const analysis = event.cmeAnalyses?.find((item) => item.isMostAccurate) ?? event.cmeAnalyses?.[0]
  const speed = analysis?.speed
  const halfAngle = analysis?.halfAngle
  const risk = cmeRisk(speed, halfAngle)
  const metric = `${speed ?? 'unknown'} km/s${halfAngle ? `, ${halfAngle} deg half-angle` : ''}`

  return {
    id: event.activityID,
    type: 'CME',
    title: 'Coronal mass ejection',
    occurredAt: event.startTime,
    source: 'NASA DONKI CME',
    risk,
    summary: event.note || `CME observed from ${event.sourceLocation || 'an unlisted solar source region'}.`,
    satelliteEffect: effectFor('CME', risk, metric),
    metricLabel: 'CME speed',
    metricValue: speed ? `${speed} km/s` : 'Unknown',
    link: event.link,
  }
}

const toGstEvent = (event: DonkiGst): SolarEvent | null => {
  if (!event.gstID || !event.startTime) return null
  const strongest = event.allKpIndex?.reduce((max, item) => ((item.kpIndex ?? 0) > (max.kpIndex ?? 0) ? item : max))
  const kp = strongest?.kpIndex
  const risk = gstRisk(kp)
  const metric = kp ? `Kp ${kp.toFixed(2)}` : 'Kp unavailable'

  return {
    id: event.gstID,
    type: 'GST',
    title: 'Geomagnetic storm',
    occurredAt: strongest?.observedTime ?? event.startTime,
    source: 'NASA DONKI Geomagnetic Storm',
    risk,
    summary: `Geomagnetic storm record with peak ${metric}${strongest?.source ? ` from ${strongest.source}` : ''}.`,
    satelliteEffect: effectFor('GST', risk, metric),
    metricLabel: 'Peak Kp',
    metricValue: kp ? kp.toFixed(2) : 'Unknown',
    link: event.link,
  }
}

const cleanNotificationSummary = (body?: string) => {
  if (!body) return 'DONKI space-weather notification.'
  const summaryIndex = body.indexOf('## Summary:')
  const text = summaryIndex >= 0 ? body.slice(summaryIndex + 11) : body
  return text
    .replace(/##.*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280)
}

const toNotificationEvent = (event: DonkiNotification): SolarEvent | null => {
  if (!event.messageID || !event.messageIssueTime) return null
  const type = (event.messageType || 'Notification') as SolarEventType
  if (!['SEP', 'RBE', 'HSS', 'GST', 'CME', 'FLR', 'IPS', 'MPC', 'Notification'].includes(type)) {
    return null
  }
  const normalizedType: SolarEventType = ['SEP', 'RBE', 'HSS', 'GST', 'CME', 'FLR'].includes(type)
    ? type
    : 'Notification'
  const risk = notificationRisk(event.messageType, event.messageBody)
  const metric = `${event.messageType ?? 'DONKI'} notification`

  return {
    id: event.messageID,
    type: normalizedType,
    title: `${event.messageType ?? 'Space weather'} notification`,
    occurredAt: event.messageIssueTime,
    source: 'NASA DONKI Notifications',
    risk,
    summary: cleanNotificationSummary(event.messageBody),
    satelliteEffect: effectFor(normalizedType, risk, metric),
    metricLabel: 'Notification',
    metricValue: event.messageType ?? 'DONKI',
    link: event.messageURL,
  }
}

const uniqueSortedEvents = (events: SolarEvent[]) => {
  const seen = new Set<string>()
  return events
    .filter((event) => {
      if (seen.has(event.id)) return false
      seen.add(event.id)
      return true
    })
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
}

const fetchDonki = async <T>(path: string, env: Record<string, string>, startDate: string, endDate: string): Promise<T[]> => {
  const nasaKey = env.NASA_API || 'DEMO_KEY'
  const url = new URL(`${NASA_DONKI_BASE_URL}/${path}`)
  url.searchParams.set('startDate', startDate)
  url.searchParams.set('endDate', endDate)
  url.searchParams.set('api_key', nasaKey)
  if (path === 'notifications') {
    url.searchParams.set('type', 'all')
  }

  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) {
    throw new Error(`DONKI ${path} request failed with ${response.status}`)
  }

  const payload = await response.json() as unknown
  return Array.isArray(payload) ? (payload as T[]) : []
}

const nasaSscPlugin = (): Plugin => ({
  name: 'nasa-ssc-proxy',
  configureServer(server) {
    const env = loadEnv(server.config.mode, process.cwd(), '')

    server.middlewares.use('/api/nasa/ssc/objects', async (request: IncomingMessage, response) => {
      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'Method not allowed' })
        return
      }

      const end = new Date()
      const start = new Date(end.getTime() - 60 * 60 * 1000)
      const timeRange = `${formatUtcForSsc(start)},${formatUtcForSsc(end)}`
      const url = `${NASA_SSC_BASE_URL}/locations/${sscSatellites.join(',')}/${timeRange}/geo/?resolutionFactor=10`

      try {
        const nasaResponse = await fetch(url, {
          headers: {
            Accept: 'application/json',
            ...(env.NASA_API ? { 'X-API-Key': env.NASA_API } : {}),
          },
        })

        const payload = await nasaResponse.json() as unknown
        const unwrapped = unwrapSscValue(payload)

        if (!nasaResponse.ok) {
          sendJson(response, nasaResponse.status, {
            error: 'NASA SSC request failed',
            detail: unwrapped,
          })
          return
        }

        if (!isRecord(unwrapped) || !isRecord(unwrapped.Result)) {
          sendJson(response, 502, { error: 'Unexpected NASA SSC response shape' })
          return
        }

        const result = unwrapped.Result
        if (result.StatusCode !== 'SUCCESS') {
          sendJson(response, 502, {
            error: 'NASA SSC returned a non-success status',
            detail: result,
          })
          return
        }

        const data = Array.isArray(result.Data) ? result.Data : []
        const objects = data
          .filter(isRecord)
          .map((satellite) => toSpaceObject(satellite as SscSatelliteData))
          .filter((object): object is SpaceObject => object !== null)

        sendJson(response, 200, {
          data: objects,
          source: 'NASA Satellite Situation Center',
          generatedAt: new Date().toISOString(),
        })
      } catch (error) {
        sendJson(response, 502, {
          error: 'Unable to reach NASA SSC',
          message: error instanceof Error ? error.message : 'Unknown NASA proxy error',
        })
      }
    })

    server.middlewares.use('/api/nasa/donki/events', async (request: IncomingMessage, response) => {
      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'Method not allowed' })
        return
      }

      const requestUrl = new URL(request.url ?? '', 'http://localhost')
      const daysParam = Number.parseInt(requestUrl.searchParams.get('days') ?? '30', 10)
      const limitParam = Number.parseInt(requestUrl.searchParams.get('limit') ?? '60', 10)
      const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 30) : 30
      const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 120) : 60
      const end = new Date()
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
      const startDate = formatDateOnly(start)
      const endDate = formatDateOnly(end)

      try {
        const [flares, cmes, storms, notifications] = await Promise.all([
          fetchDonki<DonkiFlare>('FLR', env, startDate, endDate),
          fetchDonki<DonkiCme>('CME', env, startDate, endDate),
          fetchDonki<DonkiGst>('GST', env, startDate, endDate),
          fetchDonki<DonkiNotification>('notifications', env, startDate, endDate),
        ])

        const events = uniqueSortedEvents([
          ...flares.map(toFlareEvent).filter((event): event is SolarEvent => event !== null),
          ...cmes.map(toCmeEvent).filter((event): event is SolarEvent => event !== null),
          ...storms.map(toGstEvent).filter((event): event is SolarEvent => event !== null),
          ...notifications.map(toNotificationEvent).filter((event): event is SolarEvent => event !== null),
        ])

        sendJson(response, 200, {
          data: events.slice(0, limit),
          totalAvailable: events.length,
          highRiskCount: events.filter((event) => event.risk === 'high').length,
          source: 'NASA DONKI',
          generatedAt: new Date().toISOString(),
        })
      } catch (error) {
        sendJson(response, 502, {
          error: 'Unable to reach NASA DONKI',
          message: error instanceof Error ? error.message : 'Unknown DONKI proxy error',
        })
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [nasaSscPlugin(), react(), tailwindcss()],
})
