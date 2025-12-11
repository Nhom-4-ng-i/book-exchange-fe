/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get My Profile Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMyProfileRouteApiUserMeGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/me',
        });
    }
    /**
     * Get My Posts Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMyPostsRouteApiUserPostsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/posts',
        });
    }
    /**
     * Get My Orders Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMyOrdersRouteApiUserOrdersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/orders',
        });
    }
}
