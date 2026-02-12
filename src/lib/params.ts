import allFeatureStats from '../../all_feature_stats.json';
import controlVarsStats from '../../control_vars_stats.json';

export type ParamDefinition = {
  key: string;
  min: number;
  max: number;
  step: number | null;
  mean: number;
  median: number;
};

const CONTROL_VAR_STATS = controlVarsStats as ParamDefinition[];
const ALL_FEATURE_STATS = allFeatureStats as ParamDefinition[];
const CONTROL_VAR_STATS_BY_KEY = new Map(CONTROL_VAR_STATS.map((param) => [param.key, param]));

export const ADJUSTABLE_PARAM_KEYS = CONTROL_VAR_STATS.map((param) => param.key);

const ALL_FEATURE_KEY_SET = new Set(ALL_FEATURE_STATS.map((param) => param.key));
const missingControlKeys = ADJUSTABLE_PARAM_KEYS.filter((key) => !ALL_FEATURE_KEY_SET.has(key));
if (missingControlKeys.length > 0) {
  console.warn(
    `[params] Missing keys in all_feature_stats.json (fallback to control_vars_stats.json): ${missingControlKeys.join(', ')}`,
  );
}

const mergedParamDefinitions = ALL_FEATURE_STATS.map(
  (param) => CONTROL_VAR_STATS_BY_KEY.get(param.key) ?? param,
);

for (const controlParam of CONTROL_VAR_STATS) {
  if (!ALL_FEATURE_KEY_SET.has(controlParam.key)) {
    mergedParamDefinitions.push(controlParam);
  }
}

export const PARAM_DEFINITIONS: ParamDefinition[] = mergedParamDefinitions;
