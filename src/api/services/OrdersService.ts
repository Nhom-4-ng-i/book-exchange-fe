/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InsertOrderRequest } from '../models/InsertOrderRequest';
import type { UpdateOrderRequest } from '../models/UpdateOrderRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Get Orders List Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getOrdersListRouteApiOrdersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/',
        });
    }
    /**
     * Insert Order Route
     * @param requestBody
     * @param authorization
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertOrderRouteApiOrdersPost(
        requestBody: InsertOrderRequest,
        authorization?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/',
            headers: {
                'authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Order Route
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getOrderRouteApiOrdersOrderIdGet(
        orderId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Order Route
     * @param orderId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateOrderRouteApiOrdersOrderIdPut(
        orderId: number,
        requestBody: UpdateOrderRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Order Route
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteOrderRouteApiOrdersOrderIdDelete(
        orderId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
