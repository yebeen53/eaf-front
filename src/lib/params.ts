export type ParamDefinition = {
  key: string;
  min: number;
  max: number;
  step: number;
  mean: number;
  median: number;
};

export const PARAM_DEFINITIONS: ParamDefinition[] = [
  {
    key: 'len_tilting_height_p8',
    min: 206.78,
    max: 2221.36,
    step: 0.01,
    mean: 972.88,
    median: 893.69,
  },
  { key: 'oxygen_len_p8', min: 98.0, max: 357.0, step: 1, mean: 226.67, median: 222.0 },
  { key: 'coal_stain', min: 11.0, max: 3384.0, step: 1, mean: 531.41, median: 530.0 },
  { key: 'oxygen_bu_p8', min: 21.1, max: 824.32, step: 0.01, mean: 167.2, median: 150.38 },
  { key: 'lng_usage', min: 66.0, max: 268.0, step: 1, mean: 161.1, median: 162.0 },
  { key: 'coal_gsk', min: 6.0, max: 4346.0, step: 1, mean: 465.12, median: 430.0 },
  { key: 'oxygen_bu_p3', min: 300.07, max: 725.93, step: 0.01, mean: 512.86, median: 516.53 },
  {
    key: 'master_location_p8',
    min: 3965.06,
    max: 5821.96,
    step: 0.01,
    mean: 4815.36,
    median: 4817.67,
  },

  {
    key: 'Weight_Sum',
    min: 109.05,
    max: 127.0,
    step: 0.009999999999990905,
    mean: 121.11679888268158,
    median: 121.25,
  },
  {
    key: 'precipitator_gun_p8',
    min: 1080.7,
    max: 2342.46,
    step: 0.009999999999763531,
    mean: 1932.4161452513968,
    median: 1952.18,
  },
];
