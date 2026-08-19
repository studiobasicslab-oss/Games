/**
 * ISOFILTER: Logic & Routing Engine
 * Evaluates nuclear isotope properties across simple & compound boolean gates.
 */

export const PROPERTY_TYPES = {
    RADIOACTIVE: 'radioactive',
    METAL: 'metal',
    MASS: 'mass',
    ELEMENT: 'element',
    HALF_LIFE: 'half_life',
    DECAY_MODE: 'decay_mode',
    FISSILE: 'fissile'
};

export const COMPARATORS = {
    GT: '>',
    LT: '<',
    EQ: '==',
    GTE: '>=',
    LTE: '<='
};

export const BOOLEAN_OPS = {
    NONE: 'NONE',
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT'
};

/**
 * Check if category is any metal
 */
export function isMetalCategory(category) {
    return category.includes('Metal') || category === 'Actinide';
}

/**
 * Evaluate single atomic condition
 */
export function evaluateCondition(isotope, condition) {
    if (!isotope || !condition) return false;

    switch (condition.type) {
        case PROPERTY_TYPES.RADIOACTIVE: {
            const expected = condition.value === true || condition.value === 'true' || condition.value === 'YES';
            return isotope.radioactive === expected;
        }

        case PROPERTY_TYPES.METAL: {
            const isMetal = isMetalCategory(isotope.category);
            const expected = condition.value === true || condition.value === 'true' || condition.value === 'YES';
            return isMetal === expected;
        }

        case PROPERTY_TYPES.MASS: {
            const targetMass = Number(condition.value);
            const op = condition.operator || COMPARATORS.EQ;
            switch (op) {
                case COMPARATORS.GT: return isotope.mass > targetMass;
                case COMPARATORS.LT: return isotope.mass < targetMass;
                case COMPARATORS.GTE: return isotope.mass >= targetMass;
                case COMPARATORS.LTE: return isotope.mass <= targetMass;
                case COMPARATORS.EQ: return isotope.mass === targetMass;
                default: return isotope.mass === targetMass;
            }
        }

        case PROPERTY_TYPES.ELEMENT: {
            return isotope.element.toLowerCase() === String(condition.value).toLowerCase();
        }

        case PROPERTY_TYPES.HALF_LIFE: {
            // condition.value could be seconds or threshold descriptor
            if (condition.value === 'STABLE') {
                return !isotope.radioactive || isotope.halfLifeSeconds === Infinity;
            }
            if (condition.value === 'UNSTABLE') {
                return isotope.radioactive && isotope.halfLifeSeconds !== Infinity;
            }
            const thresholdSec = Number(condition.seconds || condition.value);
            const op = condition.operator || COMPARATORS.LT;
            if (op === COMPARATORS.LT) {
                return isotope.halfLifeSeconds < thresholdSec;
            } else {
                return isotope.halfLifeSeconds > thresholdSec;
            }
        }

        case PROPERTY_TYPES.DECAY_MODE: {
            return isotope.decayMode.toLowerCase() === String(condition.value).toLowerCase();
        }

        case PROPERTY_TYPES.FISSILE: {
            const expected = condition.value === true || condition.value === 'true' || condition.value === 'YES';
            return isotope.fissile === expected;
        }

        default:
            return false;
    }
}

/**
 * Evaluate compound gate (AND / OR / NOT / Single)
 */
export function evaluateGate(isotope, gateConfig) {
    if (!gateConfig) return false;

    // Direct boolean inversion
    if (gateConfig.op === BOOLEAN_OPS.NOT) {
        return !evaluateGate(isotope, gateConfig.subA);
    }

    if (gateConfig.op === BOOLEAN_OPS.AND) {
        return evaluateGate(isotope, gateConfig.subA) && evaluateGate(isotope, gateConfig.subB);
    }

    if (gateConfig.op === BOOLEAN_OPS.OR) {
        return evaluateGate(isotope, gateConfig.subA) || evaluateGate(isotope, gateConfig.subB);
    }

    // Atomic condition
    return evaluateCondition(isotope, gateConfig);
}

/**
 * Human-readable string representation of a gate
 */
export function formatGateLabel(gateConfig) {
    if (!gateConfig) return 'BYPASS';

    if (gateConfig.op === BOOLEAN_OPS.NOT) {
        return `NOT (${formatGateLabel(gateConfig.subA)})`;
    }
    if (gateConfig.op === BOOLEAN_OPS.AND) {
        return `${formatGateLabel(gateConfig.subA)} AND ${formatGateLabel(gateConfig.subB)}`;
    }
    if (gateConfig.op === BOOLEAN_OPS.OR) {
        return `${formatGateLabel(gateConfig.subA)} OR ${formatGateLabel(gateConfig.subB)}`;
    }

    switch (gateConfig.type) {
        case PROPERTY_TYPES.RADIOACTIVE:
            return gateConfig.value ? 'RADIOACTIVE?' : 'STABLE?';
        case PROPERTY_TYPES.METAL:
            return gateConfig.value ? 'METALLIC?' : 'NON-METAL?';
        case PROPERTY_TYPES.MASS:
            return `MASS ${gateConfig.operator || '=='} ${gateConfig.value}`;
        case PROPERTY_TYPES.ELEMENT:
            return `ELEMENT = ${gateConfig.value.toUpperCase()}`;
        case PROPERTY_TYPES.HALF_LIFE:
            return `HALF-LIFE ${gateConfig.operator || '<'} ${gateConfig.label || gateConfig.value}`;
        case PROPERTY_TYPES.DECAY_MODE:
            return `DECAY: ${gateConfig.value.toUpperCase()}`;
        case PROPERTY_TYPES.FISSILE:
            return gateConfig.value ? 'FISSILE FUEL?' : 'NON-FISSILE?';
        default:
            return 'GATE';
    }
}
