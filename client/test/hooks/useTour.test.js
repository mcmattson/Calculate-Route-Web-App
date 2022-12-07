import '@testing-library/jest-dom';
import {act, renderHook} from '@testing-library/react-hooks';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { REVERSE_GEOCODE_RESPONSE, MOCK_PLACE_RESPONSE } from '../sharedMocks';
import { LOG } from '../../src/utils/constants';
import { useTour } from '../../src/hooks/useTour';


describe('useTour', () => {
    test('base: appends a place', async () => {
        expect(1).toEqual(1);
    });

    const mockLatLng = { lat: 40.570, lng: -105.085 };
    
    let hook;

    beforeEach(() => {
        jest.clearAllMocks();
        fetch.resetMocks();
        const { result } = renderHook(() => useTour());
        hook = result;
    });

    test('mikylab: useTour without any places', async () => {
        expect(hook.current.serverTour).toEqual([]);
    });
    
});