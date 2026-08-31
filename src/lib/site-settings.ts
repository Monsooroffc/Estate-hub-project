import { getDb, isSupabaseConfigured } from '@/lib/supabase/db'

export interface HomepageSettings {
  companyName: string
  companyShortName: string
  tagline: string
  badge: string
  heroBadge: string
  heroTitleLineOne: string
  heroTitleLineTwo: string
  heroSubtitle: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  aboutTitle: string
  aboutDescription: string
  directorName: string
  directorRole: string
  phone: string
  email: string
  address: string
  logoText: string
  brandImage: string
  aboutImage: string
  showcaseVideoUrl: string
  showcasePosterUrl: string
}

export const HOME_SETTINGS_KEY = 'rrr-housing-homepage-settings-v1'
export const HOME_SETTINGS_DB_KEY = 'homepage'

export const defaultHomepageSettings: HomepageSettings = {
  companyName: 'RRR Housing',
  companyShortName: 'Real Rise Resource',
  tagline: 'Faith | Integrity | Truth',
  badge: 'RERA Approved · DTCP & CMDA · ISO 27001:2013',
  heroBadge: 'RERA Approved · DTCP & CMDA · ISO 27001:2013',
  heroTitleLineOne: 'Own a Piece of',
  heroTitleLineTwo: "Chennai's Future",
  heroSubtitle:
    'RRR Housing — Faith | Integrity | Truth. DTCP & CMDA approved plots, flats & villas across Porur and West Chennai, handpicked for families and investors.',
  heroPrimaryCta: 'Browse Properties',
  heroSecondaryCta: 'Book a Free Site Visit',
  aboutTitle: 'About RRR Housing',
  aboutDescription:
    'RRR Housing (Real Rise Resource) is a RERA-approved, ISO 27001:2013 certified real estate developer based in Porur, Chennai. We specialise in DTCP & CMDA approved plots, flats & villas — helping families and investors own clear-title properties with complete transparency.',
  directorName: 'R.Abiha Begum',
  directorRole: 'Director',
  phone: '+91 99627 82486',
  email: 'abithabegum52143@gmail.com',
  address: 'No.100/5, 2nd Floor, Lakshmi Nagar, 1st Main Road, Porur, Chennai - 600116',
  logoText: 'HOUSING',
  brandImage:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  aboutImage:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
  showcaseVideoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  showcasePosterUrl:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
}

export function getDefaultHomepageSettings(): HomepageSettings {
  return { ...defaultHomepageSettings }
}

export function normalizeHomepageSettings(value?: Partial<HomepageSettings>): HomepageSettings {
  return {
    ...getDefaultHomepageSettings(),
    ...(value ?? {}),
  }
}

export function loadHomepageSettings(): HomepageSettings {
  if (typeof window === 'undefined') return getDefaultHomepageSettings()

  try {
    const saved = window.localStorage.getItem(HOME_SETTINGS_KEY)
    if (!saved) {
      window.localStorage.setItem(HOME_SETTINGS_KEY, JSON.stringify(getDefaultHomepageSettings()))
      return getDefaultHomepageSettings()
    }

    return normalizeHomepageSettings(JSON.parse(saved) as Partial<HomepageSettings>)
  } catch (error) {
    console.warn('[homepage-settings] Failed to read settings from localStorage:', error)
    return getDefaultHomepageSettings()
  }
}

export async function loadHomepageSettingsRemote(): Promise<HomepageSettings> {
  if (!isSupabaseConfigured) {
    return loadHomepageSettings()
  }

  try {
    const { data, error } = await getDb()
      .from('site_settings')
      .select('value')
      .eq('key', HOME_SETTINGS_DB_KEY)
      .maybeSingle()

    if (!error && data?.value) {
      const merged = normalizeHomepageSettings(data.value as Partial<HomepageSettings>)
      saveHomepageSettings(merged)
      return merged
    }

    const defaultValue = getDefaultHomepageSettings()
    await saveHomepageSettingsRemote(defaultValue)
    return defaultValue
  } catch (error) {
    console.warn('[homepage-settings] Failed to load settings from Supabase:', error)
    return loadHomepageSettings()
  }
}

export function saveHomepageSettings(settings: HomepageSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HOME_SETTINGS_KEY, JSON.stringify(settings))
  window.dispatchEvent(new Event('rrr-home-settings-updated'))
}

export async function saveHomepageSettingsRemote(settings: HomepageSettings): Promise<HomepageSettings> {
  if (!isSupabaseConfigured) {
    saveHomepageSettings(settings)
    return settings
  }

  try {
    const payload = normalizeHomepageSettings(settings)
    const { data, error } = await getDb()
      .from('site_settings')
      .upsert({ key: HOME_SETTINGS_DB_KEY, value: payload }, { onConflict: 'key' })
      .select()
      .single()

    if (error) throw error

    const savedSettings = normalizeHomepageSettings((data?.value as Partial<HomepageSettings>) ?? payload)
    saveHomepageSettings(savedSettings)
    return savedSettings
  } catch (error) {
    console.warn('[homepage-settings] Failed to save settings to Supabase:', error)
    saveHomepageSettings(settings)
    return settings
  }
}
