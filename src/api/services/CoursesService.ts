/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InsertUpdateCourseRequest } from '../models/InsertUpdateCourseRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoursesService {
    /**
     * Get Courses List Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCoursesListRouteApiCoursesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/',
        });
    }
    /**
     * Insert Course Route
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertCourseRouteApiCoursesPost(
        requestBody: InsertUpdateCourseRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Course Route
     * @param courseId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCourseRouteApiCoursesCourseIdGet(
        courseId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/{course_id}',
            path: {
                'course_id': courseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Course Route
     * @param courseId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateCourseRouteApiCoursesCourseIdPut(
        courseId: number,
        requestBody: InsertUpdateCourseRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/courses/{course_id}',
            path: {
                'course_id': courseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Course Route
     * @param courseId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteCourseRouteApiCoursesCourseIdDelete(
        courseId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/{course_id}',
            path: {
                'course_id': courseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
