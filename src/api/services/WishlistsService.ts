/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InsertWishlistRequest } from '../models/InsertWishlistRequest';
import type { UpdateWishlistRequest } from '../models/UpdateWishlistRequest';
import type { WishlistResponse } from '../models/WishlistResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WishlistsService {
    /**
     * Get My Wishlists
     * @returns WishlistResponse Successful Response
     * @throws ApiError
     */
    public static getMyWishlistsApiWishlistsGet(): CancelablePromise<Array<WishlistResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/wishlists/',
        });
    }
    /**
     * Insert Wishlist Route
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertWishlistRouteApiWishlistsPost(
        requestBody: InsertWishlistRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wishlists/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Wishlist Route
     * @param wishlistId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateWishlistRouteApiWishlistsWishlistIdPut(
        wishlistId: number,
        requestBody: UpdateWishlistRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/wishlists/{wishlist_id}',
            path: {
                'wishlist_id': wishlistId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Wishlist Route
     * @param wishlistId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteWishlistRouteApiWishlistsWishlistIdDelete(
        wishlistId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/wishlists/{wishlist_id}',
            path: {
                'wishlist_id': wishlistId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
