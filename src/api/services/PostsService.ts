/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_insert_post_route_api_posts__post } from '../models/Body_insert_post_route_api_posts__post';
import type { Body_update_post_route_api_posts__post_id__put } from '../models/Body_update_post_route_api_posts__post_id__put';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostsService {
    /**
     * Get Posts List Route
     * @param bookTitle
     * @param author
     * @param bookStatus
     * @param courseId
     * @param locationId
     * @param minPrice
     * @param maxPrice
     * @param sortBy
     * @param offset
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPostsListRouteApiPostsGet(
        bookTitle?: (string | null),
        author?: (string | null),
        bookStatus?: (string | null),
        courseId?: (number | null),
        locationId?: (number | null),
        minPrice?: (number | null),
        maxPrice?: (number | null),
        sortBy?: (string | null),
        offset?: (number | null),
        limit?: (number | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/posts/',
            query: {
                'book_title': bookTitle,
                'author': author,
                'book_status': bookStatus,
                'course_id': courseId,
                'location_id': locationId,
                'min_price': minPrice,
                'max_price': maxPrice,
                'sort_by': sortBy,
                'offset': offset,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Insert Post Route
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertPostRouteApiPostsPost(
        formData: Body_insert_post_route_api_posts__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/posts/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Post Route
     * @param postId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPostRouteApiPostsPostIdGet(
        postId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/posts/{post_id}',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Post Route
     * @param postId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updatePostRouteApiPostsPostIdPut(
        postId: number,
        formData?: Body_update_post_route_api_posts__post_id__put,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/posts/{post_id}',
            path: {
                'post_id': postId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel Post Route
     * @param postId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cancelPostRouteApiPostsPostIdCancelPost(
        postId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/posts/{post_id}/cancel',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
