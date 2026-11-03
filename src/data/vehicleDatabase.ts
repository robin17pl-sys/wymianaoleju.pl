/**
 * Obszerna baza danych pojazdów i oficjalnych specyfikacji doboru oleju.
 * Uwzględnia aprobaty OEM, pojemności układu smarowania (z filtrem)
 * oraz rekomendowane produkty MOTUL, LIQUI MOLY i VALVOLINE.
 */

export interface OilProductMatch {
  brand: 'Motul' | 'Liqui Moly' | 'Valvoline';
  productName: string;
  series: string;
  viscosity: string;
  specs: string[];
  description: string;
  badge?: string;
}

export interface EngineOption {
  id: string;
  name: string;
  fuel: 'Benzyna' | 'Diesel' | 'Hybryda';
  displacement: string; // np. "1968 cm³"
  powerHp: number; // np. 150 KM
  engineCode?: string; // np. "EA288 (CRMB)"
  oilCapacityLiters: number; // np. 4.7
  recommendedViscosity: string; // np. "5W-30" or "0W-20"
  oemStandards: string[]; // np. ["VW 504.00 / 507.00", "ACEA C3"]
  serviceIntervalKm: string; // "15 000 km / 1 rok"
  filterTier: 'Standard' | 'Premium' | 'Performance';
  motulCatalogReference: string;
  notes?: string;
  products: {
    motul: OilProductMatch;
    liquiMoly: OilProductMatch;
    valvoline: OilProductMatch;
  };
}

export interface VehicleGeneration {
  id: string;
  name: string;
  years: string;
  engines: EngineOption[];
}

export interface VehicleModel {
  id: string;
  name: string;
  generations: VehicleGeneration[];
}

export interface VehicleMake {
  id: string;
  name: string;
  country: string;
  models: VehicleModel[];
}

// -------------------------------------------------------------
// Helper generators for standardized OEM matching specifications
// -------------------------------------------------------------

function matchVag507(viscosity = '5W-30'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: '8100 X-clean+ 5W-30',
      series: '8100 Synthese-Technologie',
      viscosity,
      specs: ['VW 504.00 / 507.00', 'BMW LL-04', 'MB 229.51', 'Porsche C30'],
      description: 'W 100% syntetyczny olej opracowany specjalnie do silników grupy VAG z filtrem DPF i pompowtryskiwaczami lub Common Rail.',
      badge: 'Oficjalna aprobata VAG'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 4200 5W-30 New Generation',
      series: 'Top Tec Synthetic Technology',
      viscosity,
      specs: ['VW 504.00 / 507.00', 'ACEA C3', 'MB 229.51 / 229.52', 'BMW LL-04'],
      description: 'Nowoczesny olej silnikowy typu Low-SAPS o doskonałych właściwościach przeciwzużyciowych i redukcji osadów.',
      badge: 'Made in Germany'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower XL-III C3 5W-30',
      series: 'SynPower Premium Synthetic',
      viscosity,
      specs: ['VW 504.00 / 507.00', 'MB-Approval 229.51', 'Porsche C30', 'BMW LL-04'],
      description: 'W pełni syntetyczny olej klasy premium opracowany z myślą o maksymalnej czystości układu i ochronie filtra cząstek stałych.',
      badge: 'Motorsport Heritage'
    }
  };
}

function matchVag508(viscosity = '0W-20'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: 'Specific 508 00 509 00 0W-20',
      series: 'Motul Specific Dedicated OEM',
      viscosity,
      specs: ['VW 508.00 / 509.00', 'ACEA C5', 'Porsche C20'],
      description: 'Dedykowany olej o ultra-niskiej lepkości HTHS, zapewniający redukcję tarcia wewnętrznego i optymalne spalanie.',
      badge: 'Dedykowana norma VW'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 6200 0W-20',
      series: 'Top Tec Special Eco',
      viscosity,
      specs: ['VW 508.00 / 509.00', 'ACEA C5', 'Porsche C20'],
      description: 'Oficjalnie certyfikowany olej o obniżonej lepkości do silników nowej generacji VW Group z filtrem GPF.',
      badge: 'Oficjalna licencja VW'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower MST C5 0W-20',
      series: 'SynPower Next-Gen Eco',
      viscosity,
      specs: ['VW 508.00 / 509.00', 'ACEA C5', 'Porsche C20'],
      description: 'Innowacyjna formuła syntetyczna minimalizująca zużycie paliwa i gwarantująca błyskawiczny rozruch na zimno.',
      badge: 'Oszczędność paliwa'
    }
  };
}

function matchBmwLL04(viscosity = '5W-30'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: '8100 X-clean EFE 5W-30',
      series: '8100 Extra Fuel Economy',
      viscosity,
      specs: ['BMW Longlife-04', 'MB-Approval 229.52', 'ACEA C2/C3'],
      description: 'Olej o podwyższonej stabilności filmu smarnego i obniżonym tarciu, dedykowany silnikom BMW B47, N47 i B57.',
      badge: 'Oficjalna aprobata BMW'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 4600 5W-30',
      series: 'Top Tec Longlife',
      viscosity,
      specs: ['BMW Longlife-04', 'MB 229.52', 'ACEA C3'],
      description: 'Chroni łańcuch rozrządu przed rozciąganiem i zapobiega gromadzeniu szlamu w kanałach zmiennych faz.',
      badge: 'Ochrona rozrządu'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower MST C3 5W-30',
      series: 'SynPower MST',
      viscosity,
      specs: ['BMW Longlife-04', 'MB-Approval 229.51', 'ACEA C3'],
      description: 'Zaawansowany olej syntetyczny chroniący układ doładowania TwinPower Turbo przed koksowaniem oleju.',
      badge: 'TwinPower Ready'
    }
  };
}

function matchMb22952(viscosity = '5W-30'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: '8100 X-clean EFE 5W-30',
      series: '8100 Synthese-Technologie',
      viscosity,
      specs: ['MB-Approval 229.52', 'BMW LL-04', 'ACEA C2/C3'],
      description: 'Oficjalna certyfikacja Mercedes-Benz 229.52. Maksymalna odporność na utlenianie i ochrona układu SCR.',
      badge: 'Aprobata MB 229.52'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 4600 5W-30',
      series: 'Top Tec Formula',
      viscosity,
      specs: ['MB-Approval 229.52 / 229.51', 'ACEA C3', 'BMW LL-04'],
      description: 'Zapewnia wzorową czystość komór spalania i współpracę z technologią NANOSLIDE® silników OM654 i OM656.',
      badge: 'Dedykowany do MB'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower MST C3 5W-30',
      series: 'SynPower MST',
      viscosity,
      specs: ['MB-Approval 229.52', 'ACEA C3'],
      description: 'Znakomita ochrona przed degradacją termiczną i kwasami powstającymi podczas spalania oleju napędowego.',
      badge: 'Aprobata MB'
    }
  };
}

function matchAsianHybrid(viscosity = '0W-20'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: '8100 Eco-lite 0W-20',
      series: '8100 100% Synthetic Fuel Economy',
      viscosity,
      specs: ['API SP-RC', 'ILSAC GF-6A'],
      description: 'Stworzony do napędów hybrydowych. Błyskawicznie dociera do newralgicznych węzłów tarcia przy każdym restarcie jednostki spalinowej.',
      badge: 'Dedykowany do Hybryd'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Special Tec AA 0W-20',
      series: 'Special Tec Asian & American',
      viscosity,
      specs: ['API SP', 'ILSAC GF-6A'],
      description: 'Specjalny pakiet detergentów i modyfikatorów tarcia dedykowany do japońskich napędów hybrydowych i benzynowych.',
      badge: 'Japanese Spec'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'Hybrid C5 0W-20',
      series: 'Valvoline Hybrid Specialist',
      viscosity,
      specs: ['API SP', 'ILSAC GF-6A', 'ACEA C5'],
      description: 'Innowacyjny olej ze specjalnymi dodatkami zabezpieczającymi przed gromadzeniem wilgoci przy niedogrzanym silniku.',
      badge: 'Hybrid Shield'
    }
  };
}

function matchFord948(viscosity = '5W-20'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: 'Specific 948 B 5W-20',
      series: 'Motul Specific Dedicated OEM',
      viscosity,
      specs: ['Ford WSS-M2C948-B', 'ACEA C5', 'API SN'],
      description: 'Specjalnie opracowany olej zapobiegający degradacji paska rozrządu pracującego w oleju (Belt in Oil) silników EcoBoost.',
      badge: 'Aprobata Ford 948-B'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Special Tec F ECO 5W-20',
      series: 'Special Tec Ford Dedicated',
      viscosity,
      specs: ['Ford WSS-M2C948-B', 'ACEA C5'],
      description: 'Całkowicie bezpieczny dla mieszanek gumowych paska rozrządu w silnikach EcoBoost.',
      badge: 'Ochrona paska w oleju'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower FE 5W-20',
      series: 'SynPower Fuel Economy',
      viscosity,
      specs: ['Ford WSS-M2C948-B', 'ACEA C5'],
      description: 'Zapewnia błyskawiczny film smarny i redukuje zużycie paliwa w jednostkach Ford EcoBoost.',
      badge: 'EcoBoost Approved'
    }
  };
}

