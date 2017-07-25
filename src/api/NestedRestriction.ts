import {Operators} from './Operator';
import {Clause} from './Clause';
import {Restriction} from './Restriction';

/**
 * Nested query restrictions.
 * @module NestedRestriction
 */
export class NestedRestriction {
    /** The clauses containing the nested restrictions and their logical operators. */
    public clauses = [] as Clause[];

    constructor(...clauses: Clause[]) {
        this.clauses = clauses;
    }

    /** Adds an additional restriction using the logical OR operator. */
    public withOrRestriction(restriction: Restriction|NestedRestriction) {
        return this.withClause(new Clause(restriction, Operators.OR));
    }

    /** Adds an additional restriction using the logical AND operator. */
    public withAndRestriction(restriction: Restriction|NestedRestriction) {
        return this.withClause(new Clause(restriction, Operators.AND));
    }

    /** Adds an additional clause. */
    private withClause(clause: Clause) {
        this.clauses.push(clause);
        return this;
    }

}
