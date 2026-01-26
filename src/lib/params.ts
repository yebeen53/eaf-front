export type ParamDefinition = {
  key: string;
  min: number;
  max: number;
  step: number;
  mean: number;
  median: number;
};

export const PARAM_DEFINITIONS: ParamDefinition[] = [
  { key: 'len_tilting_height_p8', min: 206.78, max: 2221.36, step: 0.01, mean: 972.88, median: 893.69 },
  { key: 'SiMn_HP', min: 271.0, max: 1000.0, step: 1, mean: 682.59, median: 700.0 },
  { key: 'len_flow_p8', min: 6283.33, max: 30508.34, step: 0.01, mean: 18421.7, median: 18073.34 },
  { key: 'scrap_h2', min: 3.0, max: 30.0, step: 1, mean: 15.44, median: 10.0 },
  { key: 'oxygen_len_p8', min: 98.0, max: 357.0, step: 1, mean: 226.67, median: 222.0 },
  { key: 'scrap_gs', min: 0.05, max: 40.0, step: 0.01, mean: 16.38, median: 15.0 },
  { key: 'coal_stain', min: 11.0, max: 3384.0, step: 1, mean: 531.41, median: 530.0 },
  { key: 'scrap_russia', min: 10.0, max: 50.0, step: 1, mean: 20.67, median: 20.0 },
  { key: 'scrap_heavy_b', min: 10.0, max: 60.0, step: 1, mean: 32.07, median: 30.0 },
  { key: 'scrap_heavy_a', min: 10.0, max: 56.0, step: 1, mean: 32.83, median: 30.0 },
  { key: 'len_tilting_height_p5', min: 377.89, max: 1904.11, step: 0.01, mean: 936.49, median: 972.24 },
  { key: 'len_tilting_height_p3', min: 286.55, max: 1508.23, step: 0.01, mean: 940.7, median: 971.3 },
  { key: 'len_tilting_width_p3', min: 436.3, max: 2004.45, step: 0.01, mean: 1251.33, median: 1275.17 },
  { key: 'len_tilting_width_p8', min: 489.92, max: 1378.12, step: 0.01, mean: 934.59, median: 938.29 },
  { key: 'len_tilting_width_p5', min: 685.67, max: 1911.76, step: 0.01, mean: 1332.33, median: 1339.55 },
  { key: 'scrap_iron_powder', min: 4.0, max: 40.0, step: 1, mean: 11.51, median: 9.0 },
  { key: 'scrap_domestic', min: 0.25, max: 52.95, step: 0.01, mean: 18.97, median: 18.4 },
  { key: 'oxygen_bu_p8', min: 21.1, max: 824.32, step: 0.01, mean: 167.2, median: 150.38 },
  { key: 'oxygen_len_p5', min: 298.0, max: 602.0, step: 1, mean: 450.4, median: 449.0 },
  { key: 'small_lump', min: 200.0, max: 1984.0, step: 1, mean: 574.85, median: 604.0 },
  { key: 'lng_usage', min: 66.0, max: 268.0, step: 1, mean: 161.1, median: 162.0 },
  { key: 'coal_gsk', min: 6.0, max: 4346.0, step: 1, mean: 465.12, median: 430.0 },
  { key: 'oxygen_bu_p5', min: 153.42, max: 599.22, step: 0.01, mean: 375.24, median: 369.35 },
  { key: 'master_location_p5', min: 3003.37, max: 5145.92, step: 0.01, mean: 4248.17, median: 4252.16 },
  { key: 'oxygen_bu_p3', min: 300.07, max: 725.93, step: 0.01, mean: 512.86, median: 516.53 },
  { key: 'len_flow_p5', min: 14716.67, max: 96520.0, step: 0.01, mean: 31051.69, median: 30826.66 },
  { key: 'oxygen_len_p3', min: 420.0, max: 778.0, step: 1, mean: 602.55, median: 604.0 },
  { key: 'master_location_p8', min: 3965.06, max: 5821.96, step: 0.01, mean: 4815.36, median: 4817.67 },
  { key: 'scrap_h1', min: 5.0, max: 20.0, step: 1, mean: 12.89, median: 10.0 },
  { key: 'Briquette_HP1', min: 15.0, max: 1245.0, step: 1, mean: 372.63, median: 407.0 },
  { key: 'scrap_bal_go', min: 5.0, max: 65.55, step: 0.01, mean: 5.12, median: 5.0 },
  { key: 'len_flow_p3', min: 20294.99, max: 49996.66, step: 0.01, mean: 40981.41, median: 40945.01 },
  { key: 'scrap_container', min: 3.0, max: 40.0, step: 1, mean: 14.64, median: 10.0 },
  { key: 'master_location_p3', min: 3432.38, max: 5229.98, step: 0.01, mean: 4347.86, median: 4349.85 },
  { key: 'CaO_HP', min: 495.0, max: 991.0, step: 1, mean: 640.99, median: 598.0 },
  { key: 'Briquette_HP2', min: 32.0, max: 1509.0, step: 1, mean: 353.06, median: 308.0 },
  { key: 'FeSi_HP', min: 29.0, max: 749.0, step: 1, mean: 243.43, median: 249.0 },
  { key: 'FeMn_HP', min: 505.0, max: 1927.0, step: 1, mean: 647.72, median: 609.0 },
];
