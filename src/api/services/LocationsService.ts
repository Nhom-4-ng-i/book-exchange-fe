/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InsertUpdateLocationRequest } from '../models/InsertUpdateLocationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LocationsService {
    /**
     * Get Locations List Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getLocationsListRouteApiLocationsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/locations/',
        });
    }
    /**
     * Insert Location Route
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertLocationRouteApiLocationsPost(
        requestBody: InsertUpdateLocationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/locations/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Location Route
     * @param locationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getLocationRouteApiLocationsLocationIdGet(
        locationId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/locations/{location_id}',
            path: {
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Location Route
     * @param locationId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateLocationRouteApiLocationsLocationIdPut(
        locationId: number,
        requestBody: InsertUpdateLocationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/locations/{location_id}',
            path: {
                'location_id': locationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Location Route
     * @param locationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteLocationRouteApiLocationsLocationIdDelete(
        locationId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/locations/{location_id}',
            path: {
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