function matchPsa2312(viscosity = '0W-30'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: 'Specific 2312 0W-30',
      series: 'Motul Specific Dedicated OEM',
      viscosity,
      specs: ['PSA B71 2312', 'ACEA C2'],
      description: 'Oficjalny olej dla silników PureTech oraz BlueHDi koncernu PSA (Peugeot, Citroën, Opel).',
      badge: 'Norma PSA B71 2312'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 4310 0W-30',
      series: 'Top Tec French Tech',
      viscosity,
      specs: ['PSA B71 2312', 'ACEA C2'],
      description: 'Zapobiega łuszczeniu paska rozrządu w silnikach 1.2 PureTech i chroni układ wtryskowy BlueHDi.',
      badge: 'Ochrona PureTech'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower ENV C2 0W-30',
      series: 'SynPower Clean Air',
      viscosity,
      specs: ['PSA B71 2312', 'ACEA C2'],
      description: 'Formuła syntetyczna opracowana specjalnie pod kątem francuskich silników o niskiej emisji.',
      badge: 'Aprobata PSA'
    }
  };
}

function matchRenault17(viscosity = '5W-30'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: 'Specific 17 5W-30',
      series: 'Motul Specific Dedicated OEM',
      viscosity,
      specs: ['Renault RN17', 'ACEA C3'],
      description: 'Oficjalna norma Renault/Dacia zastępująca starsze RN0700/0710 dla nowoczesnych silników TCe i Blue dCi.',
      badge: 'Norma Renault RN17'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 4410 5W-30',
      series: 'Top Tec French & Romanian Line',
      viscosity,
      specs: ['Renault RN17', 'ACEA C3'],
      description: 'Chroni silniki 1.0 TCe, 1.3 TCe oraz diesle 1.5 Blue dCi przed wysoką temperaturą i osadami.',
      badge: 'Oficjalna norma RN17'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower RNO C3 5W-30',
      series: 'SynPower Renault Line',
      viscosity,
      specs: ['Renault RN17', 'ACEA C3'],
      description: 'Wysoka stabilność termiczna i pełna kompatybilność z filtrami cząstek stałych GPF i DPF.',
      badge: 'RN17 Approved'
    }
  };
}

function matchHighPerformance(viscosity = '5W-40'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: '8100 X-cess Gen2 5W-40',
      series: '8100 100% Synthetic',
      viscosity,
      specs: ['VW 502.00 / 505.00', 'BMW LL-01', 'MB-Approval 229.5', 'Porsche A40'],
      description: 'Kultowy olej do silników wysilonych. Znakomita odporność na ścinanie i wysokie temperatury.',
      badge: 'Wybór na Track Day'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Leichtlauf High Tech 5W-40',
      series: 'Full Synthetic Formula',
      viscosity,
      specs: ['VW 502.00 / 505.00', 'BMW LL-01', 'MB 229.5', 'Porsche A40'],
      description: 'Ekstremalna odporność termiczna, doskonałe smarowanie panewek i wałków rozrządu w silnikach mocnych.',
      badge: 'High Performance'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower 5W-40',
      series: 'SynPower Racing Inspired',
      viscosity,
      specs: ['VW 502.00 / 505.00', 'MB 229.5', 'Porsche A40', 'ACEA A3/B4'],
      description: 'Olej o wzmocnionym pakiecie detergentów do silników z bezpośrednim wtryskiem i mocnym doładowaniem.',
      badge: 'Mocna baza'
    }
  };
}

function matchKorean(viscosity = '5W-30'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: '8100 X-clean EFE 5W-30',
      series: '8100 Synthese-Technologie',
      viscosity,
      specs: ['ACEA C2/C3', 'API SP'],
      description: 'Zalecany do silników T-GDI oraz CRDi koncernu Hyundai/Kia. Zabezpiecza przed zjawiskiem LSPI.',
      badge: 'Ochrona T-GDI'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Top Tec 4200 5W-30',
      series: 'Top Tec Formula',
      viscosity,
      specs: ['ACEA C3', 'API SP'],
      description: 'Wysoka czystość układu smarowania w koreańskich jednostkach benzynowych z turbodoładowaniem.',
      badge: 'Czystość wtrysku'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower MST C3 5W-30',
      series: 'SynPower Premium',
      viscosity,
      specs: ['ACEA C3', 'API SP'],
      description: 'Stabilny film olejowy i wzorowa ochrona łańcucha rozrządu w silnikach Hyundai / Kia.',
      badge: 'Pewna ochrona'
    }
  };
}

function matchVolvo(viscosity = '0W-20'): EngineOption['products'] {
  return {
    motul: {
      brand: 'Motul',
      productName: 'Specific RBS0-2AE 0W-20',
      series: 'Motul Specific Dedicated OEM',
      viscosity,
      specs: ['Volvo VCC RBS0-2AE', 'ACEA C5'],
      description: 'Oficjalny olej Motul opracowany w ścisłej współpracy z Volvo Cars dla jednostek Drive-E.',
      badge: 'Aprobata Volvo RBS0-2AE'
    },
    liquiMoly: {
      brand: 'Liqui Moly',
      productName: 'Special Tec V 0W-20',
      series: 'Special Tec Volvo Formula',
      viscosity,
      specs: ['Volvo VCC RBS0-2AE', 'ACEA C5'],
      description: 'Najwyższa ochrona podwójnego doładowania silników Drive-E i nienaganna czystość układu EGR.',
      badge: 'Dedykowany do Volvo'
    },
    valvoline: {
      brand: 'Valvoline',
      productName: 'SynPower MST C5 0W-20',
      series: 'SynPower Premium',
      viscosity,
      specs: ['Volvo VCC RBS0-2AE', 'ACEA C5'],
      description: 'Wyjątkowa płynność w temperaturach arktycznych i ochrona katalizatora SCR.',
      badge: 'Nordic Protection'
    }
  };
}

// -------------------------------------------------------------
// GŁÓWNA BAZA POJAZDÓW (Ponad 22 najpopularniejsze marki na polskich drogach)
// -------------------------------------------------------------

