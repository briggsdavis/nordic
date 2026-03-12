import { supabase } from "@/integrations/supabase/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export interface SiteSettings {
  contact_phone: string
  contact_email: string
}

const DEFAULTS: SiteSettings = {
  contact_phone: "+251 911 000 000",
  contact_email: "orders@nordicseafood.et",
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")

      if (error) throw error

      const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
      return {
        contact_phone: map.contact_phone ?? DEFAULTS.contact_phone,
        contact_email: map.contact_email ?? DEFAULTS.contact_email,
      }
    },
  })
}

export const useSiteSettingsMutation = () => {
  const queryClient = useQueryClient()

  const update = async (settings: Partial<SiteSettings>) => {
    const entries = Object.entries(settings) as [string, string][]
    for (const [key, value] of entries) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("key", key)
      if (error) throw error
    }
    queryClient.invalidateQueries({ queryKey: ["site_settings"] })
  }

  return { update }
}
