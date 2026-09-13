import { describe, expect, test } from 'vitest';
import { addLeadingZeros } from '../../src/utils/utils';



describe('utils', () => {
    test('addLeadingZeros', () => {
        const result = addLeadingZeros(1, 3)
        expect(result.length).toBe(3);
    })

    test.todo("clamp", () => {});
});