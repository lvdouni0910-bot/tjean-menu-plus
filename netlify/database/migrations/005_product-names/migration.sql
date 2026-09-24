-- Product naming update. Existing migrations 001-004 are immutable.
UPDATE activation_codes SET model='ShellBake S1' WHERE model IN ('Shell S1','ShellBake S1');
UPDATE activation_codes SET model='LumiBake S1 Pro' WHERE model IN ('Vision S1 Pro','LumiBake S1 Pro');
UPDATE activation_codes SET model='JoyBake' WHERE model IN ('32L','32L Steam Oven','JoyBake');

-- Update recipe parameter keys without overwriting existing parameter values.
UPDATE recipes
SET params = (params - 'Shell S1') || jsonb_build_object('ShellBake S1', params->'Shell S1')
WHERE params ? 'Shell S1';
UPDATE recipes
SET params = (params - 'Vision S1 Pro') || jsonb_build_object('LumiBake S1 Pro', params->'Vision S1 Pro')
WHERE params ? 'Vision S1 Pro';
UPDATE recipes
SET params = (params - '32L Steam Oven') || jsonb_build_object('JoyBake', params->'32L Steam Oven')
WHERE params ? '32L Steam Oven';
