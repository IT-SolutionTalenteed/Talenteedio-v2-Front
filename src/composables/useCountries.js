// Liste des pays via Intl.DisplayNames (natif navigateur, pas de dépendance)
const ISO_CODES = [
  'AF','AL','DZ','AD','AO','AG','AR','AM','AU','AT','AZ','BS','BH','BD','BB',
  'BY','BE','BZ','BJ','BT','BO','BA','BW','BR','BN','BG','BF','BI','CV','KH',
  'CM','CA','CF','TD','CL','CN','CO','KM','CG','CD','CR','HR','CU','CY','CZ',
  'DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FJ','FI','FR',
  'GA','GM','GE','DE','GH','GR','GD','GT','GN','GW','GY','HT','HN','HU','IS',
  'IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KI','KW','KG',
  'LA','LV','LB','LS','LR','LY','LI','LT','LU','MG','MW','MY','MV','ML','MT',
  'MH','MR','MU','MX','FM','MD','MC','MN','ME','MA','MZ','MM','NA','NR','NP',
  'NL','NZ','NI','NE','NG','NO','OM','PK','PW','PA','PG','PY','PE','PH','PL',
  'PT','QA','RO','RU','RW','KN','LC','VC','WS','SM','ST','SA','SN','RS','SC',
  'SL','SG','SK','SI','SB','SO','ZA','SS','ES','LK','SD','SR','SE','CH','SY',
  'TW','TJ','TZ','TH','TL','TG','TO','TT','TN','TR','TM','TV','UG','UA','AE',
  'GB','US','UY','UZ','VU','VE','VN','YE','ZM','ZW','MQ','RE','GP','GF','NC',
  'PF','PM','WF','YT','MF','BL',
]

let _cached = null

export function useCountries(locale = 'fr') {
  if (_cached) return _cached

  try {
    const display = new Intl.DisplayNames([locale], { type: 'region' })
    _cached = ISO_CODES
      .map(code => ({ code, name: display.of(code) ?? code }))
      .filter(c => c.name !== c.code)
      .sort((a, b) => a.name.localeCompare(b.name, locale))
  } catch {
    _cached = ISO_CODES.map(code => ({ code, name: code }))
  }

  return _cached
}
