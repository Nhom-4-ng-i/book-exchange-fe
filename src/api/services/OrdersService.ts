/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InsertOrderRequest } from '../models/InsertOrderRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Insert Order Route
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertOrderRouteApiOrdersPost(
        requestBody: InsertOrderRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Accept Order Route
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static acceptOrderRouteApiOrdersOrderIdAcceptPost(
        orderId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{order_id}/accept',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reject Order Route
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rejectOrderRouteApiOrdersOrderIdRejectPost(
        orderId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{order_id}/reject',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Complete Order Route
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static completeOrderRouteApiOrdersOrderIdCompletePost(
        orderId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{order_id}/complete',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel Order Route
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cancelOrderRouteApiOrdersOrderIdCancelPost(
        orderId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{order_id}/cancel',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Seller Orders Api
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSellerOrdersApiApiOrdersSellerGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/seller',
        });
    }
}
