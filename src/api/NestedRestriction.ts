import {Operators} from './Operator';
import {Clause} from './Clause';
import {Restriction} from './Restriction';

/**
 * Nested query restrictions.
 * @module NestedRestriction
 */
export class NestedRestriction {
    /** given a nested restriction JSON structure, return a NestedRestriction object */
    public static fromJson(nestedRestriction: any): NestedRestriction {
        const newNestedRestriction = new NestedRestriction();
        if (nestedRestriction && nestedRestriction.clauses) {
            nestedRestriction.clauses.forEach((clause: any) => {
                newNestedRestriction.withClause(Clause.fromJson(clause));
            });
        }
        return newNestedRestriction;
    }

    /** The clauses containing the nested restrictions and their logical operators. */
    public clauses?: Clause[];

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
        if (!this.clauses) {
            this.clauses = [] as Clause[];
        }
        this.clauses.push(clause);
        return this;
    }
}