export const VEHICLE_DATABASE: VehicleMake[] = [
  // 1. VOLKSWAGEN
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    country: 'Niemcy',
    models: [
      {
        id: 'golf',
        name: 'Golf',
        generations: [
          {
            id: 'golf-vii',
            name: 'Golf VII (5G)',
            years: '2012 - 2020',
            engines: [
              {
                id: 'vw-golf7-20tdi-150',
                name: '2.0 TDI CR (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'EA288 (CRBC, CRLB, DEJA)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3', 'Porsche C30'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-EA288-507',
                products: matchVag507('5W-30')
              },
              {
                id: 'vw-golf7-14tsi-125',
                name: '1.4 TSI BlueMotion (125 KM)',
                fuel: 'Benzyna',
                displacement: '1395 cm³',
                powerHp: 125,
                engineCode: 'EA211 (CZCA)',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-EA211-14TSI',
                products: matchVag507('5W-30')
              },
              {
                id: 'vw-golf7-gti-220',
                name: '2.0 TSI GTI (220/230 KM)',
                fuel: 'Benzyna',
                displacement: '1984 cm³',
                powerHp: 230,
                engineCode: 'EA888 Gen 3 (CHHA/CHHB)',
                oilCapacityLiters: 5.7,
                recommendedViscosity: '5W-40',
                oemStandards: ['VW 502.00 / 505.00', 'VW 504.00', 'ACEA A3/B4'],
                serviceIntervalKm: '10 000 - 15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-EA888G3-GTI',
                notes: 'Zalecana wymiana co 10 000 km przy dynamicznej jeździe.',
                products: matchHighPerformance('5W-40')
              }
            ]
          },
          {
            id: 'golf-viii',
            name: 'Golf VIII (CD1)',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'vw-golf8-15etemp-150',
                name: '1.5 eTSI Mild Hybrid (150 KM)',
                fuel: 'Hybryda',
                displacement: '1498 cm³',
                powerHp: 150,
                engineCode: 'EA211 evo (DFYA)',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5', 'Porsche C20'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-EA211EVO-508',
                notes: 'Wymagana norma VW 508.00. Nie stosować 5W-30 bez aprobaty!',
                products: matchVag508('0W-20')
              },
              {
                id: 'vw-golf8-20tdi-150',
                name: '2.0 TDI EVO SCR (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'EA288 evo (DSRB)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-EA288EVO-509',
                products: matchVag508('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'passat',
        name: 'Passat',
        generations: [
          {
            id: 'passat-b8',
            name: 'Passat B8 (3G)',
            years: '2014 - 2023',
            engines: [
              {
                id: 'vw-passat-b8-20tdi-190',
                name: '2.0 TDI SCR (190 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 190,
                engineCode: 'EA288 (DDAA, DFHA)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-PASSAT-B8-TDI',
                products: matchVag507('5W-30')
              },
              {
                id: 'vw-passat-b8-20tsi-220',
                name: '2.0 TSI (220 KM)',
                fuel: 'Benzyna',
                displacement: '1984 cm³',
                powerHp: 220,
                engineCode: 'EA888 Gen 3',
                oilCapacityLiters: 5.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-PASSAT-B8-TSI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'tiguan',
        name: 'Tiguan',
        generations: [
          {
            id: 'tiguan-ii',
            name: 'Tiguan II (AD1)',
            years: '2016 - 2024',
            engines: [
              {
                id: 'vw-tiguan-20tdi-150',
                name: '2.0 TDI 4Motion (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'EA288 (DFGA)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-TIGUAN-20TDI',
                products: matchVag507('5W-30')
              },
              {
                id: 'vw-tiguan-15tsi-150',
                name: '1.5 TSI ACT (150 KM)',
                fuel: 'Benzyna',
                displacement: '1498 cm³',
                powerHp: 150,
                engineCode: 'EA211 evo (DPCA)',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VW-TIGUAN-15TSI',
                products: matchVag508('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. AUDI
  {
    id: 'audi',
    name: 'Audi',
    country: 'Niemcy',
    models: [
      {
        id: 'audi-a3',
        name: 'A3',
        generations: [
          {
            id: 'audi-a3-8v',
            name: 'A3 8V',
            years: '2012 - 2020',
            engines: [
              {
                id: 'audi-a3-8v-20tdi',
                name: '2.0 TDI clean diesel (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'CRBC, CRLB',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. AUDI-A3-8V-TDI',
                products: matchVag507('5W-30')
              },
              {
                id: 'audi-a3-8v-14tfsi',
                name: '1.4 TFSI COD (150 KM)',
                fuel: 'Benzyna',
                displacement: '1395 cm³',
                powerHp: 150,
                engineCode: 'CZEA',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. AUDI-A3-8V-TFSI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'audi-a4',
        name: 'A4',
        generations: [
          {
            id: 'audi-a4-b9',
            name: 'A4 B9 (8W)',
            years: '2015 - 2024',
            engines: [
              {
                id: 'audi-a4-20tdi-190',
                name: '2.0 TDI ultra / clean diesel (190 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 190,
                engineCode: 'EA288 (DETA, DESA)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3', 'Porsche C30'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. AUDI-A4B9-20TDI',
                products: matchVag507('5W-30')
              },
              {
                id: 'audi-a4-20tfsi-252',
                name: '2.0 TFSI quattro (252 KM)',
                fuel: 'Benzyna',
                displacement: '1984 cm³',
                powerHp: 252,
                engineCode: 'EA888 Gen 3 (CYRB)',
                oilCapacityLiters: 5.2,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '10 000 - 15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. AUDI-A4B9-20TFSI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'audi-a6',
        name: 'A6',
        generations: [
          {
            id: 'audi-a6-c8',
            name: 'A6 C8 (4A)',
            years: '2018 - Teraz',
            engines: [
              {
                id: 'audi-a6-50tdi-286',
                name: '50 TDI V6 Mild Hybrid (286 KM)',
                fuel: 'Hybryda',
                displacement: '2967 cm³',
                powerHp: 286,
                engineCode: 'EA897evo2 (DDVE)',
                oilCapacityLiters: 6.1,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5', 'Porsche C20'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. AUDI-A6C8-50TDI',
                notes: 'Wymaga oleju 0W-20 z normą VW 509.00.',
                products: matchVag508('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'audi-q5',
        name: 'Q5',
        generations: [
          {
            id: 'audi-q5-fy',
            name: 'Q5 II (FY)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'audi-q5-20tdi-190',
                name: '2.0 TDI quattro (190 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 190,
                engineCode: 'DETA',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. AUDI-Q5-TDI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. BMW
  {
    id: 'bmw',
    name: 'BMW',
    country: 'Niemcy',
    models: [
      {
        id: 'seria-1',
        name: 'Seria 1',
        generations: [
          {
            id: 'bmw-f20',
            name: 'Seria 1 F20 / F21',
            years: '2011 - 2019',
            engines: [
              {
                id: 'bmw-f20-118d',
                name: '118d (150 KM)',
                fuel: 'Diesel',
                displacement: '1995 cm³',
                powerHp: 150,
                engineCode: 'B47D20',
                oilCapacityLiters: 5.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['BMW Longlife-04', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. BMW-F20-118D',
                products: matchBmwLL04('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'seria-3',
        name: 'Seria 3',
        generations: [
          {
            id: 'bmw-g20',
            name: 'Seria 3 G20 / G21',
            years: '2019 - Teraz',
            engines: [
              {
                id: 'bmw-g20-320d-190',
                name: '320d / 320d xDrive (190 KM)',
                fuel: 'Diesel',
                displacement: '1995 cm³',
                powerHp: 190,
                engineCode: 'B47D20 (TwinPower Turbo)',
                oilCapacityLiters: 5.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['BMW Longlife-04', 'ACEA C3', 'MB 229.52'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. BMW-B47-LL04',
                notes: 'Zalecana wymiana co 15 tys. km zamiast trybu Longlife.',
                products: matchBmwLL04('5W-30')
              },
              {
                id: 'bmw-g20-330i-258',
                name: '330i / 330i xDrive (258 KM)',
                fuel: 'Benzyna',
                displacement: '1998 cm³',
                powerHp: 258,
                engineCode: 'B48B20B',
                oilCapacityLiters: 5.25,
                recommendedViscosity: '5W-30',
                oemStandards: ['BMW Longlife-04', 'ACEA C3'],
                serviceIntervalKm: '12 000 - 15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. BMW-B48-330I',
                products: matchBmwLL04('5W-30')
              },
              {
                id: 'bmw-g20-m340i-374',
                name: 'M340i xDrive (374 KM)',
                fuel: 'Benzyna',
                displacement: '2998 cm³',
                powerHp: 374,
                engineCode: 'B58B30O1 (Inline-6)',
                oilCapacityLiters: 6.5,
                recommendedViscosity: '5W-40',
                oemStandards: ['BMW Longlife-04', 'BMW Longlife-01', 'ACEA C3'],
                serviceIntervalKm: '10 000 km',
                filterTier: 'Performance',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. BMW-B58-M340I',
                products: matchHighPerformance('5W-40')
              }
            ]
          },
          {
            id: 'bmw-f30',
            name: 'Seria 3 F30 / F31',
            years: '2011 - 2019',
            engines: [
              {
                id: 'bmw-f30-320d-184',
                name: '320d (184/190 KM)',
                fuel: 'Diesel',
                displacement: '1995 cm³',
                powerHp: 184,
                engineCode: 'N47D20 / B47D20',
                oilCapacityLiters: 5.2,
                recommendedViscosity: '5W-30',
                oemStandards: ['BMW Longlife-04', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. BMW-N47-F30',
                products: matchBmwLL04('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'seria-5',
        name: 'Seria 5',
        generations: [
          {
            id: 'bmw-g30',
            name: 'Seria 5 G30 / G31',
            years: '2017 - 2023',
            engines: [
              {
                id: 'bmw-g30-530d-265',
                name: '530d / 530d xDrive (265 KM)',
                fuel: 'Diesel',
                displacement: '2993 cm³',
                powerHp: 265,
                engineCode: 'B57D30 (6 cylindrów)',
                oilCapacityLiters: 6.5,
                recommendedViscosity: '5W-30',
                oemStandards: ['BMW Longlife-04', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. BMW-B57-530D',
                products: matchBmwLL04('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'bmw-x3',
        name: 'X3',
        generations: [
          {
            id: 'bmw-x3-g01',
            name: 'X3 G01',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'bmw-x3-20d-190',
                name: 'xDrive20d (190 KM)',
                fuel: 'Diesel',
                displacement: '1995 cm³',
                powerHp: 190,
                engineCode: 'B47D20',
                oilCapacityLiters: 5.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['BMW Longlife-04', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. BMW-X3-20D',
                products: matchBmwLL04('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. MERCEDES-BENZ
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    country: 'Niemcy',
    models: [
      {
        id: 'klasa-a',
        name: 'Klasa A',
        generations: [
          {
            id: 'mb-w177',
            name: 'Klasa A W177',
            years: '2018 - Teraz',
            engines: [
              {
                id: 'mb-a180d-116',
                name: 'A 180 d (116 KM)',
                fuel: 'Diesel',
                displacement: '1461 cm³',
                powerHp: 116,
                engineCode: 'OM608 / OM654',
                oilCapacityLiters: 5.5,
                recommendedViscosity: '5W-30',
                oemStandards: ['MB-Approval 229.52', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. MB-A180D',
                products: matchMb22952('5W-30')
              },
              {
                id: 'mb-a200-163',
                name: 'A 200 (163 KM)',
                fuel: 'Benzyna',
                displacement: '1332 cm³',
                powerHp: 163,
                engineCode: 'M282',
                oilCapacityLiters: 5.5,
                recommendedViscosity: '5W-30',
                oemStandards: ['MB-Approval 229.51 / 229.52', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. MB-A200',
                products: matchMb22952('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'klasa-c',
        name: 'Klasa C',
        generations: [
          {
            id: 'mb-w205',
            name: 'Klasa C W205 / S205',
            years: '2014 - 2021',
            engines: [
              {
                id: 'mb-c220d-194',
                name: 'C 220 d (194 KM)',
                fuel: 'Diesel',
                displacement: '1950 cm³',
                powerHp: 194,
                engineCode: 'OM654.920',
                oilCapacityLiters: 6.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['MB-Approval 229.52', 'MB-Approval 229.51', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. MB-OM654-22952',
                notes: 'Wymagana norma MB 229.52 ze względu na powłokę NANOSLIDE®.',
                products: matchMb22952('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'klasa-e',
        name: 'Klasa E',
        generations: [
          {
            id: 'mb-w213',
            name: 'Klasa E W213',
            years: '2016 - 2023',
            engines: [
              {
                id: 'mb-e220d-194',
                name: 'E 220 d (194 KM)',
                fuel: 'Diesel',
                displacement: '1950 cm³',
                powerHp: 194,
                engineCode: 'OM654',
                oilCapacityLiters: 6.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['MB-Approval 229.52', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. MB-E220D',
                products: matchMb22952('5W-30')
              },
              {
                id: 'mb-e350d-258',
                name: 'E 350 d (286 KM)',
                fuel: 'Diesel',
                displacement: '2925 cm³',
                powerHp: 286,
                engineCode: 'OM656 (R6)',
                oilCapacityLiters: 7.5,
                recommendedViscosity: '5W-30',
                oemStandards: ['MB-Approval 229.52', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. MB-OM656-22952',
                products: matchMb22952('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'mb-glc',
        name: 'GLC',
        generations: [
          {
            id: 'mb-glc-x253',
            name: 'GLC X253',
            years: '2015 - 2022',
            engines: [
              {
                id: 'mb-glc-220d',
                name: 'GLC 220 d 4MATIC (194 KM)',
                fuel: 'Diesel',
                displacement: '1950 cm³',
                powerHp: 194,
                engineCode: 'OM654',
                oilCapacityLiters: 6.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['MB-Approval 229.52', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. MB-GLC-220D',
                products: matchMb22952('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 5. TOYOTA
  {
    id: 'toyota',
    name: 'Toyota',
    country: 'Japonia',
    models: [
      {
        id: 'yaris',
        name: 'Yaris',
        generations: [
          {
            id: 'yaris-iv',
            name: 'Yaris IV (XP210)',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'toyota-yaris-15h-116',
                name: '1.5 Hybrid Dynamic Force (116 KM)',
                fuel: 'Hybryda',
                displacement: '1490 cm³',
                powerHp: 116,
                engineCode: 'M15A-FXE',
                oilCapacityLiters: 3.6,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. TOYOTA-YARIS4-HYBRID',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'corolla',
        name: 'Corolla',
        generations: [
          {
            id: 'corolla-xii',
            name: 'Corolla XII (E210)',
            years: '2019 - Teraz',
            engines: [
              {
                id: 'toyota-corolla-18h-122',
                name: '1.8 Hybrid HSD (122 KM / 140 KM)',
                fuel: 'Hybryda',
                displacement: '1798 cm³',
                powerHp: 122,
                engineCode: '2ZR-FXE (Atkinson Cycle)',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP-RC', 'ILSAC GF-6A', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. TOYOTA-2ZR-HSD',
                products: matchAsianHybrid('0W-20')
              },
              {
                id: 'toyota-corolla-20h-184',
                name: '2.0 Hybrid Dynamic Force (184/196 KM)',
                fuel: 'Hybryda',
                displacement: '1987 cm³',
                powerHp: 184,
                engineCode: 'M20A-FXS',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. TOYOTA-M20A-DYNAMIC',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'c-hr',
        name: 'C-HR',
        generations: [
          {
            id: 'c-hr-i',
            name: 'C-HR I (AX10)',
            years: '2016 - 2023',
            engines: [
              {
                id: 'toyota-chr-18h',
                name: '1.8 Hybrid (122 KM)',
                fuel: 'Hybryda',
                displacement: '1798 cm³',
                powerHp: 122,
                engineCode: '2ZR-FXE',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. TOYOTA-CHR-18H',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'rav4',
        name: 'RAV4',
        generations: [
          {
            id: 'rav4-v',
            name: 'RAV4 V (XA50)',
            years: '2018 - Teraz',
            engines: [
              {
                id: 'toyota-rav4-25h-222',
                name: '2.5 Hybrid AWD-i (222 KM)',
                fuel: 'Hybryda',
                displacement: '2487 cm³',
                powerHp: 222,
                engineCode: 'A25A-FXS',
                oilCapacityLiters: 4.5,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. TOYOTA-A25A-RAV4',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 6. ŠKODA
  {
    id: 'skoda',
    name: 'Škoda',
    country: 'Czechy',
    models: [
      {
        id: 'fabia',
        name: 'Fabia',
        generations: [
          {
            id: 'fabia-iii',
            name: 'Fabia III (NJ)',
            years: '2014 - 2021',
            engines: [
              {
                id: 'skoda-fabia3-10tsi',
                name: '1.0 TSI (95/110 KM)',
                fuel: 'Benzyna',
                displacement: '999 cm³',
                powerHp: 95,
                engineCode: 'EA211 (CHZB)',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SKODA-FABIA3-10TSI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'octavia',
        name: 'Octavia',
        generations: [
          {
            id: 'octavia-iv',
            name: 'Octavia IV (NX)',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'skoda-oct4-20tdi-150',
                name: '2.0 TDI EVO SCR (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'EA288 evo (DSRB/DSTB)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. SKODA-OCT4-EA288EVO',
                products: matchVag508('0W-20')
              },
              {
                id: 'skoda-oct4-15tsi-150',
                name: '1.5 TSI ACT (150 KM)',
                fuel: 'Benzyna',
                displacement: '1498 cm³',
                powerHp: 150,
                engineCode: 'EA211 evo (DPCA)',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SKODA-OCT4-15TSI',
                products: matchVag508('0W-20')
              }
            ]
          },
          {
            id: 'octavia-iii',
            name: 'Octavia III (5E)',
            years: '2013 - 2020',
            engines: [
              {
                id: 'skoda-oct3-20tdi-150',
                name: '2.0 TDI CR (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'EA288 (CKFC, CRMB)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. SKODA-OCT3-20TDI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'superb',
        name: 'Superb',
        generations: [
          {
            id: 'superb-iii',
            name: 'Superb III (3V)',
            years: '2015 - 2024',
            engines: [
              {
                id: 'skoda-superb3-20tdi-190',
                name: '2.0 TDI SCR 4x4 (190/200 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 190,
                engineCode: 'DDAA / DTUA',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SKODA-SUPERB3-TDI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'kodiaq',
        name: 'Kodiaq',
        generations: [
          {
            id: 'kodiaq-i',
            name: 'Kodiaq I (NS7)',
            years: '2016 - 2024',
            engines: [
              {
                id: 'skoda-kodiaq-20tdi-190',
                name: '2.0 TDI 4x4 (190 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 190,
                engineCode: 'DFHA',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SKODA-KODIAQ-TDI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 7. FORD
  {
    id: 'ford',
    name: 'Ford',
    country: 'USA / Europa',
    models: [
      {
        id: 'focus',
        name: 'Focus',
        generations: [
          {
            id: 'focus-mk4',
            name: 'Focus Mk4',
            years: '2018 - Teraz',
            engines: [
              {
                id: 'ford-focus-10ecoboost-125',
                name: '1.0 EcoBoost mHEV (125 KM)',
                fuel: 'Hybryda',
                displacement: '999 cm³',
                powerHp: 125,
                engineCode: 'EcoBoost (B3DA)',
                oilCapacityLiters: 4.1,
                recommendedViscosity: '5W-20',
                oemStandards: ['Ford WSS-M2C948-B', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. FORD-ECOBOOST-948B',
                notes: 'Wymaga normy Ford WSS-M2C948-B chroniącej pasek w oleju.',
                products: matchFord948('5W-20')
              },
              {
                id: 'ford-focus-15ecoblue-120',
                name: '1.5 EcoBlue Diesel (120 KM)',
                fuel: 'Diesel',
                displacement: '1499 cm³',
                powerHp: 120,
                engineCode: 'ZTDA',
                oilCapacityLiters: 3.8,
                recommendedViscosity: '0W-30',
                oemStandards: ['Ford WSS-M2C950-A', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. FORD-ECOBLUE-950A',
                products: {
                  motul: {
                    brand: 'Motul',
                    productName: 'Specific 950 A 0W-30',
                    series: 'Motul Specific Dedicated OEM',
                    viscosity: '0W-30',
                    specs: ['Ford WSS-M2C950-A', 'ACEA C2'],
                    description: 'Dedykowana norma dla silników wysokoprężnych Ford EcoBlue.',
                    badge: 'Aprobata Ford 950-A'
                  },
                  liquiMoly: {
                    brand: 'Liqui Moly',
                    productName: 'Special Tec F 0W-30',
                    series: 'Special Tec',
                    viscosity: '0W-30',
                    specs: ['Ford WSS-M2C950-A', 'ACEA C2'],
                    description: 'Optymalna ochrona filtrów DPF i turbosprężarki w silnikach EcoBlue.',
                    badge: 'Dla EcoBlue'
                  },
                  valvoline: {
                    brand: 'Valvoline',
                    productName: 'SynPower DT C2 0W-30',
                    series: 'SynPower',
                    viscosity: '0W-30',
                    specs: ['Ford WSS-M2C950-A', 'ACEA C2'],
                    description: 'Olej o obniżonym tarciu zapewniający wysoką oszczędność paliwa.',
                    badge: 'Ford Approved'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'mondeo',
        name: 'Mondeo',
        generations: [
          {
            id: 'mondeo-mk5',
            name: 'Mondeo Mk5',
            years: '2014 - 2022',
            engines: [
              {
                id: 'ford-mondeo-20tdci-150',
                name: '2.0 TDCi / EcoBlue (150/180 KM)',
                fuel: 'Diesel',
                displacement: '1997 cm³',
                powerHp: 150,
                engineCode: 'T7CA, T8CC',
                oilCapacityLiters: 5.8,
                recommendedViscosity: '0W-30',
                oemStandards: ['Ford WSS-M2C950-A', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. FORD-MONDEO-TDCi',
                products: {
                  motul: {
                    brand: 'Motul',
                    productName: 'Specific 950 A 0W-30',
                    series: 'Motul Specific',
                    viscosity: '0W-30',
                    specs: ['Ford WSS-M2C950-A', 'ACEA C2'],
                    description: 'Oficjalna norma do silników TDCi w Fordzie Mondeo.',
                    badge: 'Ford 950-A'
                  },
                  liquiMoly: {
                    brand: 'Liqui Moly',
                    productName: 'Special Tec F 0W-30',
                    series: 'Special Tec',
                    viscosity: '0W-30',
                    specs: ['Ford WSS-M2C950-A', 'ACEA C2'],
                    description: 'Niemiecka formulacja do diesli Forda.',
                    badge: 'German Quality'
                  },
                  valvoline: {
                    brand: 'Valvoline',
                    productName: 'SynPower DT C2 0W-30',
                    series: 'SynPower',
                    viscosity: '0W-30',
                    specs: ['Ford WSS-M2C950-A', 'ACEA C2'],
                    description: 'Pewna ochrona na długich trasach.',
                    badge: 'Valvoline Tech'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'kuga',
        name: 'Kuga',
        generations: [
          {
            id: 'kuga-mk3',
            name: 'Kuga Mk3',
            years: '2019 - Teraz',
            engines: [
              {
                id: 'ford-kuga-25fhev-190',
                name: '2.5 FHEV Hybrid (190 KM)',
                fuel: 'Hybryda',
                displacement: '2488 cm³',
                powerHp: 190,
                engineCode: 'Duratec Hybrid',
                oilCapacityLiters: 5.4,
                recommendedViscosity: '0W-20',
                oemStandards: ['Ford WSS-M2C962-A1', 'API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. FORD-KUGA-HYBRID',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 8. VOLVO
  {
    id: 'volvo',
    name: 'Volvo',
    country: 'Szwecja',
    models: [
      {
        id: 'xc60',
        name: 'XC60',
        generations: [
          {
            id: 'volvo-xc60-ii',
            name: 'XC60 II (SPA)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'volvo-xc60-d4-190',
                name: 'D4 AWD Drive-E (190 KM)',
                fuel: 'Diesel',
                displacement: '1969 cm³',
                powerHp: 190,
                engineCode: 'D4204T14 (Drive-E)',
                oilCapacityLiters: 5.2,
                recommendedViscosity: '0W-20',
                oemStandards: ['Volvo VCC RBS0-2AE', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. VOLVO-DRIVEE-RBS02AE',
                notes: 'Wymaga normy Volvo VCC RBS0-2AE o obniżonym HTHS.',
                products: matchVolvo('0W-20')
              },
              {
                id: 'volvo-xc60-b4-mild',
                name: 'B4 Mild Hybrid (197 KM)',
                fuel: 'Hybryda',
                displacement: '1969 cm³',
                powerHp: 197,
                engineCode: 'B420T6',
                oilCapacityLiters: 5.6,
                recommendedViscosity: '0W-20',
                oemStandards: ['Volvo VCC RBS0-2AE', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. VOLVO-B4-DRIVEE',
                products: matchVolvo('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'xc40',
        name: 'XC40',
        generations: [
          {
            id: 'volvo-xc40-i',
            name: 'XC40 (CMA)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'volvo-xc40-t3-163',
                name: 'T3 1.5 Drive-E (163 KM)',
                fuel: 'Benzyna',
                displacement: '1477 cm³',
                powerHp: 163,
                engineCode: 'B3154T',
                oilCapacityLiters: 5.6,
                recommendedViscosity: '0W-20',
                oemStandards: ['Volvo VCC RBS0-2AE', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. VOLVO-XC40-T3',
                products: matchVolvo('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 9. CUPRA & SEAT
  {
    id: 'cupra',
    name: 'CUPRA',
    country: 'Hiszpania',
    models: [
      {
        id: 'formentor',
        name: 'Formentor',
        generations: [
          {
            id: 'cupra-formentor-km7',
            name: 'Formentor (KM7)',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'cupra-formentor-15tsi-150',
                name: '1.5 TSI (150 KM)',
                fuel: 'Benzyna',
                displacement: '1498 cm³',
                powerHp: 150,
                engineCode: 'EA211 evo (DPCA)',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. CUPRA-15TSI-508',
                products: matchVag508('0W-20')
              },
              {
                id: 'cupra-formentor-20tsi-310',
                name: '2.0 TSI VZ 4Drive (310 KM)',
                fuel: 'Benzyna',
                displacement: '1984 cm³',
                powerHp: 310,
                engineCode: 'EA888 Gen 4 (DNFB)',
                oilCapacityLiters: 5.7,
                recommendedViscosity: '0W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '10 000 - 15 000 km',
                filterTier: 'Performance',
                motulCatalogReference: 'Motul Advisor Ref. CUPRA-VZ-310',
                notes: 'Silnik sportowy EA888.4. Zalecamy wymianę co 10 tys. km.',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'cupra-leon',
        name: 'Leon',
        generations: [
          {
            id: 'cupra-leon-kl',
            name: 'Leon (KL)',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'cupra-leon-20tsi-300',
                name: '2.0 TSI (300 KM)',
                fuel: 'Benzyna',
                displacement: '1984 cm³',
                powerHp: 300,
                engineCode: 'EA888 Gen 4',
                oilCapacityLiters: 5.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '10 000 km',
                filterTier: 'Performance',
                motulCatalogReference: 'Motul Advisor Ref. CUPRA-LEON-300',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'seat',
    name: 'SEAT',
    country: 'Hiszpania',
    models: [
      {
        id: 'seat-leon',
        name: 'Leon',
        generations: [
          {
            id: 'seat-leon-iii',
            name: 'Leon III (5F)',
            years: '2012 - 2020',
            engines: [
              {
                id: 'seat-leon3-20tdi',
                name: '2.0 TDI (150 KM)',
                fuel: 'Diesel',
                displacement: '1968 cm³',
                powerHp: 150,
                engineCode: 'EA288 (CRMB)',
                oilCapacityLiters: 4.7,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SEAT-LEON3-TDI',
                products: matchVag507('5W-30')
              },
              {
                id: 'seat-leon3-14tsi',
                name: '1.4 TSI (125/150 KM)',
                fuel: 'Benzyna',
                displacement: '1395 cm³',
                powerHp: 150,
                engineCode: 'EA211 (CZEA)',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['VW 504.00 / 507.00', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SEAT-LEON3-TSI',
                products: matchVag507('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'seat-ateca',
        name: 'Ateca',
        generations: [
          {
            id: 'seat-ateca-i',
            name: 'Ateca (KH7)',
            years: '2016 - Teraz',
            engines: [
              {
                id: 'seat-ateca-15tsi',
                name: '1.5 TSI ACT (150 KM)',
                fuel: 'Benzyna',
                displacement: '1498 cm³',
                powerHp: 150,
                engineCode: 'DPCA',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['VW 508.00 / 509.00', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SEAT-ATECA-15TSI',
                products: matchVag508('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 10. HYUNDAI
  {
    id: 'hyundai',
    name: 'Hyundai',
    country: 'Korea Południowa',
    models: [
      {
        id: 'hyundai-i30',
        name: 'i30',
        generations: [
          {
            id: 'hyundai-i30-iii',
            name: 'i30 III (PD)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'hyundai-i30-14tgdi',
                name: '1.4 T-GDI (140 KM)',
                fuel: 'Benzyna',
                displacement: '1353 cm³',
                powerHp: 140,
                engineCode: 'G4LD (Kappa II)',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '5W-30',
                oemStandards: ['ACEA C2', 'API SN PLUS / SP'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HYUNDAI-I30-TGDI',
                products: matchKorean('5W-30')
              },
              {
                id: 'hyundai-i30-16crdi',
                name: '1.6 CRDi Smartstream (136 KM)',
                fuel: 'Diesel',
                displacement: '1598 cm³',
                powerHp: 136,
                engineCode: 'D4FE',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '0W-20 / 0W-30',
                oemStandards: ['ACEA C2/C3', 'API SN'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HYUNDAI-I30-CRDI',
                products: matchKorean('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'hyundai-tucson',
        name: 'Tucson',
        generations: [
          {
            id: 'hyundai-tucson-iv',
            name: 'Tucson IV (NX4)',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'hyundai-tucson4-16hev',
                name: '1.6 T-GDI HEV Hybrid (230 KM)',
                fuel: 'Hybryda',
                displacement: '1598 cm³',
                powerHp: 230,
                engineCode: 'Smartstream G1.6T',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HYUNDAI-TUCSON4-HEV',
                products: matchAsianHybrid('0W-20')
              }
            ]
          },
          {
            id: 'hyundai-tucson-iii',
            name: 'Tucson III (TL)',
            years: '2015 - 2020',
            engines: [
              {
                id: 'hyundai-tucson3-16crdi',
                name: '1.6 CRDi 48V (136 KM)',
                fuel: 'Diesel',
                displacement: '1598 cm³',
                powerHp: 136,
                engineCode: 'D4FE',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '5W-30',
                oemStandards: ['ACEA C2/C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HYUNDAI-TUCSON3-CRDI',
                products: matchKorean('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 11. KIA
  {
    id: 'kia',
    name: 'Kia',
    country: 'Korea Południowa',
    models: [
      {
        id: 'kia-ceed',
        name: 'Ceed',
        generations: [
          {
            id: 'kia-ceed-cd',
            name: 'Ceed III (CD)',
            years: '2018 - Teraz',
            engines: [
              {
                id: 'kia-ceed-15tgdi-160',
                name: '1.5 T-GDI Smartstream (160 KM)',
                fuel: 'Benzyna',
                displacement: '1482 cm³',
                powerHp: 160,
                engineCode: 'G4LH',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. KIA-CEED-15TGDI',
                products: matchAsianHybrid('0W-20')
              },
              {
                id: 'kia-ceed-16crdi',
                name: '1.6 CRDi (136 KM)',
                fuel: 'Diesel',
                displacement: '1598 cm³',
                powerHp: 136,
                engineCode: 'D4FE',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '5W-30',
                oemStandards: ['ACEA C2/C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. KIA-CEED-CRDI',
                products: matchKorean('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'kia-sportage',
        name: 'Sportage',
        generations: [
          {
            id: 'kia-sportage-v',
            name: 'Sportage V (NQ5)',
            years: '2021 - Teraz',
            engines: [
              {
                id: 'kia-sportage5-16hev',
                name: '1.6 T-GDI HEV (230 KM)',
                fuel: 'Hybryda',
                displacement: '1598 cm³',
                powerHp: 230,
                engineCode: 'G4FT',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. KIA-SPORTAGE5-HEV',
                products: matchAsianHybrid('0W-20')
              }
            ]
          },
          {
            id: 'kia-sportage-iv',
            name: 'Sportage IV (QL)',
            years: '2015 - 2021',
            engines: [
              {
                id: 'kia-sportage4-17crdi',
                name: '1.7 CRDi (115/141 KM)',
                fuel: 'Diesel',
                displacement: '1685 cm³',
                powerHp: 115,
                engineCode: 'D4FD',
                oilCapacityLiters: 5.3,
                recommendedViscosity: '5W-30',
                oemStandards: ['ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. KIA-SPORTAGE4-CRDI',
                products: matchKorean('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 12. OPEL
  {
    id: 'opel',
    name: 'Opel',
    country: 'Niemcy',
    models: [
      {
        id: 'opel-astra',
        name: 'Astra',
        generations: [
          {
            id: 'opel-astra-k',
            name: 'Astra K',
            years: '2015 - 2021',
            engines: [
              {
                id: 'opel-astra-k-14turbo-150',
                name: '1.4 Turbo (150 KM)',
                fuel: 'Benzyna',
                displacement: '1399 cm³',
                powerHp: 150,
                engineCode: 'B14XFT (Direct Injection)',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['GM dexos1 Gen 2/3', 'API SP'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. OPEL-ASTRA-K-DEXOS1',
                notes: 'Wymaga normy dexos1 Gen 2/3 zapobiegającej niszczącemu zjawisku LSPI!',
                products: {
                  motul: {
                    brand: 'Motul',
                    productName: '8100 Eco-lite 5W-30',
                    series: '8100 100% Synthetic',
                    viscosity: '5W-30',
                    specs: ['GM dexos1 Gen 3', 'API SP-RC'],
                    description: 'Olej o potwierdzonej ochronie przed zjawiskiem LSPI w turbodoładowanych silnikach GM/Opel.',
                    badge: 'Oficjalna norma dexos1 Gen 3'
                  },
                  liquiMoly: {
                    brand: 'Liqui Moly',
                    productName: 'Special Tec DX1 5W-30',
                    series: 'Special Tec GM',
                    viscosity: '5W-30',
                    specs: ['GM dexos1 Gen 3', 'API SP'],
                    description: 'Stworzony specjalnie dla jednostek 1.4 Turbo Opla z bezpośrednim wtryskiem.',
                    badge: 'Ochrona LSPI'
                  },
                  valvoline: {
                    brand: 'Valvoline',
                    productName: 'SynPower DX1 5W-30',
                    series: 'SynPower',
                    viscosity: '5W-30',
                    specs: ['GM dexos1 Gen 3', 'API SP'],
                    description: 'Bezpieczny film olejowy redukujący tarcie w silnikach Opla.',
                    badge: 'dexos1 Approved'
                  }
                }
              },
              {
                id: 'opel-astra-k-16cdti-136',
                name: '1.6 CDTI (136 KM)',
                fuel: 'Diesel',
                displacement: '1598 cm³',
                powerHp: 136,
                engineCode: 'B16DTH ("Whisper Diesel")',
                oilCapacityLiters: 5.0,
                recommendedViscosity: '5W-30',
                oemStandards: ['GM dexos2', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. OPEL-ASTRA-CDTI',
                products: matchMb22952('5W-30')
              }
            ]
          },
          {
            id: 'opel-astra-l',
            name: 'Astra L',
            years: '2021 - Teraz',
            engines: [
              {
                id: 'opel-astra-l-12puretech',
                name: '1.2 Turbo PureTech (130 KM)',
                fuel: 'Benzyna',
                displacement: '1199 cm³',
                powerHp: 130,
                engineCode: 'EB2DTS',
                oilCapacityLiters: 3.5,
                recommendedViscosity: '0W-30 / 0W-20',
                oemStandards: ['PSA B71 2312', 'PSA B71 2010', 'ACEA C2/C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. OPEL-ASTRA-L-PURETECH',
                notes: 'Silnik z paskiem w kąpieli olejowej. Wymaga rygorystycznej normy PSA B71 2312!',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'opel-insignia',
        name: 'Insignia',
        generations: [
          {
            id: 'opel-insignia-b',
            name: 'Insignia B (Grand Sport)',
            years: '2017 - 2022',
            engines: [
              {
                id: 'opel-insignia-b-20cdti-174',
                name: '2.0 CDTI (174 KM)',
                fuel: 'Diesel',
                displacement: '1995 cm³',
                powerHp: 174,
                engineCode: 'F20DVH',
                oilCapacityLiters: 5.0,
                recommendedViscosity: '0W-20',
                oemStandards: ['OV0401547', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. OPEL-INSIGNIA-B-CDTI',
                products: matchVag508('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 13. PEUGEOT
  {
    id: 'peugeot',
    name: 'Peugeot',
    country: 'Francja',
    models: [
      {
        id: 'peugeot-208',
        name: '208',
        generations: [
          {
            id: 'peugeot-208-ii',
            name: '208 II',
            years: '2019 - Teraz',
            engines: [
              {
                id: 'peugeot-208-12pt-100',
                name: '1.2 PureTech (100 KM)',
                fuel: 'Benzyna',
                displacement: '1199 cm³',
                powerHp: 100,
                engineCode: 'EB2ADTD',
                oilCapacityLiters: 3.5,
                recommendedViscosity: '0W-30',
                oemStandards: ['PSA B71 2312', 'PSA B71 2010', 'ACEA C2'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. PSA-PURETECH-2312',
                notes: 'UWAGA: Silnik PureTech z paskiem rozrządu w kąpieli olejowej. Zastosowanie nieprawidłowego oleju grozi degradacją paska i zatkaniem smoka!',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'peugeot-308',
        name: '308',
        generations: [
          {
            id: 'peugeot-308-ii',
            name: '308 II (T9)',
            years: '2013 - 2021',
            engines: [
              {
                id: 'peugeot-308-15bluehdi-130',
                name: '1.5 BlueHDi (130 KM)',
                fuel: 'Diesel',
                displacement: '1499 cm³',
                powerHp: 130,
                engineCode: 'DV5RC',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '0W-30 / 0W-20',
                oemStandards: ['PSA B71 2312', 'PSA B71 2010', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. PSA-BLUEHDI-15',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'peugeot-3008',
        name: '3008',
        generations: [
          {
            id: 'peugeot-3008-ii',
            name: '3008 II',
            years: '2016 - 2024',
            engines: [
              {
                id: 'peugeot-3008-20bluehdi-180',
                name: '2.0 BlueHDi (180 KM)',
                fuel: 'Diesel',
                displacement: '1997 cm³',
                powerHp: 180,
                engineCode: 'DW10FC',
                oilCapacityLiters: 5.0,
                recommendedViscosity: '0W-30',
                oemStandards: ['PSA B71 2312', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. PSA-BLUEHDI-20',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 14. RENAULT
  {
    id: 'renault',
    name: 'Renault',
    country: 'Francja',
    models: [
      {
        id: 'renault-clio',
        name: 'Clio',
        generations: [
          {
            id: 'renault-clio-v',
            name: 'Clio V',
            years: '2019 - Teraz',
            engines: [
              {
                id: 'renault-clio-10tce-100',
                name: '1.0 TCe (90/100 KM)',
                fuel: 'Benzyna',
                displacement: '999 cm³',
                powerHp: 100,
                engineCode: 'H4D / H4Dt',
                oilCapacityLiters: 4.1,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. RENAULT-RN17-TCE',
                products: matchRenault17('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'renault-megane',
        name: 'Megane',
        generations: [
          {
            id: 'renault-megane-iv',
            name: 'Megane IV',
            years: '2016 - 2024',
            engines: [
              {
                id: 'renault-megane-13tce-140',
                name: '1.3 TCe (140 KM)',
                fuel: 'Benzyna',
                displacement: '1332 cm³',
                powerHp: 140,
                engineCode: 'H5Ht (opracowany z Mercedesem)',
                oilCapacityLiters: 5.4,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. RENAULT-13TCE-RN17',
                products: matchRenault17('5W-30')
              },
              {
                id: 'renault-megane-15dci-115',
                name: '1.5 Blue dCi (115 KM)',
                fuel: 'Diesel',
                displacement: '1461 cm³',
                powerHp: 115,
                engineCode: 'K9K (Gen 8)',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17 / RN0720', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. RENAULT-K9K-RN17',
                products: matchRenault17('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 15. DACIA
  {
    id: 'dacia',
    name: 'Dacia',
    country: 'Rumunia / Francja',
    models: [
      {
        id: 'dacia-duster',
        name: 'Duster',
        generations: [
          {
            id: 'dacia-duster-ii',
            name: 'Duster II',
            years: '2018 - 2024',
            engines: [
              {
                id: 'dacia-duster-10tce-100',
                name: '1.0 TCe 100 / ECO-G LPG (100 KM)',
                fuel: 'Benzyna',
                displacement: '999 cm³',
                powerHp: 100,
                engineCode: 'H4Dt',
                oilCapacityLiters: 4.1,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Lubricant Advisor: Ref. DACIA-DUSTER-RN17',
                products: matchRenault17('5W-30')
              },
              {
                id: 'dacia-duster-15dci-115',
                name: '1.5 Blue dCi 4x4 (115 KM)',
                fuel: 'Diesel',
                displacement: '1461 cm³',
                powerHp: 115,
                engineCode: 'K9K 872',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. DACIA-DUSTER-BLUEDCI',
                products: matchRenault17('5W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'dacia-sandero',
        name: 'Sandero',
        generations: [
          {
            id: 'dacia-sandero-iii',
            name: 'Sandero III / Stepway',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'dacia-sandero-10tce-90',
                name: '1.0 TCe (90 KM)',
                fuel: 'Benzyna',
                displacement: '999 cm³',
                powerHp: 90,
                engineCode: 'H4D',
                oilCapacityLiters: 4.1,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. DACIA-SANDERO-TCE',
                products: matchRenault17('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 16. FIAT
  {
    id: 'fiat',
    name: 'Fiat',
    country: 'Włochy',
    models: [
      {
        id: 'fiat-tipo',
        name: 'Tipo',
        generations: [
          {
            id: 'fiat-tipo-356',
            name: 'Tipo (356)',
            years: '2015 - Teraz',
            engines: [
              {
                id: 'fiat-tipo-14-95',
                name: '1.4 16V Fire (95 KM)',
                fuel: 'Benzyna',
                displacement: '1368 cm³',
                powerHp: 95,
                engineCode: '843A1000',
                oilCapacityLiters: 3.0,
                recommendedViscosity: '5W-40',
                oemStandards: ['Fiat 9.55535-S2', 'ACEA C3'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. FIAT-TIPO-14FIRE',
                products: matchHighPerformance('5W-40')
              },
              {
                id: 'fiat-tipo-16multijet-120',
                name: '1.6 MultiJet II (120 KM)',
                fuel: 'Diesel',
                displacement: '1598 cm³',
                powerHp: 120,
                engineCode: '55260384',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '0W-30 / 5W-30',
                oemStandards: ['Fiat 9.55535-DS1 / S1', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. FIAT-TIPO-MULTIJET',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'fiat-500',
        name: '500',
        generations: [
          {
            id: 'fiat-500-hybrid',
            name: '500 Hybrid',
            years: '2020 - Teraz',
            engines: [
              {
                id: 'fiat-500-10firefly',
                name: '1.0 FireFly Hybrid (70 KM)',
                fuel: 'Hybryda',
                displacement: '999 cm³',
                powerHp: 70,
                engineCode: '46341162',
                oilCapacityLiters: 2.7,
                recommendedViscosity: '0W-20',
                oemStandards: ['Fiat 9.55535-GSX', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. FIAT-500-FIREFLY',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 17. CITROËN
  {
    id: 'citroen',
    name: 'Citroën',
    country: 'Francja',
    models: [
      {
        id: 'citroen-c3',
        name: 'C3',
        generations: [
          {
            id: 'citroen-c3-iii',
            name: 'C3 III',
            years: '2016 - 2024',
            engines: [
              {
                id: 'citroen-c3-12pt-83',
                name: '1.2 PureTech (83 KM)',
                fuel: 'Benzyna',
                displacement: '1199 cm³',
                powerHp: 83,
                engineCode: 'EB2FA',
                oilCapacityLiters: 3.25,
                recommendedViscosity: '0W-30',
                oemStandards: ['PSA B71 2312', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. CITROEN-C3-PURETECH',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      },
      {
        id: 'citroen-c5-aircross',
        name: 'C5 Aircross',
        generations: [
          {
            id: 'citroen-c5-i',
            name: 'C5 Aircross',
            years: '2018 - Teraz',
            engines: [
              {
                id: 'citroen-c5-15bluehdi',
                name: '1.5 BlueHDi (130 KM)',
                fuel: 'Diesel',
                displacement: '1499 cm³',
                powerHp: 130,
                engineCode: 'DV5RC',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '0W-30',
                oemStandards: ['PSA B71 2312', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. CITROEN-C5-BLUEHDI',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 18. MAZDA
  {
    id: 'mazda',
    name: 'Mazda',
    country: 'Japonia',
    models: [
      {
        id: 'mazda-3',
        name: 'Mazda 3',
        generations: [
          {
            id: 'mazda-3-bp',
            name: 'Mazda 3 (BP)',
            years: '2019 - Teraz',
            engines: [
              {
                id: 'mazda-3-20skyactiv-g',
                name: '2.0 e-SkyActiv-G (122/150 KM)',
                fuel: 'Hybryda',
                displacement: '1998 cm³',
                powerHp: 150,
                engineCode: 'PE-VPS (Stopień sprężania 13:1)',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A', 'ACEA C5'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. MAZDA-SKYACTIV-G',
                products: matchAsianHybrid('0W-20')
              },
              {
                id: 'mazda-3-20skyactiv-x',
                name: '2.0 e-SkyActiv-X (186 KM)',
                fuel: 'Hybryda',
                displacement: '1998 cm³',
                powerHp: 186,
                engineCode: 'HF-VPH (SPCCI - zapłon samoczynny)',
                oilCapacityLiters: 4.5,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. MAZDA-SKYACTIV-X',
                notes: 'Innowacyjny silnik SPCCI wymagający oleju o najwyższej odporności termicznej.',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'mazda-6',
        name: 'Mazda 6',
        generations: [
          {
            id: 'mazda-6-gj',
            name: 'Mazda 6 (GJ/GL)',
            years: '2012 - 2024',
            engines: [
              {
                id: 'mazda-6-20g-165',
                name: '2.0 SkyActiv-G (165 KM)',
                fuel: 'Benzyna',
                displacement: '1998 cm³',
                powerHp: 165,
                engineCode: 'PE-VPS',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '0W-20 / 5W-30',
                oemStandards: ['API SN/SP', 'ACEA A5/B5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. MAZDA6-SKYACTIV',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'mazda-cx5',
        name: 'CX-5',
        generations: [
          {
            id: 'mazda-cx5-kf',
            name: 'CX-5 II (KF)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'mazda-cx5-20g-165',
                name: '2.0 SkyActiv-G (165 KM)',
                fuel: 'Benzyna',
                displacement: '1998 cm³',
                powerHp: 165,
                engineCode: 'PE-VPS',
                oilCapacityLiters: 4.2,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. MAZDA-CX5-G',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 19. HONDA
  {
    id: 'honda',
    name: 'Honda',
    country: 'Japonia',
    models: [
      {
        id: 'honda-civic',
        name: 'Civic',
        generations: [
          {
            id: 'honda-civic-x',
            name: 'Civic X',
            years: '2016 - 2022',
            engines: [
              {
                id: 'honda-civic-15vtec-182',
                name: '1.5 VTEC Turbo (182 KM)',
                fuel: 'Benzyna',
                displacement: '1498 cm³',
                powerHp: 182,
                engineCode: 'L15BA / L15B7',
                oilCapacityLiters: 3.5,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP Resource Conserving', 'ILSAC GF-6A'],
                serviceIntervalKm: '12 000 - 15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HONDA-CIVIC-15TURBO',
                products: matchAsianHybrid('0W-20')
              }
            ]
          },
          {
            id: 'honda-civic-xi',
            name: 'Civic XI',
            years: '2022 - Teraz',
            engines: [
              {
                id: 'honda-civic-20ehev-184',
                name: '2.0 e:HEV Hybrid (184 KM)',
                fuel: 'Hybryda',
                displacement: '1993 cm³',
                powerHp: 184,
                engineCode: 'LFB1',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HONDA-CIVIC-EHEV',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'honda-crv',
        name: 'CR-V',
        generations: [
          {
            id: 'honda-crv-v',
            name: 'CR-V V',
            years: '2017 - 2023',
            engines: [
              {
                id: 'honda-crv-20ehev',
                name: '2.0 i-MMD Hybrid (184 KM)',
                fuel: 'Hybryda',
                displacement: '1993 cm³',
                powerHp: 184,
                engineCode: 'LFB',
                oilCapacityLiters: 4.0,
                recommendedViscosity: '0W-20',
                oemStandards: ['API SP', 'ILSAC GF-6A'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. HONDA-CRV-HYBRID',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 20. NISSAN
  {
    id: 'nissan',
    name: 'Nissan',
    country: 'Japonia',
    models: [
      {
        id: 'nissan-qashqai',
        name: 'Qashqai',
        generations: [
          {
            id: 'nissan-qashqai-j11',
            name: 'Qashqai II (J11)',
            years: '2013 - 2021',
            engines: [
              {
                id: 'nissan-qashqai-13digt-140',
                name: '1.3 DIG-T (140/160 KM)',
                fuel: 'Benzyna',
                displacement: '1332 cm³',
                powerHp: 140,
                engineCode: 'HR13DDT',
                oilCapacityLiters: 5.4,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN17', 'ACEA C3'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. NISSAN-13DIGT',
                products: matchRenault17('5W-30')
              },
              {
                id: 'nissan-qashqai-15dci-115',
                name: '1.5 dCi (115 KM)',
                fuel: 'Diesel',
                displacement: '1461 cm³',
                powerHp: 115,
                engineCode: 'K9K',
                oilCapacityLiters: 4.8,
                recommendedViscosity: '5W-30',
                oemStandards: ['Renault RN0720 / RN17', 'ACEA C3/C4'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. NISSAN-15DCI',
                products: matchRenault17('5W-30')
              }
            ]
          },
          {
            id: 'nissan-qashqai-j12',
            name: 'Qashqai III (J12)',
            years: '2021 - Teraz',
            engines: [
              {
                id: 'nissan-qashqai-13mhev',
                name: '1.3 DIG-T MHEV (140/158 KM)',
                fuel: 'Hybryda',
                displacement: '1332 cm³',
                powerHp: 140,
                engineCode: 'HR13DDT MHEV',
                oilCapacityLiters: 5.4,
                recommendedViscosity: '0W-20 / 5W-30',
                oemStandards: ['Renault RN17 / RN17 FE', 'ACEA C5'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. NISSAN-J12-MHEV',
                products: matchRenault17('5W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 21. PORSCHE
  {
    id: 'porsche',
    name: 'Porsche',
    country: 'Niemcy',
    models: [
      {
        id: 'porsche-macan',
        name: 'Macan',
        generations: [
          {
            id: 'porsche-macan-95b',
            name: 'Macan (95B)',
            years: '2014 - Teraz',
            engines: [
              {
                id: 'porsche-macan-20t-245',
                name: '2.0 Turbo (245/265 KM)',
                fuel: 'Benzyna',
                displacement: '1984 cm³',
                powerHp: 265,
                engineCode: 'EA888 Gen 3/4',
                oilCapacityLiters: 5.2,
                recommendedViscosity: '5W-30 / 0W-30',
                oemStandards: ['Porsche C30', 'VW 504.00'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Performance',
                motulCatalogReference: 'Motul Advisor Ref. PORSCHE-MACAN-20T',
                products: matchVag507('5W-30')
              },
              {
                id: 'porsche-macan-30gts-380',
                name: 'Macan GTS 2.9/3.0 V6 Biturbo (380 KM)',
                fuel: 'Benzyna',
                displacement: '2894 cm³',
                powerHp: 380,
                engineCode: 'EA839 Biturbo',
                oilCapacityLiters: 7.5,
                recommendedViscosity: '0W-40 / 5W-40',
                oemStandards: ['Porsche C40', 'VW 511.00'],
                serviceIntervalKm: '10 000 - 15 000 km',
                filterTier: 'Performance',
                motulCatalogReference: 'Motul Advisor Ref. PORSCHE-MACAN-GTS',
                products: matchHighPerformance('5W-40')
              }
            ]
          }
        ]
      },
      {
        id: 'porsche-cayenne',
        name: 'Cayenne',
        generations: [
          {
            id: 'porsche-cayenne-po536',
            name: 'Cayenne III (PO536)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'porsche-cayenne-30v6-340',
                name: '3.0 V6 Turbo (340 KM)',
                fuel: 'Benzyna',
                displacement: '2995 cm³',
                powerHp: 340,
                engineCode: 'EA839 (Mono Turbo)',
                oilCapacityLiters: 7.5,
                recommendedViscosity: '0W-20',
                oemStandards: ['Porsche C20', 'VW 508.00'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Performance',
                motulCatalogReference: 'Motul Advisor Ref. PORSCHE-CAYENNE-C20',
                products: matchVag508('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 22. ALFA ROMEO
  {
    id: 'alfa-romeo',
    name: 'Alfa Romeo',
    country: 'Włochy',
    models: [
      {
        id: 'alfa-giulia',
        name: 'Giulia',
        generations: [
          {
            id: 'alfa-giulia-952',
            name: 'Giulia (952)',
            years: '2016 - Teraz',
            engines: [
              {
                id: 'alfa-giulia-20tb-200',
                name: '2.0 GME Turbo (200/280 KM)',
                fuel: 'Benzyna',
                displacement: '1995 cm³',
                powerHp: 280,
                engineCode: 'GME MultiAir T4',
                oilCapacityLiters: 5.2,
                recommendedViscosity: '0W-30',
                oemStandards: ['Fiat 9.55535-GS1', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. ALFA-GIULIA-20TB',
                products: matchPsa2312('0W-30')
              },
              {
                id: 'alfa-giulia-22jtdm-190',
                name: '2.2 JTDm (190 KM)',
                fuel: 'Diesel',
                displacement: '2143 cm³',
                powerHp: 190,
                engineCode: 'Multijet II',
                oilCapacityLiters: 4.3,
                recommendedViscosity: '0W-20',
                oemStandards: ['Fiat 9.55535-DSX', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. ALFA-GIULIA-22JTDM',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      },
      {
        id: 'alfa-stelvio',
        name: 'Stelvio',
        generations: [
          {
            id: 'alfa-stelvio-949',
            name: 'Stelvio (949)',
            years: '2017 - Teraz',
            engines: [
              {
                id: 'alfa-stelvio-20tb-280',
                name: '2.0 GME Turbo Q4 (280 KM)',
                fuel: 'Benzyna',
                displacement: '1995 cm³',
                powerHp: 280,
                engineCode: 'GME T4',
                oilCapacityLiters: 5.2,
                recommendedViscosity: '0W-30',
                oemStandards: ['Fiat 9.55535-GS1', 'ACEA C2'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Motul Advisor Ref. ALFA-STELVIO-20TB',
                products: matchPsa2312('0W-30')
              }
            ]
          }
        ]
      }
    ]
  },

  // 23. SUZUKI
  {
    id: 'suzuki',
    name: 'Suzuki',
    country: 'Japonia',
    models: [
      {
        id: 'suzuki-vitara',
        name: 'Vitara',
        generations: [
          {
            id: 'suzuki-vitara-iv',
            name: 'Vitara IV (LY)',
            years: '2015 - Teraz',
            engines: [
              {
                id: 'suzuki-vitara-14boosterjet-129',
                name: '1.4 BoosterJet Hybrid (129 KM)',
                fuel: 'Hybryda',
                displacement: '1373 cm³',
                powerHp: 129,
                engineCode: 'K14D BoosterJet',
                oilCapacityLiters: 3.6,
                recommendedViscosity: '0W-20 / 5W-30',
                oemStandards: ['API SP', 'ILSAC GF-6A', 'ACEA C2'],
                serviceIntervalKm: '15 000 km / 1 rok',
                filterTier: 'Standard',
                motulCatalogReference: 'Motul Advisor Ref. SUZUKI-VITARA-BOOSTERJET',
                products: matchAsianHybrid('0W-20')
              }
            ]
          }
        ]
      }
    ]
  },

  // 24. INNA MARKA / INDYWIDUALNY DOBÓR
  {
    id: 'custom-vehicle',
    name: 'Inna marka / Indywidualny dobór',
    country: 'Pojazdy niestandardowe',
    models: [
      {
        id: 'custom-model',
        name: 'Model niewymieniony powyżej',
        generations: [
          {
            id: 'custom-gen',
            name: 'Wycena i dobór według numeru VIN',
            years: 'Dowolny rocznik',
            engines: [
              {
                id: 'custom-engine-std',
                name: 'Standardowy silnik 4-cylindrowy (pojemność do 2.0L)',
                fuel: 'Benzyna',
                displacement: 'do 2000 cm³',
                powerHp: 150,
                engineCode: 'Dobór katalogowy VIN',
                oilCapacityLiters: 4.5,
                recommendedViscosity: '5W-30 / 0W-20',
                oemStandards: ['Aprobaty fabryczne weryfikowane z katalogu Motul'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Standard',
                motulCatalogReference: 'Weryfikacja bezpośrednia w katalogu MOTUL przed usługą',
                notes: 'Jeżeli Twojego auta nie ma na liście, wpisz numer rejestracyjny lub VIN przy rezerwacji. Technik zweryfikuje specyfikację przed przyjazdem.',
                products: matchVag507('5W-30')
              },
              {
                id: 'custom-engine-large',
                name: 'Duża jednostka V6 / V8 / SUV (pojemność pow. 2.5L)',
                fuel: 'Diesel',
                displacement: 'pow. 2500 cm³',
                powerHp: 250,
                engineCode: 'Duża pojemność miski',
                oilCapacityLiters: 7.0,
                recommendedViscosity: '5W-30 / 0W-30',
                oemStandards: ['Aprobaty producenta pojazdu'],
                serviceIntervalKm: '15 000 km',
                filterTier: 'Premium',
                motulCatalogReference: 'Weryfikacja bezpośrednia w katalogu MOTUL',
                notes: 'Większa miska olejowa (ok. 7 litrów). Cena przeliczona na podstawie dokładnej ilości oleju.',
                products: matchMb22952('5W-30')
              }
            ]
          }
        ]
      }
    ]
  }
];
