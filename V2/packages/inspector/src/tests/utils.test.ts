import { describe, expect, test } from 'vitest'

import { secondsToClockString } from '../utils'

describe('secondsToClockString', () => {
    describe('with no decimal places', () => {
        test.each([
            [0, '00:00:00'],
            [5, '00:00:05'],
            [55, '00:00:55'],
            [60, '00:01:00'],
            [90, '00:01:30'],
            [60 * 10, '00:10:00'],
            [60 * 60, '01:00:00'],
            [60 * 60 + 60 * 32 + 7, '01:32:07'],
        ])('%d seconds -> %s', (seconds, expected) => {
            expect(secondsToClockString(seconds)).toBe(expected)
        })
    })

    describe('with decimal places', () => {
        test.each([
            [0, 0, '00:00:00'],
            [0, 1, '00:00:00.0'],
            [0, 2, '00:00:00.00'],
            [0, 3, '00:00:00.000'],
            [5.123, 1, '00:00:05.1'],
            [5.123, 2, '00:00:05.12'],
            [5.123, 3, '00:00:05.123'],
            [60 * 60 + 60 * 32 + 7.413, 1, '01:32:07.4'],
            [60 * 60 + 60 * 32 + 7.493, 1, '01:32:07.5'], // rounds
            [60 * 60 + 60 * 32 + 7.142, 2, '01:32:07.14'],
            [60 * 60 + 60 * 32 + 7.149, 2, '01:32:07.15'], // rounds
            [60 * 60 + 60 * 32 + 7.789, 3, '01:32:07.789'],
            [5, 0, '00:00:05'],
            [55, 0, '00:00:55'],
            [60, 0, '00:01:00'],
            [90, 0, '00:01:30'],
            [60 * 10, 0, '00:10:00'],
            [60 * 60, 0, '01:00:00'],
            [60 * 60 + 60 * 32 + 7, 0, '01:32:07'],
        ])('%d seconds, %i decimal places -> %s', (seconds, decimalPlaces, expected) => {
            expect(secondsToClockString(seconds, decimalPlaces)).toBe(expected)
        })
    })
})
