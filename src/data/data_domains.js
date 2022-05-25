
export function getDataDomain (key) {
  console.log('getDataDomain');
  console.log(key);

  return getDataDomains().filter((domain) => domain.key === key)[0];
}

export const getDataDomains = () => [
  {
      "key": "clients",
      "label": "Clients",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Clients%20report.htm",
      "description": "The data domain for all clients",
      "number_of_entities": 110
  },
  {
      "key": "collaterals",
      "label": "Collaterals",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Collaterals%20report.htm",
      "description": "The data domain for all collaterals",
      "number_of_entities": 13
  },
  {
      "key": "deposits",
      "label": "Deposits",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Deposits%20report.htm",
      "description": "The data domain for all deposits",
      "number_of_entities": 5
  },
  {
      "key": "finance",
      "label": "Finance",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Finance%20report.htm",
      "description": "The data domain for all finance",
      "number_of_entities": 2
  },
  {
      "key": "instruments",
      "label": "Instruments",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Instruments%20report.htm",
      "description": "The data domain for all instruments",
      "number_of_entities": 44
  },
  {
      "key": "investments",
      "label": "Investments",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Investments%20report.htm",
      "description": "The data domain for all investments",
      "number_of_entities": 59
  },
  {
      "key": "loans",
      "label": "Loans",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Loans%20report.htm",
      "description": "The data domain for all loans",
      "number_of_entities": 32
  },
  {
      "key": "payments",
      "label": "Payments",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Payments%20report.htm",
      "description": "The data domain for all payments",
      "number_of_entities": 23
  },
  {
      "key": "products",
      "label": "Products",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Products%20report.htm",
      "description": "The data domain for all products",
      "number_of_entities": 41
  },
  {
      "key": "risk",
      "label": "Risk",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Risk%20report.htm",
      "description": "The data domain for all risk",
      "number_of_entities": 10
  },
  {
      "key": "treasury",
      "label": "Treasury",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Treasury%20report.htm",
      "description": "The data domain for all treasury",
      "number_of_entities": 9
  },
  {
      "key": "the_firm",
      "label": "The Firm",
      "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20thefirm%20report.htm",
      "description": "The data domain for all The Firm",
      "number_of_entities": 75
  }
]