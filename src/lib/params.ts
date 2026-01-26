export type ParamDefinition = {
  key: string;
  min: number;
  max: number;
  step: number;
  mean: number;
};

export const PARAM_DEFINITIONS: ParamDefinition[] = [
  { key: 'len_tilting_height_p8', min: 206.78, max: 2221.36, step: 0.01, mean: 972.8817517 },
  { key: 'SiMn_HP', min: 271, max: 1000, step: 1, mean: 682.586172 },
  { key: 'len_flow_p8', min: 6283.33, max: 30508.34, step: 0.01, mean: 18421.70172 },
  { key: 'scrap_h2', min: 3, max: 30, step: 1, mean: 15.44220214 },
  { key: 'oxygen_len_p8', min: 98, max: 357, step: 1, mean: 226.668536 },
  { key: 'scrap_gs', min: 0.05, max: 40, step: 0.01, mean: 16.38421018 },
  { key: 'coal_stain', min: 11, max: 3384, step: 1, mean: 531.406536 },
  { key: 'scrap_russia', min: 10, max: 50, step: 1, mean: 20.66666667 },
  { key: 'scrap_heavy_b', min: 10, max: 60, step: 1, mean: 32.07465169 },
  { key: 'scrap_heavy_a', min: 10, max: 56, step: 1, mean: 32.82619408 },
  { key: 'len_tilting_height_p5', min: 377.89, max: 1904.11, step: 0.01, mean: 936.4938087 },
  { key: 'len_tilting_height_p3', min: 286.55, max: 1508.23, step: 0.01, mean: 940.7025121 },
  { key: 'len_tilting_width_p3', min: 436.3, max: 2004.45, step: 0.01, mean: 1251.332122 },
  { key: 'len_tilting_width_p8', min: 489.92, max: 1378.12, step: 0.01, mean: 934.5860382 },
  { key: 'len_tilting_width_p5', min: 685.67, max: 1911.76, step: 0.01, mean: 1332.327431 },
  { key: 'scrap_iron_powder', min: 4, max: 40, step: 1, mean: 11.50995167 },
  { key: 'scrap_domestic', min: 0.25, max: 52.95, step: 0.01, mean: 18.97117749 },
  { key: 'oxygen_bu_p8', min: 21.1, max: 824.32, step: 0.01, mean: 167.202079 },
  { key: 'oxygen_len_p5', min: 298, max: 602, step: 1, mean: 450.399093 },
  { key: 'small_lump', min: 200, max: 1984, step: 1, mean: 574.854742 },
  { key: 'lng_usage', min: 66, max: 268, step: 1, mean: 161.102362 },
  { key: 'coal_gsk', min: 6, max: 4346, step: 1, mean: 465.124905 },
  { key: 'oxygen_bu_p5', min: 153.42, max: 599.22, step: 0.01, mean: 375.239534 },
  { key: 'master_location_p5', min: 3003.37, max: 5145.92, step: 0.01, mean: 4248.172313 },
  { key: 'oxygen_bu_p3', min: 300.07, max: 725.93, step: 0.01, mean: 512.855033 },
  { key: 'len_flow_p5', min: 14716.67, max: 96520, step: 0.01, mean: 31051.69055 },
  { key: 'oxygen_len_p3', min: 420, max: 778, step: 1, mean: 602.547405 },
  { key: 'master_location_p8', min: 3965.06, max: 5821.96, step: 0.01, mean: 4815.363336 },
  { key: 'scrap_h1', min: 5, max: 20, step: 1, mean: 12.89340102 },
  { key: 'Briquette_HP1', min: 15, max: 1245, step: 1, mean: 372.632883 },
  { key: 'scrap_bal_go', min: 5, max: 65.55, step: 0.01, mean: 5.119211351 },
  { key: 'len_flow_p3', min: 20294.99, max: 49996.66, step: 0.01, mean: 40981.41168 },
  { key: 'scrap_container', min: 3, max: 40, step: 1, mean: 14.64368263 },
  { key: 'master_location_p3', min: 3432.38, max: 5229.98, step: 0.01, mean: 4347.856964 },
  { key: 'CaO_HP', min: 495, max: 991, step: 1, mean: 640.993083 },
  { key: 'Briquette_HP2', min: 32, max: 1509, step: 1, mean: 353.062223 },
  { key: 'FeSi_HP', min: 29, max: 749, step: 1, mean: 243.434525 },
  { key: 'FeMn_HP', min: 505, max: 1927, step: 1, mean: 647.71681 },
];
