import { supabase } from "@/integrations/supabase/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export interface SiteSettings {
  contact_phone: string
  contact_email: string
  bank_account_holder: string
  bank_account_number: string
  bank_name: string
  document_management_system_url: string
  document_free_sale_url: string
  document_certificate_of_competence_url: string
}

const DEFAULTS: SiteSettings = {
  contact_phone: "+251 911 000 000",
  contact_email: "orders@nordicseafood.et",
  bank_account_holder: "Nordic Seafood Imports",
  bank_account_number: "1000693338623",
  bank_name: "Commercial Bank of Ethiopia",
  document_management_system_url: "",
  document_free_sale_url: "",
  document_certificate_of_competence_url: "",
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key, value")

      if (error) throw error

      const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
      return {
        contact_phone: map.contact_phone ?? DEFAULTS.contact_phone,
        contact_email: map.contact_email ?? DEFAULTS.contact_email,
        bank_account_holder: map.bank_account_holder ?? DEFAULTS.bank_account_holder,
        bank_account_number: map.bank_account_number ?? DEFAULTS.bank_account_number,
        bank_name: map.bank_name ?? DEFAULTS.bank_name,
        document_management_system_url:
          map.document_management_system_url ?? DEFAULTS.document_management_system_url,
        document_free_sale_url: map.document_free_sale_url ?? DEFAULTS.document_free_sale_url,
        document_certificate_of_competence_url:
          map.document_certificate_of_competence_url ??
          DEFAULTS.document_certificate_of_competence_url,
      }
    },
  })
}

export const useSiteSettingsMutation = () => {
  const queryClient = useQueryClient()

  const update = async (settings: Partial<SiteSettings>) => {
    const rows = (Object.entries(settings) as [string, string][]).map(([key, value]) => ({
      key,
      value,
    }))
    if (rows.length === 0) return

    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" })
    if (error) throw error

    queryClient.invalidateQueries({ queryKey: ["site_settings"] })
  }

  return { update }
}
