/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InsertPostRequest } from '../models/InsertPostRequest';
import type { UpdatePostRequest } from '../models/UpdatePostRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostsService {
    /**
     * Get Posts List Route
     * @param status
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
        status?: (Array<string> | null),
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
                'status': status,
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
     * @param requestBody
     * @param authorization
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertPostRouteApiPostsPost(
        requestBody: InsertPostRequest,
        authorization?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/posts/',
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
     * @param requestBody
     * @param authorization
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updatePostRouteApiPostsPostIdPut(
        postId: number,
        requestBody: UpdatePostRequest,
        authorization?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/posts/{post_id}',
            path: {
                'post_id': postId,
            },
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
     * Delete Post Route
     * @param postId
     * @param authorization
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePostRouteApiPostsPostIdDelete(
        postId: number,
        authorization?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/posts/{post_id}',
            path: {
                'post_id': postId,
            },
            headers: {
                'authorization': authorization,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
