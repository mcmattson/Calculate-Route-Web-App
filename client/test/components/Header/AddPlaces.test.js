import React from 'react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import user from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import AddPlace from '../../../src/components/Header/AddPlace';
import {
	REVERSE_GEOCODE_RESPONSE,
	MOCK_PLACE_RESPONSE,
} from '../../sharedMocks';

describe('AddPlace', () => {
	const placeObj = {
		latLng: '40.57, -105.085',
		name: 'Colorado State University, South College Avenue, Fort Collins, Larimer County, Colorado, 80525-1725, United States',
		match: 'Dave'
	};

	const props = {
		toggleAddPlace: jest.fn(),
		append: jest.fn(),
		isOpen: true,
		show: jest.fn(),
	};

	beforeEach(() => {
		render(
			<AddPlace
				append={props.append}
				isOpen={props.isOpen}
				toggleAddPlace={props.toggleAddPlace}
				show={props.show}
			/>
		);
	});

	test('base: validates coord input', async () => {
		const coordInput = screen.getByTestId('coord-input');
		user.type(coordInput, placeObj.latLng);

		await waitFor(() => {
			expect(coordInput.value).toEqual(placeObj.latLng);
		});
	});

	test('mmattson: validates name input', async () => {
		 const nameInput = screen.getByTestId('name-input');
		user.type(nameInput, placeObj.match);

		await waitFor(() => {
			expect(nameInput.value).toEqual(placeObj.match);
		}); 
	});

	test('base: handles invalid input', async () => {
		 const coordInput = screen.getByTestId('coord-input');
		user.paste(coordInput, '1');

		await waitFor(() => {
			expect(coordInput.value).toEqual('1');
		});

		const addButton = screen.getByTestId('add-coord-button');
		expect(addButton.classList.contains('disabled')).toBe(true); 
	});

	/* test('mmattson: handles invalid name input', async () => {
	 	const nameInput = screen.getByTestId('name-input');
		user.paste(nameInput, 'da');
		
		await waitFor(() => {
			expect(nameInput.value).toEqual('da');
		});

		const addButton = screen.getByTestId('add-name-button');
		expect(addButton.classList.contains('disabled')).toBe(true); 
	}); */

	test('mmattson: handles valid name input not found', async () => {
		/*  const nameInput = screen.getByTestId('name-input');
		user.paste(nameInput, placeObj.match);

		await waitFor(() => {
			expect(nameInput.value).toEqual(placeObj.match);
		});

		user.click(toggle);
		expect(screen.getByText(/expanded test/i)).toBeTruthy();
		const nameList = screen.getByTestId('places1-div');
		expect(nameList.classList.contains('button')).toBeNull;  */
	});

	test('mmattson: handles valid name input', async () => {
		/*  const nameInput = screen.getByTestId('name-input');
		user.paste(nameInput, 'dav');

		await waitFor(() => {
			expect(nameInput.value).toEqual('dav');
		});

		const listMap = screen.getByTestId('places1-div');
		await waitFor(() => {
			expect(listMap.value.contains('37.9620018005,-87.7789001465')).toBe(true);
		}); */
	});

	test('mmattson: handles valid selection of names on list', async () => {
		/* const nameInput = screen.getByTestId('name-input');
		user.paste(nameInput, 'dav');

		await waitFor(() => {
			expect(nameInput.value).toEqual('dav');
		});

		const addButton = screen.getByTestId('places1-btn');
		expect(addButton.classList.contains('arrList')).toBe(true); */
	});

	test('mmattson: handles valid adding name from selection to map', async () => {
		/* const nameInput = screen.getByTestId('name-input');
		user.paste(nameInput, 'dav');

		await waitFor(() => {
			expect(nameInput.value).toEqual('dav');
		});

		const addButton = screen.getByTestId('places1-btn');
		expect(addButton.classList.contains('arrList')).toBe(true); */
	});
	

	test('base: Adds coord place', async () => {
		  fetch.mockResponse(REVERSE_GEOCODE_RESPONSE);
		const coordInput = screen.getByTestId('coord-input');
		user.type(coordInput, placeObj.latLng);

		await waitFor(() => {
			expect(coordInput.value).toEqual(placeObj.latLng);
		});

		const addButton = screen.getByTestId('add-coord-button');
		expect(addButton.classList.contains('disabled')).toBe(false);
		await waitFor(() => {
			user.click(addButton);
		});
		expect(props.append).toHaveBeenCalledWith(MOCK_PLACE_RESPONSE);
		expect(coordInput.value).toEqual('');  
	});
});
